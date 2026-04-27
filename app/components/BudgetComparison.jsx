import { useState, useEffect } from "react";

const MONO = "JetBrains Mono, monospace";
const DISPLAY = "Arial Black, Impact, ui-sans-serif";
const RED = "#ea2804";
const DIM = "#646464";
const BORDER = "#222";

// ── NTD FY2024 — verified from federal NTD database ──────────────────────────
const CITIES = [
  {
    id: "sacramento",
    name: "Sacramento",
    agency: "SacRT",
    op_budget_m: 254.0,
    riders_m: 16.36,
    cost_per_rider: 15.53,
    farebox_pct: 7.2,
    subsidy_per_rider: 14.40,
    taxpayer_subsidy_m: 235.7,
    note: "State capital. 2nd worst cost/rider in CA.",
    highlight: true,
  },
  {
    id: "san_francisco",
    name: "San Francisco",
    agency: "SFMTA / Muni",
    op_budget_m: 1128.1,
    riders_m: 160.54,
    cost_per_rider: 7.03,
    farebox_pct: 8.6,
    subsidy_per_rider: 6.42,
    taxpayer_subsidy_m: 1030.9,
    note: "High absolute cost, but 10× Sacramento's ridership.",
  },
  {
    id: "los_angeles",
    name: "Los Angeles",
    agency: "LA Metro",
    op_budget_m: 2418.4,
    riders_m: 302.61,
    cost_per_rider: 7.99,
    farebox_pct: 6.1,
    subsidy_per_rider: 7.51,
    taxpayer_subsidy_m: 2271.1,
    note: "Scale works: 302M riders drives cost down.",
  },
  {
    id: "san_jose",
    name: "San Jose",
    agency: "VTA",
    op_budget_m: 485.9,
    riders_m: 27.71,
    cost_per_rider: 17.53,
    farebox_pct: 6.2,
    subsidy_per_rider: 16.46,
    taxpayer_subsidy_m: 456.0,
    note: "Worst cost/rider in CA. Sacramento's cautionary tale.",
  },
  {
    id: "san_diego",
    name: "San Diego",
    agency: "MTS",
    op_budget_m: 382.5,
    riders_m: 75.68,
    cost_per_rider: 5.05,
    farebox_pct: 18.9,
    subsidy_per_rider: 4.10,
    taxpayer_subsidy_m: 310.1,
    note: "Best in CA. 3× more efficient than Sacramento.",
  },
];

const METRICS = [
  {
    key: "cost_per_rider",
    label: "Cost Per Rider",
    format: v => `$${v.toFixed(2)}`,
    direction: "lower_better",
    unit: "operating expenses ÷ boardings",
    max: 20,
  },
  {
    key: "farebox_pct",
    label: "Farebox Recovery",
    format: v => `${v}%`,
    direction: "higher_better",
    unit: "fare revenue ÷ operating cost",
    max: 22,
  },
  {
    key: "subsidy_per_rider",
    label: "Taxpayer Subsidy / Rider",
    format: v => `$${v.toFixed(2)}`,
    direction: "lower_better",
    unit: "public cost per boarding",
    max: 20,
  },
  {
    key: "riders_m",
    label: "Annual Riders",
    format: v => `${v}M`,
    direction: "higher_better",
    unit: "million boardings / year",
    max: 310,
  },
];

function Bar({ pct, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden", marginTop: 6 }}>
      <div style={{
        height: "100%",
        width: `${width}%`,
        background: color,
        borderRadius: 3,
        transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
      }} />
    </div>
  );
}

function Rank({ n, highlight }) {
  return (
    <div style={{
      fontFamily: MONO,
      fontSize: 10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: highlight ? RED : "#1e1e1e",
      color: highlight ? "#fff" : DIM,
      fontWeight: 700,
      flexShrink: 0,
    }}>
      {n}
    </div>
  );
}

