import { useEffect, useRef, useState, useCallback } from "react";
import { marketData, stocksData } from "../data/staticData.js";
import { sendChatMessage } from "../services/aiServices.js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const NO_ACCESS = "I currently do not have access";

/* ── Shared hooks ─────────────────────────────────────────── */

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function useChartResize(chartRef, wrapperRef, deps = []) {
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    let frame = 0;
    let disposed = false;

    const resize = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed) return;
        const chart = chartRef.current;
        // chart.ctx is nulled by destroy() — catches a torn-down instance
        // that chartRef.current hasn't been cleared for yet
        if (!chart || !chart.ctx || !chart.canvas?.isConnected) return;

        const { width, height } = el.getBoundingClientRect();
        if (width < 1 || height < 1) return; // hidden section (display:none)

        try {
          chart.resize(width, height);
        } catch (error) {
          console.warn("Chart resize skipped:", error);
        }
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize(); // initial size

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, deps);
}

/* ── Index performance chart ──────────────────────────────── */

export function MarketIndexChart() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const chartRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    let chart = null;
    let cancelled = false;

    // Defer past StrictMode's synchronous mount→unmount→mount cycle
    const raf = requestAnimationFrame(() => {
      if (cancelled || !ctx.isConnected) return;
      try {
        chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            datasets: [
              {
                label: "S&P 500",
                data: [5200, 5235, 5248, 5260, 5278],
                borderColor: "#10b981",
                backgroundColor: "transparent",
                borderWidth: isMobile ? 1.8 : 2,
                pointRadius: 0,
                pointHitRadius: 20,
                fill: false,
                // Each index has a wildly different scale — give them their own axes
                yAxisID: "y",
              },
              {
                label: "NASDAQ",
                data: [16200, 16350, 16400, 16420, 16485],
                borderColor: "#3b82f6",
                backgroundColor: "transparent",
                borderWidth: isMobile ? 1.8 : 2,
                pointRadius: 0,
                pointHitRadius: 20,
                fill: false,
                yAxisID: "y1",
              },
              {
                label: "DOW",
                data: [38450, 38600, 38700, 38800, 38892],
                borderColor: "#f59e0b",
                backgroundColor: "transparent",
                borderWidth: isMobile ? 1.8 : 2,
                pointRadius: 0,
                pointHitRadius: 20,
                fill: false,
                yAxisID: "y1",
              },
            ],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            resizeDelay: 100,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: {
                display: true,
                position: "top",
                align: isMobile ? "start" : "center",
                labels: {
                  color: "#94a3b8",
                  boxWidth: 12,
                  padding: isMobile ? 10 : 20,
                  usePointStyle: true,
                  font: {
                    family: "Inter, sans-serif",
                    size: isMobile ? 10 : 12,
                  },
                },
              },
              tooltip: {
                backgroundColor: "#1a2332",
                borderColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                titleColor: "#f8fafc",
                bodyColor: "#94a3b8",
                padding: 10,
                callbacks: {
                  label: (c) =>
                    ` ${c.dataset.label}: ${c.parsed.y.toLocaleString()}`,
                },
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(148, 163, 184, 0.1)", drawTicks: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: isMobile ? 9 : 11 },
                  maxRotation: 0,
                },
              },
              y: {
                position: "left",
                grid: { color: "rgba(148, 163, 184, 0.1)", drawTicks: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: isMobile ? 9 : 11 },
                  maxTicksLimit: isMobile ? 4 : 6,
                  padding: 4,
                  callback: (v) => v.toLocaleString(),
                },
              },
              y1: {
                position: "right",
                display: !isMobile,
                grid: { drawOnChartArea: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: 11 },
                  maxTicksLimit: 6,
                  padding: 4,
                  callback: (v) => (v / 1000).toFixed(0) + "k",
                },
              },
            },
          },
        });
        chartRef.current = chart;
      } catch (err) {
        console.error("Chart init failed:", err);
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      chartRef.current = null;
      if (chart) {
        try {
          chart.destroy();
        } catch {}
        chart = null;
      }
    };
  }, []);

  useChartResize(chartRef, wrapperRef, [isMobile]);

  return (
    <div ref={wrapperRef} className="canvas-wrap">
      <canvas ref={canvasRef} />
    </div>
  );
}

/* ── Sector performance chart ─────────────────────────────── */

