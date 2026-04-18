// workers/gtfs-score-cron/index.js
// ── Runs daily at 6am UTC ─────────────────────────────────────────────────────
// Downloads each city's GTFS static zip, parses stop_times + stops,
// computes frequency (avg peak headway) and coverage (% within 400m grid),
// writes results to KV.

import { CITIES, BOUNDS, normalize, computeScore } from "../../shared/cities.js";

export default {
  // Cron trigger entry point
  async scheduled(event, env, ctx) {
    console.log("gtfs-score-cron: starting run", new Date().toISOString());

    const results = [];

    for (const city of CITIES) {
      try {
        console.log(`Processing: ${city.name}`);
        const scores = await processCityGTFS(city);

        // Read existing pain score from KV to merge
        const existing = await env.TRANSIT_KV.get(`city:${city.id}`, "json") || {};

        const record = {
          ...existing,
          id: city.id,
          name: city.name,
          state: city.state,
          rail_feed: city.rail_feed,
          frequency_score: scores.frequency_score,
          coverage_score: scores.coverage_score,
          avg_headway_minutes: scores.avg_headway_minutes,
          coverage_pct: scores.coverage_pct,
          stop_count: scores.stop_count,
          gtfs_computed_at: new Date().toISOString(),
        };

        // Recompute overall score if we have pain data
        if (existing.pain_factor) {
          record.score = computeScore(
            scores.avg_headway_minutes,
            scores.coverage_pct,
            existing.pain_factor
          );
        }

        await env.TRANSIT_KV.put(`city:${city.id}`, JSON.stringify(record));
        results.push({ city: city.id, status: "ok", ...scores });

      } catch (err) {
        console.error(`Failed: ${city.name}`, err.message);
        results.push({ city: city.id, status: "error", error: err.message });
      }
    }

    // Write summary index
    await env.TRANSIT_KV.put("index:last_run", JSON.stringify({
      ran_at: new Date().toISOString(),
      results,
    }));

    console.log("gtfs-score-cron: done", results);
  },

  // Allow manual trigger via HTTP for testing
  async fetch(request, env) {
    if (new URL(request.url).pathname === "/run") {
      await this.scheduled({}, env, {});
      return new Response("Done", { status: 200 });
    }
    return new Response("gtfs-score-cron worker", { status: 200 });
  },
};

// ── GTFS Processing ───────────────────────────────────────────────────────────

async function processCityGTFS(city) {
  const zip = await fetchGTFSZip(city.gtfs_static);

  const [stopTimes, stops, trips, calendar] = await Promise.all([
    parseCSV(zip, "stop_times.txt"),
    parseCSV(zip, "stops.txt"),
    parseCSV(zip, "trips.txt"),
    parseCSVSafe(zip, "calendar.txt"), // some agencies use calendar_dates.txt only
  ]);

  const frequency = computeFrequency(stopTimes, trips, calendar);
  const coverage  = computeCoverage(stops);

  return {
    avg_headway_minutes: frequency.avg_headway,
    peak_headway_minutes: frequency.peak_headway,
    frequency_score: normalize(frequency.avg_headway, BOUNDS.headway, "lower_better"),
    coverage_pct: coverage.pct,
    stop_count: coverage.stop_count,
    coverage_score: normalize(coverage.pct, BOUNDS.coverage, "higher_better"),
  };
}

// ── Frequency: average headway during peak hours ──────────────────────────────
// Peak = 7–9am and 4–7pm weekdays
// We sample stops and compute average gap between arrivals

