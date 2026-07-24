import { useEffect, useRef, useState, useCallback } from "react";
import {
  transactions,
  opportunities,
  stocksData,
  riskData,
  riskPositions,
} from "../data/staticData.js";
import {
  getPemClass,
  getChangeClass,
  getChangeSign,
} from "../utils/helpers.js";
import { sendChatMessage } from "../services/aiServices.js";
import ResponsiveStockTable from "./ResponsiveStockTable.jsx";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

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

/* Cached AI text fetch — shared by all three intel sections */
function useCachedInsight(cacheKey, prompt) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInsight = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh) {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setText(cached);
          return;
        }
      }
      try {
        setLoading(true);
        const response = await sendChatMessage(prompt);
        setText(response);
        sessionStorage.setItem(cacheKey, response);
      } catch (error) {
        console.error(`Error fetching ${cacheKey}:`, error);
        setText((prev) =>
          prev ? prev : "Unable to load this analysis at the moment.",
        );
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, prompt],
  );

  useEffect(() => {
    fetchInsight(false);
  }, [fetchInsight]);

  return { text, loading, refresh: () => fetchInsight(true) };
}

const NO_ACCESS = "I currently do not have access";

/* ── Portfolio Intelligence ───────────────────────────────── */

export function BenchmarkChart() {
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
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Portfolio",
                data: [100, 104, 108, 112, 115, 120],
                borderColor: "#06b6d4",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                fill: true,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHitRadius: 20,
              },
              {
                label: "S&P 500",
                data: [100, 102, 105, 107, 109, 112],
                borderColor: "#64748b",
                backgroundColor: "transparent",
                fill: false,
                borderWidth: 1.5,
                borderDash: [5, 5],
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHitRadius: 20,
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
                bodyColor: "#f8fafc",
                padding: 10,
                callbacks: {
                  label: (c) => ` ${c.dataset.label}: ${c.raw}%`,
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
                  maxTicksLimit: isMobile ? 4 : 6,
                },
              },
              y: {
                grid: { color: "rgba(148, 163, 184, 0.1)", drawTicks: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: isMobile ? 9 : 11 },
                  maxTicksLimit: isMobile ? 4 : 6,
                  padding: 6,
                  callback: (v) => v + "%",
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

export function SectionPortfolioIntel({ onAskAI }) {
  const { text: portfolioIntel, loading: isLoadingIntel } = useCachedInsight(
    "initial_summary",
    "Analyze my portfolio performance",
  );

  return (
    <section id="portfolio-intel" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>
            <i
              className="fas fa-brain section-title-icon"
              style={{ color: "var(--accent-purple)" }}
            ></i>
            Portfolio Intelligence
          </h2>
          <p>{`"What is driving performance?" — AI-powered portfolio analysis`}</p>
        </div>
        <div className="header-right header-actions">
          <button className="btn btn-secondary">
            <i className="fas fa-download"></i> <span>Export</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onAskAI("Analyze my portfolio performance")}
          >
            <i className="fas fa-robot"></i> <span>Ask AI</span>
          </button>
        </div>
      </div>

      <div className="chart-card insight-card insight-purple">
        <h3 className="insight-title">
          <i
            className="fas fa-brain"
            style={{ color: "var(--accent-cyan)" }}
          ></i>
          AI Portfolio Summary
        </h3>
        <p className="insight-body">
          {isLoadingIntel ? (
            <span className="insight-loading">
              Generating live market insights...
            </span>
          ) : portfolioIntel.includes(NO_ACCESS) ? (
            <span>
              Your portfolio is{" "}
              <strong style={{ color: "var(--accent-emerald)" }}>
                overweight Technology (42%)
              </strong>{" "}
              vs benchmark (28%). Top contributor{" "}
              <strong>NVDA (+180bps)</strong> and{" "}
              <strong>META (+120bps)</strong>{" "}
              {`drove this week's outperformance.`}
              <strong> TSLA (-50bps)</strong> was the main drag. Consider adding{" "}
              <strong>AAPL</strong> for sector balance and dividend income.
            </span>
          ) : (
            portfolioIntel
          )}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Portfolio Value</h4>
            <i className="fas fa-wallet"></i>
          </div>
          <div className="stat-value">$2.47M</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>+$127,450 (+5.44%)</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>vs Benchmark</h4>
            <i className="fas fa-chart-line"></i>
          </div>
          <div
            className="stat-value"
            style={{ color: "var(--accent-emerald)" }}
          >
            +0.5%
          </div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>Outperforming S&amp;P 500</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>YTD Return</h4>
            <i className="fas fa-rocket"></i>
          </div>
          <div
            className="stat-value"
            style={{ color: "var(--accent-emerald)" }}
          >
            +16.4%
          </div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>+$347,200 unrealized</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Risk Score</h4>
            <i
              className="fas fa-shield-alt"
              style={{ color: "var(--accent-amber)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ color: "var(--accent-amber)" }}>
            68
          </div>
          <div className="stat-change">
            <span style={{ color: "var(--accent-amber)" }}>Moderate risk</span>
          </div>
        </div>
      </div>

      <div className="stats-grid stats-grid-secondary">
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Cash Position</h4>
            <i
              className="fas fa-money-bill"
              style={{ color: "var(--accent-emerald)" }}
            ></i>
          </div>
          <div className="stat-value">$142,300</div>
          <div className="stat-change">
            <span style={{ color: "var(--text-muted)" }}>
              5.8% of portfolio
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Dividend Income</h4>
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-value">$8,450</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>+12% YTD</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Performance vs Benchmark</h3>
            <div className="chart-tabs">
              {["1M", "3M", "6M", "YTD"].map((t) => (
                <button
                  key={t}
                  className={`chart-tab${t === "1M" ? " active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <BenchmarkChart />
          </div>
        </div>

        <div className="holdings-card">
          <div className="table-header">
            <h3>Recent Transactions</h3>
          </div>
          <div className="tx-list">
            {transactions.map((tx, i) => {
              const icon =
                tx.type === "buy"
                  ? "arrow-down"
                  : tx.type === "sell"
                    ? "arrow-up"
                    : "coins";
              const color =
                tx.type === "buy"
                  ? "var(--accent-rose)"
                  : tx.type === "sell"
                    ? "var(--accent-emerald)"
                    : "var(--accent-amber)";
              const label =
                tx.type === "buy"
                  ? "Bought"
                  : tx.type === "sell"
                    ? "Sold"
                    : "Dividend";
              const detail =
                tx.type === "dividend"
                  ? `$${tx.amount.toFixed(2)}`
                  : `${tx.shares} @ $${tx.price.toFixed(2)}`;
              return (
                <div key={i} className="tx-row">
                  <div className="tx-icon" style={{ background: `${color}20` }}>
                    <i className={`fas fa-${icon}`} style={{ color }}></i>
                  </div>
                  <div className="tx-body">
                    <h4>
                      {label} {tx.symbol}
                    </h4>
                    <span>{detail}</span>
                  </div>
                  <span className="tx-date">{tx.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Opportunity Engine ───────────────────────────────────── */

const OPPORTUNITY_PROMPT =
  "Which Sectors are stocks are best right now , Which sectors or stocks should i look for investements ? Give reasons why should we choose that stock";

export function SectionOpportunities({ onOpenModal, onAskAI }) {
  const { text: opportunity, loading: isLoadingOpportunities } =
    useCachedInsight("opportunity_summary", OPPORTUNITY_PROMPT);

  return (
    <section id="opportunities" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>
            <i
              className="fas fa-lightbulb section-title-icon"
              style={{ color: "var(--accent-amber)" }}
            ></i>
            Opportunity Engine
          </h2>
          <p>{`"Where should we look?" — AI-detected investment opportunities`}</p>
        </div>
        <div className="header-right header-actions">
          <button className="btn btn-secondary">
            <i className="fas fa-filter"></i> <span>Filter</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onAskAI(OPPORTUNITY_PROMPT)}
          >
            <i className="fas fa-robot"></i> <span>Ask AI</span>
          </button>
        </div>
      </div>

      <div className="chart-card insight-card insight-amber">
        <h3 className="insight-title">
          <i
            className="fas fa-brain"
            style={{ color: "var(--accent-cyan)" }}
          ></i>
          AI Opportunity Analysis
        </h3>
        <p className="insight-body">
          {isLoadingOpportunities ? (
            <span className="insight-loading">
              Generating live market insights...
            </span>
          ) : opportunity.includes(NO_ACCESS) ? (
            <span>
              Found{" "}
              <strong style={{ color: "var(--accent-amber)" }}>
                8 high-potential opportunities
              </strong>{" "}
              based on price-fundamental divergence and momentum signals.
              <strong> NVDA</strong> leads with exceptional AI-driven growth.
              <strong> GOOGL</strong> offers the best value with 30% upside
              potential.
              <strong> 3 stocks</strong> show high-conviction buy signals.
            </span>
          ) : (
            opportunity
          )}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Opportunities</h4>
            <i
              className="fas fa-lightbulb"
              style={{ color: "var(--accent-amber)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ color: "var(--accent-amber)" }}>
            8
          </div>
          <div className="stat-change">
            <span style={{ color: "var(--text-muted)" }}>
              AI-detected today
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>High Conviction</h4>
            <i
              className="fas fa-fire"
              style={{ color: "var(--accent-rose)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ color: "var(--accent-rose)" }}>
            3
          </div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>Strong buy signals</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Avg Upside</h4>
            <i
              className="fas fa-arrow-up"
              style={{ color: "var(--accent-emerald)" }}
            ></i>
          </div>
          <div
            className="stat-value"
            style={{ color: "var(--accent-emerald)" }}
          >
            +24.5%
          </div>
          <div className="stat-change">
            <span style={{ color: "var(--text-muted)" }}>Potential return</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Watchlist</h4>
            <i
              className="fas fa-eye"
              style={{ color: "var(--accent-blue)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ color: "var(--accent-blue)" }}>
            5
          </div>
          <div className="stat-change">
            <span style={{ color: "var(--text-muted)" }}>
              Under observation
            </span>
          </div>
        </div>
      </div>

      <div className="opp-list">
        {opportunities.map((opp) => {
          const convictionColor =
            opp.conviction === "High"
              ? "var(--accent-emerald)"
              : "var(--accent-amber)";
          return (
            <div
              key={opp.symbol}
              className="opp-card"
              role="button"
              tabIndex={0}
              onClick={() => onOpenModal(opp.symbol)}
              onKeyDown={(e) => e.key === "Enter" && onOpenModal(opp.symbol)}
            >
              <div className="opp-main">
                <div className="stock-logo opp-logo">
                  {opp.symbol.slice(0, 2)}
                </div>
                <div className="opp-text">
                  <h4>
                    {opp.name}{" "}
                    <span className="opp-ticker">({opp.symbol})</span>
                  </h4>
                  <p>{opp.reason}</p>
                </div>
              </div>

              <div className="opp-metrics">
                <div className="opp-metric">
                  <div className="pem-score pem-high">{opp.pem}</div>
                  <span
                    className="opp-conviction"
                    style={{ color: convictionColor }}
                  >
                    {opp.conviction} Conviction
                  </span>
                </div>
                <div className="opp-metric opp-upside">
                  <div className="opp-upside-value">+{opp.upside}%</div>
                  <div className="opp-upside-label">Upside</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Risk Engine ──────────────────────────────────────────── */

export function RiskChart() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const chartRef = useRef(null);
  const isNarrow = useMediaQuery("(max-width: 1280px)");
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
          type: "doughnut",
          data: {
            labels: [
              "Market Risk",
              "Concentration",
              "Volatility",
              "Liquidity",
              "Credit",
            ],
            datasets: [
              {
                label: "Risk Breakdown",
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                  "#ef4444",
                  "#f59e0b",
                  "#8b5cf6",
                  "#3b82f6",
                  "#10b981",
                ],
                borderWidth: 0,
                hoverOffset: 6,
              },
            ],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            resizeDelay: 100,
            cutout: isMobile ? "55%" : "60%",
            layout: { padding: 4 },
            plugins: {
              legend: {
                display: true,
                position: isNarrow ? "bottom" : "right",
                labels: {
                  color: "#94a3b8",
                  boxWidth: 10,
                  boxHeight: 10,
                  padding: isMobile ? 10 : 15,
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
                bodyColor: "#f8fafc",
                padding: 10,
                callbacks: { label: (c) => ` ${c.label}: ${c.raw}%` },
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

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !chart.ctx) return;
    chart.options.cutout = isMobile ? "60%" : "65%";
    chart.options.plugins.legend.position = isNarrow ? "bottom" : "right";
    chart.options.plugins.legend.labels.padding = isMobile ? 10 : 15;
    chart.options.plugins.legend.labels.font.size = isMobile ? 10 : 12;
    try {
      chart.update("none"); // "none" = no animation, no deferral
    } catch {}
  }, [isNarrow, isMobile]);

  useChartResize(chartRef, wrapperRef, []);

  return (
    <div ref={wrapperRef} className="canvas-wrap">
      <canvas ref={canvasRef} />
    </div>
  );
}

export function SectionRisk({ onOpenModal, onAskAI }) {
  const { text: risk, loading: isLoadingRisk } = useCachedInsight(
    "risk_summary",
    "What are the main risks in my portfolio?",
  );

  return (
    <section id="risk" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>
            <i
              className="fas fa-shield-alt section-title-icon"
              style={{ color: "var(--accent-rose)" }}
            ></i>
            Risk Engine
          </h2>
          <p>{`"What is going wrong?" — AI-powered risk monitoring`}</p>
        </div>
        <div className="header-right header-actions">
          <button className="btn btn-secondary">
            <i className="fas fa-bell"></i> <span>Manage Alerts</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onAskAI("What are the main risks in my portfolio?")}
          >
            <i className="fas fa-robot"></i> <span>Ask AI</span>
          </button>
        </div>
      </div>

      <div className="chart-card insight-card insight-rose">
        <h3 className="insight-title">
          <i
            className="fas fa-brain"
            style={{ color: "var(--accent-cyan)" }}
          ></i>
          AI Risk Assessment
        </h3>
        <p className="insight-body">
          {isLoadingRisk ? (
            <span className="insight-loading">
              Generating live market insights...
            </span>
          ) : risk.includes(NO_ACCESS) ? (
            <span>
              Overall portfolio risk is{" "}
              <strong style={{ color: "var(--accent-amber)" }}>MODERATE</strong>
              .{" "}
              <strong style={{ color: "var(--accent-rose)" }}>
                Tech concentration (42%)
              </strong>{" "}
              is elevated vs benchmark. <strong>TSLA</strong> showing
              price-fundamental divergence. VIX is low suggesting complacency —
              consider hedging.
            </span>
          ) : (
            risk
          )}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Portfolio Risk Score</h4>
            <i
              className="fas fa-shield-alt"
              style={{ color: "var(--accent-amber)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ color: "var(--accent-amber)" }}>
            68
          </div>
          <div className="stat-change">
            <span style={{ color: "var(--text-muted)" }}>Moderate risk</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Active Alerts</h4>
            <i
              className="fas fa-exclamation-triangle"
              style={{ color: "var(--accent-rose)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ color: "var(--accent-rose)" }}>
            3
          </div>
          <div className="stat-change negative">
            <i className="fas fa-arrow-up"></i>
            <span>Requires attention</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Concentration Risk</h4>
            <i
              className="fas fa-layer-group"
              style={{ color: "var(--accent-amber)" }}
            ></i>
          </div>
          <div className="stat-value" style={{ color: "var(--accent-amber)" }}>
            High
          </div>
          <div className="stat-change">
            <span style={{ color: "var(--text-muted)" }}>
              Tech overweight +14%
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>VIX Level</h4>
            <i
              className="fas fa-chart-area"
              style={{ color: "var(--accent-emerald)" }}
            ></i>
          </div>
          <div
            className="stat-value"
            style={{ color: "var(--accent-emerald)" }}
          >
            14.2
          </div>
          <div className="stat-change">
            <span style={{ color: "var(--accent-emerald)" }}>
              Low volatility
            </span>
          </div>
        </div>
      </div>

      <div className="two-column section-gap">
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i
                className="fas fa-exclamation-circle section-title-icon"
                style={{ color: "var(--accent-rose)" }}
              ></i>
              Active Risk Alerts
            </h3>
          </div>
          {riskData.alerts.map((alert, i) => {
            const tone =
              alert.severity === "high"
                ? "rose"
                : alert.severity === "medium"
                  ? "amber"
                  : "blue";
            const iconName =
              alert.type === "divergence"
                ? "exclamation-triangle"
                : alert.type === "concentration"
                  ? "layer-group"
                  : "chart-area";
            return (
              <div key={i} className={`risk-alert risk-alert-${tone}`}>
                <div className="risk-alert-icon">
                  <i className={`fas fa-${iconName}`}></i>
                </div>
                <div className="risk-alert-body">
                  <div className="risk-alert-title">
                    {alert.title}
                    {alert.stock ? ` - ${alert.stock}` : ""}
                  </div>
                  <div className="risk-alert-msg">{alert.message}</div>
                  <div className="risk-alert-action">
                    <i className="fas fa-lightbulb"></i>
                    {alert.action}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i
                className="fas fa-chart-bar section-title-icon"
                style={{ color: "var(--accent-blue)" }}
              ></i>
              Risk by Category
            </h3>
          </div>
          <div className="chart-container risk-chart-container">
            <RiskChart />
          </div>
        </div>
      </div>

      <div className="chart-card section-gap">
        <div className="chart-header">
          <h3>
            <i
              className="fas fa-th section-title-icon"
              style={{ color: "var(--accent-purple)" }}
            ></i>
            Position Risk Heatmap
          </h3>
        </div>

        <div className="heatmap-grid">
          {riskPositions.map((p) => {
            const tone = p.risk > 60 ? "high" : p.risk > 40 ? "medium" : "low";
            return (
              <div
                key={p.symbol}
                className="heatmap-cell"
                role="button"
                tabIndex={0}
                onClick={() => onOpenModal(p.symbol)}
                onKeyDown={(e) => e.key === "Enter" && onOpenModal(p.symbol)}
              >
                <div className={`heatmap-tile heatmap-${tone}`}>
                  <span>{p.symbol}</span>
                </div>
                <div className="heatmap-risk">Risk: {p.risk}</div>
                <div
                  className="heatmap-return"
                  style={{
                    color:
                      p.return >= 0
                        ? "var(--accent-emerald)"
                        : "var(--accent-rose)",
                  }}
                >
                  {p.return >= 0 ? "+" : ""}
                  {p.return}%
                </div>
              </div>
            );
          })}
        </div>

        <div className="heatmap-legend">
          <div className="legend-item">
            <span className="legend-swatch heatmap-low"></span> Low Risk
          </div>
          <div className="legend-item">
            <span className="legend-swatch heatmap-medium"></span> Medium Risk
          </div>
          <div className="legend-item">
            <span className="legend-swatch heatmap-high"></span> High Risk
          </div>
        </div>
      </div>

      <div className="chart-card section-gap">
        <div className="chart-header">
          <h3>
            <i
              className="fas fa-lightbulb section-title-icon"
              style={{ color: "var(--accent-amber)" }}
            ></i>
            AI Mitigation Suggestions
          </h3>
        </div>
        <div className="suggestion-grid">
          {riskData.suggestions.map((s, i) => (
            <div key={i} className="suggestion-card">
              <div className="suggestion-head">
                <i className={`fas ${s.icon}`}></i>
                <span>{s.title}</span>
              </div>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Market Chart ─────────────────────────────────────────── */

export function MarketChart() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const chartRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    let chart = null;
    let cancelled = false;

    const raf = requestAnimationFrame(() => {
      if (cancelled || !ctx.isConnected) return;
      try {
        chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [
              "9:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
              "12:30",
              "1:00",
              "1:30",
              "2:00",
              "2:30",
              "3:00",
              "3:30",
              "4:00",
            ],
            datasets: [
              {
                label: "S&P 500",
                data: [
                  5200, 5215, 5220, 5210, 5230, 5245, 5238, 5250, 5245, 5260,
                  5255, 5270, 5265, 5278,
                ],
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: isMobile ? 2 : 2.5,
                pointRadius: 0,
                pointHitRadius: 20,
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
              legend: { display: false },
              tooltip: {
                backgroundColor: "#1a2332",
                borderColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                titleColor: "#f8fafc",
                bodyColor: "#94a3b8",
                padding: 10,
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(148, 163, 184, 0.1)", drawTicks: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: isMobile ? 9 : 11 },
                  maxRotation: 0,
                  maxTicksLimit: isMobile ? 4 : 7,
                },
              },
              y: {
                grid: { color: "rgba(148, 163, 184, 0.1)", drawTicks: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: isMobile ? 9 : 11 },
                  maxTicksLimit: isMobile ? 4 : 6,
                  padding: 6,
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

/* ── Stocks Section ───────────────────────────────────────── */

export function SectionStocks({ onOpenModal, activeList }) {
  const list = activeList && activeList.length > 0 ? activeList : stocksData;

  const columns = [
    {
      key: "stock",
      label: "Stock",
      render: (s) => (
        <div className="stock-info">
          <div className="stock-logo">{s.symbol.slice(0, 2)}</div>
          <div className="stock-details">
            <h4>{s.symbol}</h4>
            <span>{s.name}</span>
          </div>
        </div>
      ),
    },
    { key: "price", label: "Price", render: (s) => `$${s.price.toFixed(2)}` },
    {
      key: "change",
      label: "Change",
      render: (s) => (
        <span className={`price-change ${getChangeClass(s.change)}`}>
          {getChangeSign(s.change)}
          {s.change.toFixed(2)}%
        </span>
      ),
    },
    { key: "mcap", label: "Market Cap", render: (s) => s.marketCap },
    { key: "pe", label: "P/E", render: (s) => s.pe?.toFixed(1) },
    { key: "eps", label: "EPS", render: (s) => `$${s.eps?.toFixed(2)}` },
    {
      key: "pem",
      label: "PEM Score",
      render: (s) => (
        <div className={`pem-score ${getPemClass(s.pem)}`}>{s.pem}</div>
      ),
    },
  ];

  return (
    <section id="stocks" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>Stock Analysis</h2>
          <p>Comprehensive stock research and insights</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by ticker or name..."
              aria-label="Search stocks"
            />
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Market Overview - S&amp;P 500</h3>
            <div className="chart-tabs">
              {["1D", "1W", "1M"].map((t) => (
                <button
                  key={t}
                  className={`chart-tab${t === "1D" ? " active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <MarketChart />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Market Sentiment</h3>
          </div>
          <div className="chart-container sentiment-container">
            <div className="sentiment-block">
              <div className="sentiment-headline">+67%</div>
              <p className="sentiment-caption">Bullish Sentiment</p>
              <div className="sentiment-splits">
                <div className="sentiment-split">
                  <div style={{ color: "var(--accent-emerald)" }}>67%</div>
                  <span>Bullish</span>
                </div>
                <div className="sentiment-split">
                  <div style={{ color: "var(--text-muted)" }}>21%</div>
                  <span>Neutral</span>
                </div>
                <div className="sentiment-split">
                  <div style={{ color: "var(--accent-rose)" }}>12%</div>
                  <span>Bearish</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="holdings-card">
        <div className="table-header">
          <h3>All Stocks</h3>
          <div className="table-actions">
            <button className="table-btn">
              <i className="fas fa-filter"></i> Filter
            </button>
            <button className="table-btn">
              <i className="fas fa-sort"></i> Sort
            </button>
          </div>
        </div>
        <ResponsiveStockTable
          data={list}
          columns={columns}
          onRowClick={onOpenModal}
          minWidth={860}
          action={(s) => (
            <button
              className="btn btn-secondary table-action-btn"
              onClick={() => onOpenModal(s.symbol)}
            >
              Analyze
            </button>
          )}
        />
      </div>
    </section>
  );
}

/* ── Screener Section ─────────────────────────────────────── */

export function SectionScreener({ onOpenModal, activeList }) {
  const baseList =
    activeList && activeList.length > 0 ? activeList : stocksData;

  const [filterMarketCap, setFilterMarketCap] = useState("All Sizes");
  const [filterPEM, setFilterPEM] = useState("All Scores");
  const [filterSector, setFilterSector] = useState("All Sectors");
  const [filterChange, setFilterChange] = useState("Any");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filterDefs = [
    {
      label: "Market Cap",
      opts: [
        "All Sizes",
        "Large Cap ($10B+)",
        "Mid Cap ($2B-$10B)",
        "Small Cap (<$2B)",
      ],
      value: filterMarketCap,
      onChange: setFilterMarketCap,
    },
    {
      label: "PEM Score",
      opts: ["All Scores", "High (70+)", "Medium (50-70)", "Low (<50)"],
      value: filterPEM,
      onChange: setFilterPEM,
    },
    {
      label: "Sector",
      opts: [
        "All Sectors",
        "Technology",
        "Healthcare",
        "Financials",
        "Consumer",
      ],
      value: filterSector,
      onChange: setFilterSector,
    },
    {
      label: "Price Change",
      opts: ["Any", "+5% or more", "+2% or more", "-2% or less"],
      value: filterChange,
      onChange: setFilterChange,
    },
  ];

  const activeFilterCount = [
    filterMarketCap !== "All Sizes",
    filterPEM !== "All Scores",
    filterSector !== "All Sectors",
    filterChange !== "Any",
  ].filter(Boolean).length;

  const filteredList = baseList
    .filter((stock) => {
      if (filterMarketCap !== "All Sizes") {
        const raw = stock.marketCapRaw || 0;
        if (filterMarketCap === "Large Cap ($10B+)" && raw < 10e9) return false;
        if (
          filterMarketCap === "Mid Cap ($2B-$10B)" &&
          (raw < 2e9 || raw >= 10e9)
        )
          return false;
        if (filterMarketCap === "Small Cap (<$2B)" && raw >= 2e9) return false;
      }
      if (filterPEM !== "All Scores") {
        if (filterPEM === "High (70+)" && stock.pem < 70) return false;
        if (
          filterPEM === "Medium (50-70)" &&
          (stock.pem < 50 || stock.pem >= 70)
        )
          return false;
        if (filterPEM === "Low (<50)" && stock.pem >= 50) return false;
      }
      if (filterSector !== "All Sectors") {
        const sector = (stock.sector || "").toLowerCase();
        if (!sector.includes(filterSector.toLowerCase())) return false;
      }
      if (filterChange !== "Any") {
        if (filterChange === "+5% or more" && stock.change < 5) return false;
        if (filterChange === "+2% or more" && stock.change < 2) return false;
        if (filterChange === "-2% or less" && stock.change > -2) return false;
      }
      return true;
    })
    .sort((a, b) => b.pem - a.pem);

  const columns = [
    {
      key: "stock",
      label: "Stock",
      render: (s) => (
        <div className="stock-info">
          <div className="stock-logo">{s.symbol.slice(0, 2)}</div>
          <div className="stock-details">
            <h4>{s.symbol}</h4>
            <span>{s.name}</span>
          </div>
        </div>
      ),
    },
    { key: "price", label: "Price", render: (s) => `$${s.price.toFixed(2)}` },
    {
      key: "change",
      label: "Change",
      render: (s) => (
        <span className={`price-change ${getChangeClass(s.change)}`}>
          {getChangeSign(s.change)}
          {s.change.toFixed(2)}%
        </span>
      ),
    },
    { key: "mcap", label: "Market Cap", render: (s) => s.marketCap },
    { key: "pe", label: "P/E", render: (s) => s.pe?.toFixed(1) },
    {
      key: "pem",
      label: "PEM Score",
      render: (s) => (
        <div className={`pem-score ${getPemClass(s.pem)}`}>{s.pem}</div>
      ),
    },
  ];

  const showFilters = !isMobile || filtersOpen;

  return (
    <section id="screener" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>Stock Screener</h2>
          <p>Filter stocks by custom criteria</p>
        </div>
      </div>

      <div className="chart-card screener-card">
        <button
          className="screener-toggle"
          type="button"
          onClick={() => isMobile && setFiltersOpen((o) => !o)}
          aria-expanded={showFilters}
        >
          <h3>Filter Criteria</h3>
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
          <i
            className={`fas fa-chevron-down screener-chevron${
              filtersOpen ? " open" : ""
            }`}
          ></i>
        </button>

        {showFilters && (
          <>
            <div className="filter-grid">
              {filterDefs.map((f) => (
                <div key={f.label} className="filter-field">
                  <label htmlFor={`filter-${f.label}`}>{f.label}</label>
                  <select
                    id={`filter-${f.label}`}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                  >
                    {f.opts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button className="btn btn-primary screener-apply">
              <i className="fas fa-search"></i> Apply Filters
            </button>
          </>
        )}
      </div>

      <div className="holdings-card">
        <div className="table-header">
          <h3>Filtered Results ({filteredList.length})</h3>
        </div>
        {filteredList.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-filter"></i>
            <p>No stocks match these filters.</p>
          </div>
        ) : (
          <ResponsiveStockTable
            data={filteredList}
            columns={columns}
            onRowClick={onOpenModal}
            minWidth={800}
            action={(s) => (
              <button
                className="btn btn-secondary table-action-btn"
                onClick={() => onOpenModal(s.symbol)}
              >
                View
              </button>
            )}
          />
        )}
      </div>
    </section>
  );
}