export function SectorChart({ marketData: data }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const chartRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx || !data?.sectors) return;

    let chart = null;
    let cancelled = false;

    // Defer past StrictMode's synchronous mount→unmount→mount cycle
    const raf = requestAnimationFrame(() => {
      if (cancelled || !ctx.isConnected) return;
      try {
        chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.sectors.map((s) => s.name),
            datasets: [
              {
                data: data.sectors.map((s) => s.change),
                backgroundColor: data.sectors.map((s) =>
                  s.change >= 0 ? "#10b981" : "#ef4444",
                ),
                borderRadius: 4,
                barPercentage: 0.75,
              },
            ],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            resizeDelay: 100,
            indexAxis: "y",
            layout: { padding: { right: 8 } },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#1a2332",
                borderColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                titleColor: "#f8fafc",
                bodyColor: "#94a3b8",
                padding: 10,
                callbacks: {
                  label: (c) => ` ${c.parsed.x >= 0 ? "+" : ""}${c.parsed.x}%`,
                },
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(148, 163, 184, 0.1)", drawTicks: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: isMobile ? 9 : 11 },
                  maxTicksLimit: isMobile ? 4 : 7,
                  callback: (v) => v + "%",
                },
              },
              y: {
                grid: { display: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: isMobile ? 9 : 11 },
                  // Truncate long sector names on phones
                  callback: function (val) {
                    const label = this.getLabelForValue(val);
                    return isMobile && label.length > 10
                      ? label.slice(0, 9) + "…"
                      : label;
                  },
                },
              },
            },
          },
        });
        chartRef.current = chart;
      } catch (err) {
        console.error("Chart init failed:", err);
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      chartRef.current = null;
      if (chart) {
        try {
          chart.destroy();
        } catch {}
        chart = null;
      }
    };
  }, [data]);

  useChartResize(chartRef, wrapperRef, [isMobile]);

  return (
    <div ref={wrapperRef} className="canvas-wrap">
      <canvas ref={canvasRef} />
    </div>
  );
}

/* ── Mover row (gainers / losers) ─────────────────────────── */

