import { useEffect, useRef, useState } from "react";
import { stocksData } from "../data/staticData.js";
import {
  getPemClass,
  getChangeClass,
  getChangeSign,
  formatCurrency,
} from "../utils/helpers.js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

/* Shared hook: tracks a media query */
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

/* Shared hook: keeps a Chart.js instance sized to its container */
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

export function PortfolioChart() {
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
            labels: ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"],
            datasets: [
              {
                label: "Portfolio",
                data: [
                  2450000, 2458000, 2462000, 2455000, 2465000, 2468000, 2472000,
                  2473450,
                ],
                borderColor: "#06b6d4",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: isMobile ? 2 : 2.5,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHitRadius: 20,
              },
              {
                label: "S&P 500",
                data: [
                  2450000, 2452000, 2455000, 2450000, 2458000, 2460000, 2463000,
                  2461000,
                ],
                borderColor: "#64748b",
                borderDash: [5, 5],
                borderWidth: isMobile ? 1.5 : 2,
                fill: false,
                tension: 0.4,
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
            layout: { padding: { left: 0, right: 4, top: 0, bottom: 0 } },
            plugins: {
              legend: {
                display: true,
                position: "top",
                align: isMobile ? "start" : "center",
                labels: {
                  color: "#94a3b8",
                  boxWidth: 12,
                  padding: isMobile ? 10 : 20,
                  font: { size: isMobile ? 10 : 12 },
                  usePointStyle: true,
                },
              },
              tooltip: {
                backgroundColor: "#1a2332",
                borderColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                titleColor: "#f8fafc",
                bodyColor: "#94a3b8",
                padding: 10,
                displayColors: true,
                callbacks: {
                  label: (c) =>
                    `${c.dataset.label}: $${(c.parsed.y / 1000000).toFixed(3)}M`,
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
                  autoSkip: true,
                  maxTicksLimit: isMobile ? 4 : 8,
                },
              },
              y: {
                grid: { color: "rgba(148, 163, 184, 0.1)", drawTicks: false },
                ticks: {
                  color: "#94a3b8",
                  font: { size: isMobile ? 9 : 11 },
                  maxTicksLimit: isMobile ? 4 : 6,
                  padding: 6,
                  callback: (v) => "$" + (v / 1000000).toFixed(2) + "M",
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

export function AllocationChart() {
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
              "Technology",
              "Healthcare",
              "Financials",
              "Consumer",
              "Other",
            ],
            datasets: [
              {
                label: "Allocation",
                data: [42, 18, 22, 12, 6],
                backgroundColor: [
                  "#06b6d4",
                  "#10b981",
                  "#3b82f6",
                  "#f59e0b",
                  "#64748b",
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
            cutout: isMobile ? "60%" : "65%",
            layout: { padding: 4 },
            plugins: {
              legend: {
                display: true,
                // Stack the legend below the ring when space is tight
                position: isNarrow ? "bottom" : "right",
                labels: {
                  color: "#94a3b8",
                  boxWidth: 10,
                  boxHeight: 10,
                  padding: isMobile ? 10 : 15,
                  font: {
                    family: "Inter, sans-serif",
                    size: isMobile ? 10 : 12,
                  },
                  usePointStyle: true,
                },
              },
              tooltip: {
                backgroundColor: "#1a2332",
                borderColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                titleColor: "#f8fafc",
                bodyColor: "#94a3b8",
                padding: 10,
                callbacks: { label: (c) => ` ${c.label}: ${c.parsed}%` },
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

  // Mutate options on breakpoint change instead of rebuilding
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

export default function SectionDashboard({ onOpenModal, activeList }) {
  const list = activeList && activeList.length > 0 ? activeList : stocksData;
  const isPhone = useMediaQuery("(max-width: 768px)");

  const greetingDate = "Thursday, April 9, 2026";

  return (
    <section id="dashboard" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>Good morning, Noland</h2>
          <p>{greetingDate}</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search stocks, metrics..."
              aria-label="Search stocks and metrics"
            />
          </div>
          <div className="header-icons">
            <button className="header-icon" aria-label="Notifications">
              <i className="fas fa-bell"></i>
              <span className="notification-dot"></span>
            </button>
            <button className="header-icon" aria-label="Settings">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
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
            <span>+$127,450 (+5.44%) today</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Daily P&amp;L</h4>
            <i className="fas fa-chart-line"></i>
          </div>
          <div
            className="stat-value"
            style={{ color: "var(--accent-emerald)" }}
          >
            +$12,340
          </div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>+0.5% vs S&amp;P 500</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Active Positions</h4>
            <i className="fas fa-layer-group"></i>
          </div>
          <div className="stat-value">24</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>+2 new this week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Avg PEM Score</h4>
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-value">72.4</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>+3.2 vs last month</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Portfolio Performance</h3>
            <div className="chart-tabs">
              {["1D", "1W", "1M", "3M", "1Y"].map((t) => (
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
            <PortfolioChart />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h3>Sector Allocation</h3>
          </div>
          <div className="chart-container allocation">
            <AllocationChart />
          </div>
        </div>
      </div>

      <div className="holdings-card">
        <div className="table-header">
          <h3>Top Holdings</h3>
          <div className="table-actions">
            <button className="table-btn">Export</button>
            <button className="table-btn primary">View All</button>
          </div>
        </div>

        {isPhone ? (
          /* ── Card list for phones ── */
          <div className="holdings-cards">
            {list.map((stock) => {
              const value = formatCurrency(stock.price * stock.shares);
              const pemClass = getPemClass(stock.pem);
              const chClass = getChangeClass(stock.change);
              const chSign = getChangeSign(stock.change);
              return (
                <div
                  key={stock.symbol}
                  className="holding-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenModal(stock.symbol)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && onOpenModal(stock.symbol)
                  }
                >
                  <div className="holding-card-top">
                    <div className="stock-info">
                      <div className="stock-logo">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div className="stock-details">
                        <h4>{stock.symbol}</h4>
                        <span>{stock.name}</span>
                      </div>
                    </div>
                    <div className={`pem-score ${pemClass}`}>{stock.pem}</div>
                  </div>

                  <div className="holding-card-grid">
                    <div className="hc-item">
                      <label>Price</label>
                      <span>${stock.price.toFixed(2)}</span>
                    </div>
                    <div className="hc-item">
                      <label>Change</label>
                      <span className={`price-change ${chClass}`}>
                        {chSign}
                        {stock.change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="hc-item">
                      <label>Shares</label>
                      <span>{stock.shares}</span>
                    </div>
                    <div className="hc-item">
                      <label>Value</label>
                      <span>{value}</span>
                    </div>
                  </div>

                  <div className="holding-card-trend">
                    <div className="trend-bar">
                      <div
                        className="trend-bar-fill"
                        style={{ width: `${stock.pem}%` }}
                      ></div>
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Table for tablet and up ── */
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Shares</th>
                  <th>Value</th>
                  <th>PEM Score</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {list.map((stock) => {
                  const value = formatCurrency(stock.price * stock.shares);
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
                      <td>{stock.shares}</td>
                      <td>{value}</td>
                      <td>
                        <div className={`pem-score ${pemClass}`}>
                          {stock.pem}
                        </div>
                      </td>
                      <td>
                        <div className="trend-bar">
                          <div
                            className="trend-bar-fill"
                            style={{ width: `${stock.pem}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
