import { useEffect, useRef, useState } from "react";
import { marketData, stocksData } from "../data/staticData.js";
import { sendChatMessage } from "../services/aiServices.js";
import { Chart, registerables } from "chart.js";

// Register necessary Chart.js elements, scales, and plugins
Chart.register(...registerables);

export function MarketIndexChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    let myMarketIndexChart = null;

    if (ctx) {
      myMarketIndexChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          datasets: [
            {
              label: "S&P 500",
              data: [5200, 5235, 5248, 5260, 5278],
              borderColor: "#10b981",
              backgroundColor: "transparent",
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            },
            {
              label: "NASDAQ",
              data: [16200, 16350, 16400, 16420, 16485],
              borderColor: "#3b82f6",
              backgroundColor: "transparent",
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            },
            {
              label: "DOW",
              data: [38450, 38600, 38700, 38800, 38892],
              borderColor: "#f59e0b",
              backgroundColor: "transparent",
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#94a3b8",
                boxWidth: 12,
                padding: 20,
                font: { family: "Inter, sans-serif" },
              },
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(148, 163, 184, 0.1)" },
              ticks: { color: "#94a3b8" },
            },
            y: {
              grid: { color: "rgba(148, 163, 184, 0.1)" },
              ticks: { color: "#94a3b8" },
            },
          },
        },
      });
    }

    // Explicit cleanup to destroy chart instance on component unmount
    return () => {
      if (myMarketIndexChart) {
        myMarketIndexChart.destroy();
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export function SectorChart({ marketData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    let mySectorChart = null;

    if (ctx && marketData?.sectors) {
      mySectorChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: marketData.sectors.map((s) => s.name),
          datasets: [
            {
              data: marketData.sectors.map((s) => s.change),
              backgroundColor: marketData.sectors.map((s) =>
                s.change >= 0 ? "#10b981" : "#ef4444",
              ),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: "rgba(148, 163, 184, 0.1)" },
              ticks: { color: "#94a3b8", callback: (v) => v + "%" },
            },
            y: {
              grid: { display: false },
              ticks: { color: "#94a3b8" },
            },
          },
        },
      });
    }

    // Clean up chart instance automatically on component unmount or data refresh
    return () => {
      if (mySectorChart) {
        mySectorChart.destroy();
      }
    };
  }, [marketData]); // Re-renders cleanly if marketData shifts underneath

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default function SectionMarket({ onOpenModal, onAskAI, activeList }) {
  const list = activeList && activeList.length > 0 ? activeList : stocksData;

  const [marketSummary, setMarketSummary] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const CACHE_KEY = "world_market_summary";

  const fetchMarketSummary = async (forceRefresh = false) => {
    // 1. If not a forced refresh, look for data inside the cache first
    if (!forceRefresh) {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setMarketSummary(cachedData);
        return; // Exit early, no API call needed!
      }
    }

    // 2. Fetch fresh data if cache missed or if user clicked Refresh
    try {
      setIsLoadingSummary(true);

      const response = await sendChatMessage(
        "What major events happened last week in World stock market?",
      );

      // Update local state and save to cache
      setMarketSummary(response);
      sessionStorage.setItem(CACHE_KEY, response);
    } catch (error) {
      console.error("Error fetching market summary:", error);
      // Fallback message if there's no pre-existing text to show
      if (!marketSummary) {
        setMarketSummary("Unable to load the market summary at this time.");
      }
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Run automatically on page load / component mount
  useEffect(() => {
    fetchMarketSummary(false);
  }, []);

  return (
    <section id="market" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>
            <i
              className="fas fa-globe"
              style={{ color: "var(--accent-blue)", marginRight: 12 }}
            ></i>
            Market Intelligence
          </h2>
          <p>{`"What changed this week?" — AI-powered market analysis`}</p>
        </div>
        <div className="header-right">
          <button
            className="btn btn-secondary"
            onClick={() => fetchMarketSummary(true)} // Passes true to bypass cache
            disabled={isLoadingSummary}
          >
            <i className="fas fa-sync-alt"></i>{" "}
            {isLoadingSummary ? "Refreshing..." : "Refresh Data"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              onAskAI(
                "What major events happened last week in World stock market?",
              )
            }
          >
            <i className="fas fa-robot"></i> Ask AI
          </button>
        </div>
      </div>

      <div
        className="chart-card"
        style={{ marginBottom: 24, borderLeft: "4px solid var(--accent-blue)" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h3 style={{ marginBottom: 12 }}>
              <i
                className="fas fa-brain"
                style={{ color: "var(--accent-cyan)", marginRight: 8 }}
              ></i>
              AI Market Summary
            </h3>
            <p
              style={{
                fontSize: "0.9em",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
              }}
            >
              {isLoadingSummary ? (
                <span style={{ opacity: 0.6, fontStyle: "italic" }}>
                  Generating live market insights...
                </span>
              ) : marketSummary.includes("I currently do not have access") ? (
                <span>
                  This week saw a{" "}
                  <strong style={{ color: "var(--accent-emerald)" }}>
                    broad market rally
                  </strong>{" "}
                  driven by stronger-than-expected earnings from mega-cap tech.
                  The S&amp;P 500 gained <strong>1.8%</strong> while the Nasdaq
                  surged <strong>2.4%</strong>.{" "}
                  <strong style={{ color: "var(--accent-rose)" }}>
                    Energy (-1.2%)
                  </strong>{" "}
                  and{" "}
                  <strong style={{ color: "var(--accent-rose)" }}>
                    Utilities (-0.8%)
                  </strong>{" "}
                  {`lagged. The Fed's dovish tone boosted sentiment, with rate-cut
              expectations pushing 10-year yields below 4.5%.`}
                </span>
              ) : (
                marketSummary
              )}
            </p>
          </div>
          <div style={{ textAlign: "right", marginLeft: 24 }}>
            <div
              style={{
                background: "var(--bg-tertiary)",
                padding: "12px 16px",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: "0.65em",
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                Market Sentiment
              </div>
              <div
                style={{
                  fontSize: "1.4em",
                  fontWeight: 700,
                  color: "var(--accent-emerald)",
                }}
              >
                Bullish
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 24 }}
      >
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>S&amp;P 500</h4>
            <i
              className="fas fa-chart-line"
              style={{ color: "var(--accent-emerald)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ fontSize: "1.4em" }}>
            5,278
          </div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>+1.8% this week
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>NASDAQ</h4>
            <i
              className="fas fa-chart-line"
              style={{ color: "var(--accent-blue)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ fontSize: "1.4em" }}>
            16,485
          </div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>+2.4% this week
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>DOW</h4>
            <i
              className="fas fa-industry"
              style={{ color: "var(--accent-amber)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ fontSize: "1.4em" }}>
            38,892
          </div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>+1.2% this week
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>VIX</h4>
            <i
              className="fas fa-chart-area"
              style={{ color: "var(--accent-purple)" }}
            ></i>
          </div>
          <div
            className="stat-value"
            style={{ fontSize: "1.4em", color: "var(--accent-emerald)" }}
          >
            14.2
          </div>
          <div className="stat-change">
            <span style={{ color: "var(--accent-emerald)" }}>
              Low volatility
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>10Y Yield</h4>
            <i
              className="fas fa-percentage"
              style={{ color: "var(--accent-cyan)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ fontSize: "1.4em" }}>
            4.48%
          </div>
          <div className="stat-change negative">
            <i className="fas fa-arrow-down"></i>-0.12% this week
          </div>
        </div>
      </div>

      <div className="charts-row" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="chart-card">
          <div className="chart-header">
            <h3>Index Performance</h3>
            <div className="chart-tabs">
              {["1W", "1M", "3M"].map((t) => (
                <button
                  key={t}
                  className={`chart-tab${t === "1W" ? " active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <MarketIndexChart />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h3>Sector Performance</h3>
          </div>
          <div className="chart-container">
            <SectorChart marketData={marketData} />
          </div>
        </div>
      </div>

      <div className="two-column" style={{ marginTop: 24 }}>
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i
                className="fas fa-arrow-up"
                style={{ color: "var(--accent-emerald)", marginRight: 8 }}
              ></i>
              Top Gainers
            </h3>
          </div>
          {marketData.topGainers.slice(0, 5).map((s) => (
            <div
              key={s.symbol}
              style={{
                display: "flex",
                alignItems: "center",
                padding: 12,
                borderBottom: "1px solid var(--border-color)",
                cursor: "pointer",
              }}
              onClick={() => onOpenModal(s.symbol)}
            >
              <div
                className="stock-logo"
                style={{ width: 36, height: 36, marginRight: 12 }}
              >
                {s.symbol.slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: "0.85em" }}>
                  {s.symbol}
                </div>
                <div style={{ fontSize: "0.7em", color: "var(--text-muted)" }}>
                  {s.reason}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    color: "var(--accent-emerald)",
                    fontWeight: 600,
                    fontSize: "0.9em",
                  }}
                >
                  +{s.change.toFixed(2)}%
                </div>
                <div style={{ fontSize: "0.7em", color: "var(--text-muted)" }}>
                  ${s.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i
                className="fas fa-arrow-down"
                style={{ color: "var(--accent-rose)", marginRight: 8 }}
              ></i>
              Top Losers
            </h3>
          </div>
          {marketData.topLosers.slice(0, 5).map((s) => (
            <div
              key={s.symbol}
              style={{
                display: "flex",
                alignItems: "center",
                padding: 12,
                borderBottom: "1px solid var(--border-color)",
                cursor: "pointer",
              }}
              onClick={() => onOpenModal(s.symbol)}
            >
              <div
                className="stock-logo"
                style={{ width: 36, height: 36, marginRight: 12 }}
              >
                {s.symbol.slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: "0.85em" }}>
                  {s.symbol}
                </div>
                <div style={{ fontSize: "0.7em", color: "var(--text-muted)" }}>
                  {s.reason}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    color: "var(--accent-rose)",
                    fontWeight: 600,
                    fontSize: "0.9em",
                  }}
                >
                  {s.change.toFixed(2)}%
                </div>
                <div style={{ fontSize: "0.7em", color: "var(--text-muted)" }}>
                  ${s.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: 24 }}>
        <div className="chart-header">
          <h3>
            <i
              className="fas fa-calendar-alt"
              style={{ color: "var(--accent-amber)", marginRight: 8 }}
            ></i>
            Key Market Events This Week
          </h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
          }}
        >
          {marketData.events.map((ev) => (
            <div
              key={ev.date}
              style={{
                background: "var(--bg-tertiary)",
                padding: 16,
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  background:
                    ev.sentiment === "positive"
                      ? "rgba(16,185,129,0.2)"
                      : "rgba(245,158,11,0.2)",
                  color:
                    ev.sentiment === "positive"
                      ? "var(--accent-emerald)"
                      : "var(--accent-amber)",
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: "0.65em",
                  marginBottom: 8,
                  display: "inline-block",
                }}
              >
                {ev.date}
              </div>
              <div
                style={{ fontWeight: 600, fontSize: "0.8em", marginBottom: 4 }}
              >
                {ev.title}
              </div>
              <div style={{ fontSize: "0.7em", color: "var(--text-muted)" }}>
                {ev.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