function MoverRow({ stock, tone, onOpenModal }) {
  const color = tone === "up" ? "var(--accent-emerald)" : "var(--accent-rose)";
  return (
    <div
      className="mover-row"
      role="button"
      tabIndex={0}
      onClick={() => onOpenModal(stock.symbol)}
      onKeyDown={(e) => e.key === "Enter" && onOpenModal(stock.symbol)}
    >
      <div className="stock-logo mover-logo">{stock.symbol.slice(0, 2)}</div>
      <div className="mover-body">
        <div className="mover-symbol">{stock.symbol}</div>
        <div className="mover-reason">{stock.reason}</div>
      </div>
      <div className="mover-numbers">
        <div className="mover-change" style={{ color }}>
          {tone === "up" ? "+" : ""}
          {stock.change.toFixed(2)}%
        </div>
        <div className="mover-price">${stock.price.toFixed(2)}</div>
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────── */

export default function SectionMarket({ onOpenModal, onAskAI, activeList }) {
  const [marketSummary, setMarketSummary] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const CACHE_KEY = "world_market_summary";

  const fetchMarketSummary = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setMarketSummary(cachedData);
        return;
      }
    }

    try {
      setIsLoadingSummary(true);
      const response = await sendChatMessage(
        "Give the latest market headlines",
      );
      setMarketSummary(response);
      sessionStorage.setItem(CACHE_KEY, response);
    } catch (error) {
      console.error("Error fetching market summary:", error);
      setMarketSummary((prev) =>
        prev ? prev : "Unable to load the market summary at this time.",
      );
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketSummary(false);
  }, [fetchMarketSummary]);

  const indices = [
    {
      label: "S&P 500",
      icon: "fa-chart-line",
      iconColor: "var(--accent-emerald)",
      value: "5,278",
      change: { dir: "up", text: "+1.8% this week" },
    },
    {
      label: "NASDAQ",
      icon: "fa-chart-line",
      iconColor: "var(--accent-blue)",
      value: "16,485",
      change: { dir: "up", text: "+2.4% this week" },
    },
    {
      label: "DOW",
      icon: "fa-industry",
      iconColor: "var(--accent-amber)",
      value: "38,892",
      change: { dir: "up", text: "+1.2% this week" },
    },
    {
      label: "VIX",
      icon: "fa-chart-area",
      iconColor: "var(--accent-purple)",
      value: "14.2",
      valueColor: "var(--accent-emerald)",
      change: {
        dir: "flat",
        text: "Low volatility",
        color: "var(--accent-emerald)",
      },
    },
    {
      label: "10Y Yield",
      icon: "fa-percentage",
      iconColor: "var(--accent-cyan)",
      value: "4.48%",
      change: { dir: "down", text: "-0.12% this week" },
    },
  ];

  return (
    <section id="market" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>
            <i
              className="fas fa-globe section-title-icon"
              style={{ color: "var(--accent-blue)" }}
            ></i>
            Market Intelligence
          </h2>
          <p>{`"What changed this week?" — AI-powered market analysis`}</p>
        </div>
        <div className="header-right header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => fetchMarketSummary(true)}
            disabled={isLoadingSummary}
          >
            <i
              className={`fas fa-sync-alt${isLoadingSummary ? " fa-spin" : ""}`}
            ></i>{" "}
            <span>{isLoadingSummary ? "Refreshing..." : "Refresh Data"}</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              onAskAI(
                "What major events happened last week in World stock market?",
              )
            }
          >
            <i className="fas fa-robot"></i> <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* AI summary + sentiment badge */}
      <div className="chart-card insight-card insight-blue">
        <div className="market-summary-layout">
          <div className="market-summary-text">
            <h3 className="insight-title">
              <i
                className="fas fa-brain"
                style={{ color: "var(--accent-cyan)" }}
              ></i>
              AI Market Summary
            </h3>
            <p className="insight-body">
              {isLoadingSummary ? (
                <span className="insight-loading">
                  Generating live market insights...
                </span>
              ) : marketSummary.includes(NO_ACCESS) ? (
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
                  {`lagged. The Fed's dovish tone boosted sentiment, with rate-cut expectations pushing 10-year yields below 4.5%.`}
                </span>
              ) : (
                marketSummary
              )}
            </p>
          </div>

          <div className="sentiment-badge">
            <div className="sentiment-badge-label">Market Sentiment</div>
            <div className="sentiment-badge-value">Bullish</div>
          </div>
        </div>
      </div>

      {/* Index stats — 5 across on desktop, wraps down responsively */}
      <div className="stats-grid stats-grid-five">
        {indices.map((idx) => (
          <div className="stat-card" key={idx.label}>
            <div className="stat-card-header">
              <h4>{idx.label}</h4>
              <i
                className={`fas ${idx.icon}`}
                style={{ color: idx.iconColor }}
              ></i>
            </div>
            <div
              className="stat-value stat-value-sm"
              style={idx.valueColor ? { color: idx.valueColor } : undefined}
            >
              {idx.value}
            </div>
            <div
              className={`stat-change${
                idx.change.dir === "up"
                  ? " positive"
                  : idx.change.dir === "down"
                    ? " negative"
                    : ""
              }`}
            >
              {idx.change.dir === "up" && <i className="fas fa-arrow-up"></i>}
              {idx.change.dir === "down" && (
                <i className="fas fa-arrow-down"></i>
              )}
              <span
                style={
                  idx.change.color ? { color: idx.change.color } : undefined
                }
              >
                {idx.change.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-row charts-row-market">
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
          <div className="chart-container sector-chart-container">
            <SectorChart marketData={marketData} />
          </div>
        </div>
      </div>

      {/* Gainers / losers */}
      <div className="two-column section-gap">
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i
                className="fas fa-arrow-up section-title-icon"
                style={{ color: "var(--accent-emerald)" }}
              ></i>
              Top Gainers
            </h3>
          </div>
          <div className="mover-list">
            {marketData.topGainers.slice(0, 5).map((s) => (
              <MoverRow
                key={s.symbol}
                stock={s}
                tone="up"
                onOpenModal={onOpenModal}
              />
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i
                className="fas fa-arrow-down section-title-icon"
                style={{ color: "var(--accent-rose)" }}
              ></i>
              Top Losers
            </h3>
          </div>
          <div className="mover-list">
            {marketData.topLosers.slice(0, 5).map((s) => (
              <MoverRow
                key={s.symbol}
                stock={s}
                tone="down"
                onOpenModal={onOpenModal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="chart-card section-gap">
        <div className="chart-header">
          <h3>
            <i
              className="fas fa-calendar-alt section-title-icon"
              style={{ color: "var(--accent-amber)" }}
            ></i>
            Key Market Events This Week
          </h3>
        </div>
        <div className="events-grid">
          {marketData.events.map((ev) => (
            <div
              key={ev.date}
              className={`event-card event-${
                ev.sentiment === "positive" ? "positive" : "neutral"
              }`}
            >
              <div className="event-date">{ev.date}</div>
              <div className="event-title">{ev.title}</div>
              <div className="event-impact">{ev.impact}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
