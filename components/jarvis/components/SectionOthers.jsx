import { useEffect, useRef, useState } from "react";
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
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
// ── Portfolio Intelligence ────────────────────────────────────

export function BenchmarkChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    let myBenchmarkChart = null;

    if (ctx) {
      myBenchmarkChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Portfolio",
              data: [100, 104, 108, 112, 115, 120],
              borderColor: "#06b6d4",
              backgroundColor: "rgba(6, 182, 212, 0.1)", // Area fill color
              fill: true,
              borderWidth: 2,
              tension: 0.3, // Subtle smoothing to match area aesthetic
              pointRadius: 0,
              pointHoverRadius: 5,
            },
            {
              label: "S&P 500",
              data: [100, 102, 105, 107, 109, 112],
              borderColor: "#64748b",
              backgroundColor: "transparent",
              fill: false,
              borderWidth: 1.5,
              borderDash: [5, 5], // Mimics the Highcharts 'Dash' style
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 5,
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
            tooltip: {
              backgroundColor: "#1a2332",
              borderColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              titleColor: "#f8fafc",
              bodyColor: "#f8fafc",
              callbacks: {
                // Formats tooltip values to include the % suffix
                label: (context) =>
                  ` ${context.dataset.label}: ${context.raw}%`,
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
              ticks: {
                color: "#94a3b8",
                // Appends the % sign to the y-axis values
                callback: (v) => v + "%",
              },
            },
          },
        },
      });
    }

    // Clean up chart instance cleanly on unmount to avoid canvas conflicts
    return () => {
      if (myBenchmarkChart) {
        myBenchmarkChart.destroy();
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export function SectionPortfolioIntel({ onAskAI }) {
  const [portfolioIntel, setportfolioIntel] = useState("");
  const [isLoadingIntel, setIsLoadingIntel] = useState(false);

  const CACHE_KEY = "initial_summary";

  const fetchInitialSummury = async (forceRefresh = false) => {
    // 1. If not a forced refresh, look for data inside the cache first
    if (!forceRefresh) {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setportfolioIntel(cachedData);
        return; // Exit early, no API call needed!
      }
    }

    // 2. Fetch fresh data if cache missed or if user clicked Refresh
    try {
      setIsLoadingIntel(true);

      const response = await sendChatMessage(
        "Analyze my portfolio performance",
      );

      // Update local state and save to cache
      setportfolioIntel(response);
      sessionStorage.setItem(CACHE_KEY, response);
    } catch (error) {
      console.error("Error fetching market summary:", error);
      // Fallback message if there's no pre-existing text to show
      if (!marketSummary) {
        setportfolioIntel("Unable to load the market summary at this time.");
      }
    } finally {
      setIsLoadingIntel(false);
    }
  };

  // Run automatically on page load / component mount
  useEffect(() => {
    fetchInitialSummury(false);
  }, []);

  return (
    <section id="portfolio-intel" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>
            <i
              className="fas fa-brain"
              style={{ color: "var(--accent-purple)", marginRight: 12 }}
            ></i>
            Portfolio Intelligence
          </h2>
          <p>{`"What is driving performance?" — AI-powered portfolio analysis`}</p>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary">
            <i className="fas fa-download"></i> Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onAskAI("Analyze my portfolio performance")}
          >
            <i className="fas fa-robot"></i> Ask AI
          </button>
        </div>
      </div>

      <div
        className="chart-card"
        style={{
          marginBottom: 24,
          borderLeft: "4px solid var(--accent-purple)",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>
          <i
            className="fas fa-brain"
            style={{ color: "var(--accent-cyan)", marginRight: 8 }}
          ></i>
          AI Portfolio Summary
        </h3>
        <p
          style={{
            fontSize: "0.9em",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
          }}
        >
          {isLoadingIntel ? (
            <span style={{ opacity: 0.6, fontStyle: "italic" }}>
              Generating live market insights...
            </span>
          ) : portfolioIntel.includes("I currently do not have access") ? (
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

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Portfolio Value</h4>
            <i className="fas fa-wallet"></i>
          </div>
          <div className="stat-value">$2.47M</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>+$127,450 (+5.44%)
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
            <i className="fas fa-arrow-up"></i>Outperforming S&amp;P 500
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
            <i className="fas fa-arrow-up"></i>+$347,200 unrealized
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

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: 20 }}
      >
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Caption</h4>
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
            <i className="fas fa-arrow-up"></i>+12% YTD
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
          <div id="transactionsList">
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
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: `${color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className={`fas fa-${icon}`} style={{ color }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "0.85em" }}>
                      {label} {tx.symbol}
                    </h4>
                    <span
                      style={{ fontSize: "0.7em", color: "var(--text-muted)" }}
                    >
                      {detail}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: "0.7em", color: "var(--text-muted)" }}
                  >
                    {tx.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Opportunity Engine ────────────────────────────────────────

export function SectionOpportunities({ onOpenModal, onAskAI, activeList }) {
  const list = activeList && activeList.length > 0 ? activeList : stocksData;

  const [opportunity, setOpportunities] = useState("");
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);

  const CACHE_KEY = "opportunity_summary";

  const fetchOpportunity = async (forceRefresh = false) => {
    // 1. If not a forced refresh, look for data inside the cache first
    if (!forceRefresh) {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setOpportunities(cachedData);
        return; // Exit early, no API call needed!
      }
    }

    // 2. Fetch fresh data if cache missed or if user clicked Refresh
    try {
      setIsLoadingOpportunities(true);

      const response = await sendChatMessage(
        "Which Sectors are stocks are best right now , Which sectors or stocks should i look for investements ? Give reasons why should we choose that stock",
      );

      // Update local state and save to cache
      setOpportunities(response);
      sessionStorage.setItem(CACHE_KEY, response);
    } catch (error) {
      console.error("Error fetching market summary:", error);
      // Fallback message if there's no pre-existing text to show
      if (!marketSummary) {
        setOpportunities("Unable to load the market summary at this time.");
      }
    } finally {
      setIsLoadingOpportunities(false);
    }
  };

  // Run automatically on page load / component mount
  useEffect(() => {
    fetchOpportunity(false);
  }, []);

  return (
    <section id="opportunities" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>
            <i
              className="fas fa-lightbulb"
              style={{ color: "var(--accent-amber)", marginRight: 12 }}
            ></i>
            Opportunity Engine
          </h2>
          <p>{`"Where should we look?" — AI-detected investment opportunities`}</p>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary">
            <i className="fas fa-filter"></i> Filter
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              onAskAI(
                "Which Sectors are stocks are best right now , Which sectors or stocks should i look for investements ? Give reasons why should we choose that stock",
              )
            }
          >
            <i className="fas fa-robot"></i> Ask AI
          </button>
        </div>
      </div>

      <div
        className="chart-card"
        style={{
          marginBottom: 24,
          borderLeft: "4px solid var(--accent-amber)",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>
          <i
            className="fas fa-brain"
            style={{ color: "var(--accent-cyan)", marginRight: 8 }}
          ></i>
          AI Opportunity Analysis
        </h3>
        <p
          style={{
            fontSize: "0.9em",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
          }}
        >
          {isLoadingOpportunities ? (
            <span style={{ opacity: 0.6, fontStyle: "italic" }}>
              Generating live market insights...
            </span>
          ) : opportunity.includes("I currently do not have access") ? (
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
            <i className="fas fa-arrow-up"></i>Strong buy signals
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

      <div style={{ marginTop: 20 }}>
        {opportunities.map((opp) => {
          const convictionColor =
            opp.conviction === "High"
              ? "var(--accent-emerald)"
              : "var(--accent-amber)";
          return (
            <div
              key={opp.symbol}
              className="holdings-card"
              style={{ marginBottom: 16, cursor: "pointer" }}
              onClick={() => onOpenModal(opp.symbol)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  className="stock-logo"
                  style={{ width: 50, height: 50, fontSize: "1em" }}
                >
                  {opp.symbol.slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "1em", marginBottom: 4 }}>
                    {opp.name}{" "}
                    <span
                      style={{ color: "var(--text-muted)", fontWeight: 400 }}
                    >
                      ({opp.symbol})
                    </span>
                  </h4>
                  <p
                    style={{
                      fontSize: "0.8em",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {opp.reason}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    className="pem-score pem-high"
                    style={{ marginBottom: 8 }}
                  >
                    {opp.pem}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75em",
                      color: convictionColor,
                      fontWeight: 500,
                    }}
                  >
                    {opp.conviction} Conviction
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "1.1em",
                      fontWeight: 600,
                      color: "var(--accent-emerald)",
                    }}
                  >
                    +{opp.upside}%
                  </div>
                  <div
                    style={{ fontSize: "0.7em", color: "var(--text-muted)" }}
                  >
                    Upside
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Risk Engine ───────────────────────────────────────────────

export function RiskChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    let myRiskChart = null;

    if (ctx) {
      myRiskChart = new Chart(ctx, {
        type: "doughnut", // Replaces Highcharts pie + innerSize
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
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "60%", // Replaces Highcharts innerSize: "60%"
          plugins: {
            legend: {
              display: true,
              position: "right", // Vertical right alignment
              labels: {
                color: "#94a3b8",
                boxWidth: 12,
                padding: 15,
                font: { family: "Inter, sans-serif" },
              },
            },
            tooltip: {
              backgroundColor: "#1a2332",
              borderColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              titleColor: "#f8fafc",
              bodyColor: "#f8fafc",
              callbacks: {
                label: (context) => ` ${context.label}: ${context.raw}%`,
              },
            },
          },
        },
      });
    }

    // Clean up chart instance cleanly on unmount to avoid canvas collision
    return () => {
      if (myRiskChart) {
        myRiskChart.destroy();
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export function SectionRisk({ onOpenModal, onAskAI }) {
  const [risk, setRisk] = useState("");
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);
  const CACHE_KEY = "risk_summury";

  const fetchRisk = async (forceRefresh = false) => {
    // 1. If not a forced refresh, look for data inside the cache first
    if (!forceRefresh) {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setRisk(cachedData);
        return; // Exit early, no API call needed!
      }
    }

    // 2. Fetch fresh data if cache missed or if user clicked Refresh
    try {
      setIsLoadingRisk(true);

      const response = await sendChatMessage(
        "What are the main risks in my portfolio?",
      );

      // Update local state and save to cache
      setRisk(response);
      sessionStorage.setItem(CACHE_KEY, response);
    } catch (error) {
      console.error("Error fetching market summary:", error);
      // Fallback message if there's no pre-existing text to show
      if (!marketSummary) {
        setRisk("Unable to load the market summary at this time.");
      }
    } finally {
      setIsLoadingRisk(false);
    }
  };

  // Run automatically on page load / component mount
  useEffect(() => {
    fetchRisk(false);
  }, []);

  return (
    <section id="risk" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>
            <i
              className="fas fa-shield-alt"
              style={{ color: "var(--accent-rose)", marginRight: 12 }}
            ></i>
            Risk Engine
          </h2>
          <p>{`"What is going wrong?" — AI-powered risk monitoring`}</p>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary">
            <i className="fas fa-bell"></i> Manage Alerts
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onAskAI("What are the main risks in my portfolio?")}
          >
            <i className="fas fa-robot"></i> Ask AI
          </button>
        </div>
      </div>

      <div
        className="chart-card"
        style={{ marginBottom: 24, borderLeft: "4px solid var(--accent-rose)" }}
      >
        <h3 style={{ marginBottom: 12 }}>
          <i
            className="fas fa-brain"
            style={{ color: "var(--accent-cyan)", marginRight: 8 }}
          ></i>
          AI Risk Assessment
        </h3>
        <p
          style={{
            fontSize: "0.9em",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
          }}
        >
          {isLoadingRisk ? (
            <span style={{ opacity: 0.6, fontStyle: "italic" }}>
              Generating live market insights...
            </span>
          ) : risk.includes("I currently do not have access") ? (
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
            <i className="fas fa-arrow-up"></i>Requires attention
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

      <div className="two-column" style={{ marginTop: 24 }}>
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <i
                className="fas fa-exclamation-circle"
                style={{ color: "var(--accent-rose)", marginRight: 8 }}
              ></i>
              Active Risk Alerts
            </h3>
          </div>
          {riskData.alerts.map((alert, i) => {
            const borderColor =
              alert.severity === "high"
                ? "var(--accent-rose)"
                : alert.severity === "medium"
                  ? "var(--accent-amber)"
                  : "var(--accent-blue)";
            const iconBg =
              alert.severity === "high"
                ? "rgba(239,68,68,0.2)"
                : alert.severity === "medium"
                  ? "rgba(245,158,11,0.2)"
                  : "rgba(59,130,246,0.2)";
            const iconColor =
              alert.severity === "high"
                ? "var(--accent-rose)"
                : alert.severity === "medium"
                  ? "var(--accent-amber)"
                  : "var(--accent-blue)";
            const iconName =
              alert.type === "divergence"
                ? "exclamation-triangle"
                : alert.type === "concentration"
                  ? "layer-group"
                  : "chart-area";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: 16,
                  background: "var(--bg-tertiary)",
                  borderRadius: 10,
                  marginBottom: 12,
                  borderLeft: `3px solid ${borderColor}`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <i
                    className={`fas fa-${iconName}`}
                    style={{ color: iconColor }}
                  ></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.85em",
                      marginBottom: 4,
                    }}
                  >
                    {alert.title}
                    {alert.stock ? ` - ${alert.stock}` : ""}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75em",
                      color: "var(--text-secondary)",
                      marginBottom: 8,
                    }}
                  >
                    {alert.message}
                  </div>
                  <div
                    style={{ fontSize: "0.7em", color: "var(--accent-cyan)" }}
                  >
                    <i
                      className="fas fa-lightbulb"
                      style={{ marginRight: 4 }}
                    ></i>
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
                className="fas fa-chart-bar"
                style={{ color: "var(--accent-blue)", marginRight: 8 }}
              ></i>
              Risk by Category
            </h3>
          </div>
          <div className="chart-container" style={{ height: 250 }}>
            <RiskChart />
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: 24 }}>
        <div className="chart-header">
          <h3>
            <i
              className="fas fa-th"
              style={{ color: "var(--accent-purple)", marginRight: 8 }}
            ></i>
            Position Risk Heatmap
          </h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, 1fr)",
            gap: 8,
          }}
        >
          {riskPositions.map((p) => {
            const color =
              p.risk > 60
                ? "rgba(239,68,68,0.6)"
                : p.risk > 40
                  ? "rgba(245,158,11,0.6)"
                  : "rgba(16,185,129,0.6)";
            return (
              <div
                key={p.symbol}
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => onOpenModal(p.symbol)}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    background: color,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "0.9em" }}>
                    {p.symbol}
                  </span>
                </div>
                <div style={{ fontSize: "0.65em", color: "var(--text-muted)" }}>
                  Risk: {p.risk}
                </div>
                <div
                  style={{
                    fontSize: "0.65em",
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 16,
            fontSize: "0.7em",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                background: "rgba(16,185,129,0.6)",
                borderRadius: 2,
              }}
            ></div>{" "}
            Low Risk
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                background: "rgba(245,158,11,0.6)",
                borderRadius: 2,
              }}
            ></div>{" "}
            Medium Risk
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                background: "rgba(239,68,68,0.6)",
                borderRadius: 2,
              }}
            ></div>{" "}
            High Risk
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: 24 }}>
        <div className="chart-header">
          <h3>
            <i
              className="fas fa-lightbulb"
              style={{ color: "var(--accent-amber)", marginRight: 8 }}
            ></i>
            AI Mitigation Suggestions
          </h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {riskData.suggestions.map((s, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-tertiary)",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <i
                  className={`fas ${s.icon}`}
                  style={{ color: "var(--accent-amber)", fontSize: "1.2em" }}
                ></i>
                <span style={{ fontWeight: 600, fontSize: "0.85em" }}>
                  {s.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8em",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stocks Section ────────────────────────────────────────────

export function MarketChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    let myMarketChart = null;

    if (ctx) {
      myMarketChart = new Chart(ctx, {
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
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { color: "rgba(148, 163, 184, 0.1)" },
              ticks: { color: "#94a3b8", maxTicksLimit: 7 },
            },
            y: {
              grid: { color: "rgba(148, 163, 184, 0.1)" },
              ticks: { color: "#94a3b8" },
            },
          },
        },
      });
    }

    // Clean up chart instance to prevent canvas collision errors on hot-reload or unmount
    return () => {
      if (myMarketChart) {
        myMarketChart.destroy();
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export function SectionStocks({ onOpenModal, activeList }) {
  const list = activeList && activeList.length > 0 ? activeList : stocksData;
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
            <input type="text" placeholder="Search by ticker or name..." />
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
          <div
            className="chart-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "4em",
                  fontWeight: 700,
                  color: "var(--accent-emerald)",
                }}
              >
                +67%
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85em" }}>
                Bullish Sentiment
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "1.5em",
                      fontWeight: 600,
                      color: "var(--accent-emerald)",
                    }}
                  >
                    67%
                  </div>
                  <div
                    style={{ fontSize: "0.7em", color: "var(--text-muted)" }}
                  >
                    Bullish
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "1.5em",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
                    21%
                  </div>
                  <div
                    style={{ fontSize: "0.7em", color: "var(--text-muted)" }}
                  >
                    Neutral
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "1.5em",
                      fontWeight: 600,
                      color: "var(--accent-rose)",
                    }}
                  >
                    12%
                  </div>
                  <div
                    style={{ fontSize: "0.7em", color: "var(--text-muted)" }}
                  >
                    Bearish
                  </div>
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
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Price</th>
              <th>Change</th>
              <th>Market Cap</th>
              <th>P/E</th>
              <th>EPS</th>
              <th>PEM Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((stock) => {
              const pemClass = getPemClass(stock.pem);
              const chClass = getChangeClass(stock.change);
              const chSign = getChangeSign(stock.change);
              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onOpenModal(stock.symbol)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="stock-info">
                      <div className="stock-logo">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div className="stock-details">
                        <h4>{stock.symbol}</h4>
                        <span>{stock.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>${stock.price.toFixed(2)}</td>
                  <td className={`price-change ${chClass}`}>
                    {chSign}
                    {stock.change.toFixed(2)}%
                  </td>
                  <td>{stock.marketCap}</td>
                  <td>{stock.pe.toFixed(1)}</td>
                  <td>${stock.eps.toFixed(2)}</td>
                  <td>
                    <div className={`pem-score ${pemClass}`}>{stock.pem}</div>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "0.7em" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(stock.symbol);
                      }}
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Screener Section ──────────────────────────────────────────

export function SectionScreener({ onOpenModal, activeList, allStocksData }) {
  const baseList =
    activeList && activeList.length > 0 ? activeList : stocksData;
  // allStocksData && allStocksData.length > 0
  //   ? allStocksData
  
  const [filterMarketCap, setFilterMarketCap] = useState("All Sizes");
  const [filterPEM, setFilterPEM] = useState("All Scores");
  const [filterSector, setFilterSector] = useState("All Sectors");
  const [filterChange, setFilterChange] = useState("Any");

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
        if (filterSector === "Consumer") {
          if (!sector.includes("consumer")) return false;
        } else {
          if (!sector.includes(filterSector.toLowerCase())) return false;
        }
      }
      if (filterChange !== "Any") {
        if (filterChange === "+5% or more" && stock.change < 5) return false;
        if (filterChange === "+2% or more" && stock.change < 2) return false;
        if (filterChange === "-2% or less" && stock.change > -2) return false;
      }
      return true;
    })
    .sort((a, b) => b.pem - a.pem);

  return (
    <section id="screener" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>Stock Screener</h2>
          <p>Filter stocks by custom criteria</p>
        </div>
      </div>
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20 }}>Filter Criteria</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {filterDefs.map((f) => (
            <div key={f.label}>
              <label
                style={{
                  fontSize: "0.7em",
                  color: "var(--text-muted)",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                {f.label}
              </label>
              <select
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                  fontSize: "0.85em",
                  fontFamily: "inherit",
                }}
              >
                {f.opts.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 20 }}>
          <i className="fas fa-search"></i> Apply Filters
        </button>
      </div>
      <div className="holdings-card">
        <div className="table-header">
          <h3>Filtered Results ({filteredList.length} stocks)</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Price</th>
              <th>Change</th>
              <th>Market Cap</th>
              <th>P/E</th>
              <th>PEM Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((stock) => {
              const pemClass = getPemClass(stock.pem);
              const chClass = getChangeClass(stock.change);
              const chSign = getChangeSign(stock.change);
              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onOpenModal(stock.symbol)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="stock-info">
                      <div className="stock-logo">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div className="stock-details">
                        <h4>{stock.symbol}</h4>
                        <span>{stock.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>${stock.price.toFixed(2)}</td>
                  <td className={`price-change ${chClass}`}>
                    {chSign}
                    {stock.change.toFixed(2)}%
                  </td>
                  <td>{stock.marketCap}</td>
                  <td>{stock.pe.toFixed(1)}</td>
                  <td>
                    <div className={`pem-score ${pemClass}`}>{stock.pem}</div>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "0.7em" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(stock.symbol);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