function MetricPanel({ metric, mobile }) {
  const sorted = [...CITIES].sort((a, b) =>
    metric.direction === "lower_better"
      ? a[metric.key] - b[metric.key]
      : b[metric.key] - a[metric.key]
  );

  const sacRank = sorted.findIndex(c => c.id === "sacramento") + 1;
  const rankColor = (() => {
    if (metric.direction === "lower_better") return sacRank <= 2 ? "#2b9a66" : RED;
    return sacRank <= 2 ? "#2b9a66" : RED;
  })();
  const rankSuffix = sacRank === 1 ? " — best" : sacRank === CITIES.length ? " — worst" : "";

  return (
    <div style={{ background: "#141414", border: `1px solid ${BORDER}`, padding: mobile ? "18px 16px" : "22px 24px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
          {metric.label}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: "#333", marginTop: 2 }}>{metric.unit}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sorted.map((city, i) => {
          const pct = Math.min((city[metric.key] / metric.max) * 100, 100);
          const isSac = city.id === "sacramento";
          const isFirst = i === 0;
          const isGood = (metric.direction === "lower_better" && isFirst) ||
                         (metric.direction === "higher_better" && isFirst);
          const valueColor = isSac ? RED : isGood ? "#2b9a66" : "#888";

          return (
            <div key={city.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Rank n={i + 1} highlight={isSac} />
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: isSac ? "#fcfcfc" : "#888", fontWeight: isSac ? 700 : 400 }}>
                      {city.name}
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 9, color: "#333" }}>{city.agency}</div>
                  </div>
                </div>
                <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 900, color: valueColor }}>
                  {metric.format(city[metric.key])}
                </div>
              </div>
              <Bar pct={pct} color={isSac ? RED : "#2a2a2a"} delay={i * 80} />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}`, fontFamily: MONO, fontSize: 10, color: rankColor }}>
        Sacramento ranks #{sacRank} of 5{rankSuffix}
      </div>
    </div>
  );
}

function ScorecardRow({ city, mobile }) {
  const isSac = city.id === "sacramento";
  const budgetStr = city.op_budget_m >= 1000
    ? `$${(city.op_budget_m / 1000).toFixed(1)}B`
    : `$${city.op_budget_m}M`;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: mobile ? "1fr 1fr" : "160px 1fr 1fr 1fr 1fr 1fr",
      gap: mobile ? 8 : 0,
      borderBottom: `1px solid ${BORDER}`,
      background: isSac ? "rgba(234,40,4,0.06)" : "transparent",
      padding: mobile ? "12px 16px" : "0",
    }}>
      <div style={{
        padding: mobile ? 0 : "14px 16px",
        gridColumn: mobile ? "1 / -1" : "auto",
        borderRight: mobile ? "none" : `1px solid ${BORDER}`,
      }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: isSac ? RED : "#fcfcfc", fontWeight: isSac ? 700 : 400 }}>
          {city.name}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: "#444" }}>{city.agency}</div>
      </div>

      {[
        { val: budgetStr,                                label: "Budget" },
        { val: `${city.riders_m}M`,                     label: "Riders/yr" },
        { val: `$${city.cost_per_rider.toFixed(2)}`,    label: "Cost/Rider ↓" },
        { val: `${city.farebox_pct}%`,                  label: "Farebox ↑" },
        { val: `$${city.subsidy_per_rider.toFixed(2)}`, label: "Subsidy/Rider ↓" },
      ].map(({ val, label }, idx) => (
        <div key={label} style={{
          padding: mobile ? "4px 0" : "14px 16px",
          borderRight: (!mobile && idx < 4) ? `1px solid ${BORDER}` : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          {mobile && <div style={{ fontFamily: MONO, fontSize: 9, color: "#444", marginBottom: 2 }}>{label}</div>}
          <div style={{ fontFamily: DISPLAY, fontSize: mobile ? 13 : 15, fontWeight: 900, color: isSac ? RED : "#888" }}>
            {val}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BudgetComparison() {
  const [mobile, setMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("charts");

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sac   = CITIES.find(c => c.id === "sacramento");
  const sd    = CITIES.find(c => c.id === "san_diego");
  const ratio = (sac.cost_per_rider / sd.cost_per_rider).toFixed(1);

  return (
    <div style={{ background: "#0e0e0e", color: "#fcfcfc", minHeight: "100vh", fontFamily: MONO }}>

      {/* Hero */}
      <div style={{ padding: mobile ? "28px 16px 0" : "40px 32px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: DIM, textTransform: "uppercase", marginBottom: 10 }}>
          fixsactransit · Budget Analysis · NTD FY2024
        </div>
        <h1 style={{
          fontFamily: DISPLAY,
          fontSize: mobile ? 28 : 44,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}>
          Sacramento vs.<br />
          <span style={{ color: RED }}>California's Major Transit Agencies</span>
        </h1>
        <p style={{ fontSize: 12, color: DIM, maxWidth: 560, lineHeight: 1.7 }}>
          5 agencies. Same state. Wildly different results.
          Source: Federal National Transit Database, Report Year 2024.
        </p>

        {/* Stat strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 1,
          background: BORDER,
          margin: "24px 0 0",
          border: `1px solid ${BORDER}`,
        }}>
          {[
            { label: "Sac cost / rider",      val: `$${sac.cost_per_rider.toFixed(2)}`, sub: `vs $${sd.cost_per_rider.toFixed(2)} in San Diego` },
            { label: "Sac farebox recovery",  val: `${sac.farebox_pct}%`,               sub: "of operating costs covered by fares" },
            { label: "SD cost advantage",     val: `${ratio}×`,                          sub: "cheaper per rider than Sacramento" },
            { label: "Sac subsidy / rider",   val: `$${sac.subsidy_per_rider.toFixed(2)}`, sub: "taxpayer cost per boarding" },
          ].map(s => (
            <div key={s.label} style={{ background: "#141414", padding: mobile ? "14px 12px" : "18px 20px" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#444", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: DISPLAY, fontSize: mobile ? 22 : 28, fontWeight: 900, color: RED, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#444", marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        padding: mobile ? "20px 16px 0" : "24px 32px 0",
        display: "flex",
        gap: 1,
        borderBottom: `1px solid ${BORDER}`,
        marginTop: 24,
      }}>
        {[["charts", "Metric Charts"], ["table", "Full Table"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "8px 16px",
            background: activeTab === id ? RED : "transparent",
            color: activeTab === id ? "#fff" : DIM,
            border: "none",
            cursor: "pointer",
          }}>{lbl}</button>
        ))}
      </div>

      {/* Charts */}
      {activeTab === "charts" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: 1,
          background: BORDER,
          padding: 1,
        }}>
          {METRICS.map(m => <MetricPanel key={m.key} metric={m} mobile={mobile} />)}
        </div>
      )}

      {/* Table */}
      {activeTab === "table" && (
        <div>
          {!mobile && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr 1fr 1fr 1fr 1fr",
              background: "#141414",
              borderBottom: `1px solid ${BORDER}`,
            }}>
              {["Agency", "Budget", "Riders/yr", "Cost/Rider ↓", "Farebox ↑", "Subsidy/Rider ↓"].map((h, i) => (
                <div key={h} style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: DIM,
                  padding: "10px 16px",
                  borderRight: i < 5 ? `1px solid ${BORDER}` : "none",
                }}>{h}</div>
              ))}
            </div>
          )}
          {[...CITIES]
            .sort((a, b) => b.cost_per_rider - a.cost_per_rider)
            .map(city => <ScorecardRow key={city.id} city={city} mobile={mobile} />)
          }
        </div>
      )}

      {/* Narrative */}
      <div style={{
        padding: mobile ? "24px 16px" : "28px 32px",
        borderTop: `1px solid ${BORDER}`,
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr",
        gap: mobile ? 20 : 32,
        background: "#141414",
      }}>
        {[
          {
            headline: "San Diego is the benchmark",
            body: `MTS at $5.05/rider is the most cost-efficient large agency in California. Sacramento spends ${ratio}× more per boarding — for a dramatically worse service product. Same state, same funding mechanisms.`,
            color: "#2b9a66",
          },
          {
            headline: "Sacramento's scale trap",
            body: `At 16M riders, SacRT is too small for economies of scale but too large to be nimble. LA Metro moves 302M riders at $7.99/rider. San Diego moves 75M at $5.05. Sacramento's fixed costs spread across too few trips.`,
            color: RED,
          },
          {
            headline: "VTA is the warning sign",
            body: `San Jose's VTA at $17.53/rider and 6.2% farebox recovery is Sacramento's cautionary tale — a system that never achieved ridership density. SacRT at $15.53 and 7.2% farebox is structurally one bad budget cycle behind VTA.`,
            color: "#ff8c42",
          },
        ].map(({ headline, body, color }) => (
          <div key={headline}>
            <div style={{ width: 20, height: 2, background: color, marginBottom: 10 }} />
            <div style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 900, marginBottom: 8, lineHeight: 1.3 }}>
              {headline}
            </div>
            <div style={{ fontSize: 11, color: DIM, lineHeight: 1.7 }}>{body}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: mobile ? "12px 16px" : "12px 32px",
        borderTop: `1px solid ${BORDER}`,
        fontFamily: MONO,
        fontSize: 10,
        color: "#333",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 4,
      }}>
        <span>Source: Federal Transit Administration — National Transit Database, Report Year 2024</span>
        <span>fixsactransit.org</span>
      </div>
    </div>
  );
}