function computeFrequency(stopTimes, trips, calendar) {
  // Get weekday service IDs
  const weekdayServices = new Set(
    (calendar || [])
      .filter(r => r.monday === "1" || r.tuesday === "1" || r.wednesday === "1")
      .map(r => r.service_id)
  );

  // Build trip → service_id map
  const tripService = {};
  trips.forEach(t => { tripService[t.trip_id] = t.service_id; });

  // Filter to peak-hour arrivals on weekday services
  // Peak windows: 07:00–09:00 and 16:00–19:00
  const peakArrivals = {}; // stop_id → [arrival_seconds]

  stopTimes.forEach(st => {
    const serviceId = tripService[st.trip_id];
    if (calendar && !weekdayServices.has(serviceId)) return;

    const secs = timeToSeconds(st.arrival_time);
    const inAMPeak = secs >= 7 * 3600 && secs <= 9 * 3600;
    const inPMPeak = secs >= 16 * 3600 && secs <= 19 * 3600;
    if (!inAMPeak && !inPMPeak) return;

    if (!peakArrivals[st.stop_id]) peakArrivals[st.stop_id] = [];
    peakArrivals[st.stop_id].push(secs);
  });

  // Compute average headway per stop, then average across stops
  const headways = [];

  Object.values(peakArrivals).forEach(arrivals => {
    if (arrivals.length < 2) return;
    arrivals.sort((a, b) => a - b);
    const gaps = [];
    for (let i = 1; i < arrivals.length; i++) {
      const gap = (arrivals[i] - arrivals[i - 1]) / 60; // minutes
      if (gap > 0 && gap < 120) gaps.push(gap); // ignore overnight gaps
    }
    if (gaps.length) headways.push(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  });

  if (!headways.length) return { avg_headway: 60, peak_headway: 60 };

  const avg = headways.reduce((a, b) => a + b, 0) / headways.length;
  const peak = Math.min(...headways);

  return {
    avg_headway: Math.round(avg * 10) / 10,
    peak_headway: Math.round(peak * 10) / 10,
  };
}

// ── Coverage: % of city bounding box within 400m of any stop ─────────────────

function computeCoverage(stops) {
  if (!stops.length) return { pct: 0, stop_count: 0 };

  const lats = stops.map(s => parseFloat(s.stop_lat)).filter(Boolean);
  const lons = stops.map(s => parseFloat(s.stop_lon)).filter(Boolean);

  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);

  // Sample a grid of points across the bounding box (~200m resolution)
  const GRID_STEPS = 40;
  const latStep = (maxLat - minLat) / GRID_STEPS;
  const lonStep = (maxLon - minLon) / GRID_STEPS;
  const RADIUS_KM = 0.4; // 400 meters

  let covered = 0, total = 0;

  for (let i = 0; i <= GRID_STEPS; i++) {
    for (let j = 0; j <= GRID_STEPS; j++) {
      const lat = minLat + i * latStep;
      const lon = minLon + j * lonStep;
      total++;

      const isNear = stops.some(stop => {
        const d = haversineKm(lat, lon, parseFloat(stop.stop_lat), parseFloat(stop.stop_lon));
        return d <= RADIUS_KM;
      });

      if (isNear) covered++;
    }
  }

  return {
    pct: Math.round((covered / total) * 1000) / 10,
    stop_count: stops.length,
  };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function timeToSeconds(timeStr) {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchGTFSZip(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "fixsactransit.org/1.0 (civic data project)" },
    cf: { cacheTtl: 3600 }, // cache the zip for 1hr at Cloudflare edge
  });
  if (!res.ok) throw new Error(`GTFS fetch failed: ${res.status} ${url}`);
  return await res.arrayBuffer();
}

// Parse a CSV file from an in-memory zip buffer
// Uses a minimal zip parser — no npm dependencies needed in Workers
async function parseCSV(zipBuffer, filename) {
  const text = await extractFileFromZip(zipBuffer, filename);
  if (!text) throw new Error(`${filename} not found in GTFS zip`);
  return csvToObjects(text);
}

async function parseCSVSafe(zipBuffer, filename) {
  try { return await parseCSV(zipBuffer, filename); }
  catch { return null; }
}

function csvToObjects(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].replace(/\r/g, "").split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line.replace(/\r/g, ""));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || "").replace(/^"|"$/g, "").trim(); });
    return obj;
  });
}

function splitCSVLine(line) {
  const result = [];
  let current = "", inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { result.push(current); current = ""; continue; }
    current += ch;
  }
  result.push(current);
  return result;
}

// Minimal ZIP extractor — handles stored + deflated entries
// Cloudflare Workers support DecompressionStream natively
async function extractFileFromZip(buffer, targetFilename) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  let offset = 0;

  while (offset < bytes.length - 4) {
    const sig = view.getUint32(offset, true);
    if (sig !== 0x04034b50) break; // local file header signature

    const compression = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const filenameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);

    const filenameBytes = bytes.slice(offset + 30, offset + 30 + filenameLen);
    const filename = new TextDecoder().decode(filenameBytes);

    const dataStart = offset + 30 + filenameLen + extraLen;
    const compressedData = bytes.slice(dataStart, dataStart + compressedSize);

    if (filename === targetFilename || filename.endsWith("/" + targetFilename)) {
      if (compression === 0) {
        // Stored (no compression)
        return new TextDecoder().decode(compressedData);
      } else if (compression === 8) {
        // Deflate
        const ds = new DecompressionStream("deflate-raw");
        const writer = ds.writable.getWriter();
        writer.write(compressedData);
        writer.close();
        const decompressed = await new Response(ds.readable).arrayBuffer();
        return new TextDecoder().decode(decompressed);
      }
      throw new Error(`Unsupported compression: ${compression}`);
    }

    offset = dataStart + compressedSize;
  }

  return null;
}
