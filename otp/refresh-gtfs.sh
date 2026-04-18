#!/bin/bash
# ── fixsactransit OTP GTFS Refresh ───────────────────────────────────────────
# Re-downloads all GTFS feeds and rebuilds the OTP graph
# Run weekly via cron: 0 3 * * 0 /opt/otp/refresh-gtfs.sh >> /var/log/otp-refresh.log 2>&1
#
# Agencies update their GTFS feeds on varying schedules.
# Weekly refresh ensures schedules stay accurate.

set -e

OTP_DIR="/opt/otp"
OTP_JAR=$(ls ${OTP_DIR}/otp-*.jar | head -1)
DATA_DIR="/opt/otp/data"
GRAPHS_DIR="/opt/otp/graphs/default"
LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')]"

echo "${LOG_PREFIX} Starting GTFS refresh..."

# Download with retry — some agency servers are flaky
download_with_retry() {
  local name=$1
  local url=$2
  local outfile="${DATA_DIR}/${name}-gtfs-new.zip"
  local existing="${DATA_DIR}/${name}-gtfs.zip"

  for attempt in 1 2 3; do
    if wget -q --timeout=60 \
      --user-agent="fixsactransit.org/1.0 (civic transit data project)" \
      -O "$outfile" "$url"; then

      # Validate it's actually a zip
      if file "$outfile" | grep -q "Zip archive"; then
        mv "$outfile" "$existing"
        echo "${LOG_PREFIX}   ✓ ${name} refreshed"
        return 0
      else
        echo "${LOG_PREFIX}   ✗ ${name} invalid zip on attempt ${attempt}"
        rm -f "$outfile"
      fi
    else
      echo "${LOG_PREFIX}   ✗ ${name} download failed on attempt ${attempt}"
      rm -f "$outfile"
    fi
    sleep 10
  done

  echo "${LOG_PREFIX}   ✗ ${name} FAILED after 3 attempts — keeping old feed"
  return 1
}

# Download all feeds
download_with_retry "new_york"      "http://web.mta.info/developers/data/nyct/subway/google_transit.zip"
download_with_retry "chicago"       "https://www.transitchicago.com/downloads/sch_data/google_transit.zip"
download_with_retry "washington_dc" "https://gtfs.wmata.com/gtfs/google_transit.zip"
download_with_retry "san_francisco" "https://gtfs.sfmta.com/transitdata/google_transit.zip"
download_with_retry "seattle"       "https://metro.kingcounty.gov/GTFS/google_transit.zip"
download_with_retry "los_angeles"   "https://gtfs.metro.net/agencies/lax/subdir/google_transit.zip"
download_with_retry "portland"      "https://developer.trimet.org/schedule/gtfs.zip"
download_with_retry "denver"        "https://www.rtd-denver.com/files/gtfs/google_transit.zip"
download_with_retry "minneapolis"   "https://svc.metrotransit.org/mtgtfs/gtfs.zip"
download_with_retry "phoenix"       "https://www.valleymetro.org/sites/default/files/uploads/gtfs-files/google_transit.zip"
download_with_retry "san_jose"      "https://www.vta.org/sites/default/files/2021-07/VTA_GTFS_July2021.zip"
download_with_retry "sacramento"    "https://www.sacrt.com/googletransit/googlegtfs.zip"

# Stage updated feeds
echo "${LOG_PREFIX} Staging feeds..."
cp "${DATA_DIR}"/*.zip "$GRAPHS_DIR/"

# Rebuild graph
echo "${LOG_PREFIX} Rebuilding OTP graph (takes 5–15 min)..."
java -Xmx18G -jar "$OTP_JAR" --build --save "$GRAPHS_DIR"
echo "${LOG_PREFIX} Graph rebuilt"

# Restart OTP to load new graph
echo "${LOG_PREFIX} Restarting OTP service..."
sudo systemctl restart otp

# Wait for OTP to come back up
echo "${LOG_PREFIX} Waiting for OTP to be ready..."
for i in $(seq 1 30); do
  if curl -sf "http://localhost:8080/otp/routers/default/index/feeds" > /dev/null 2>&1; then
    echo "${LOG_PREFIX} ✓ OTP is ready"
    break
  fi
  sleep 10
  echo "${LOG_PREFIX}   ... waiting (${i}/30)"
done

echo "${LOG_PREFIX} GTFS refresh complete"
