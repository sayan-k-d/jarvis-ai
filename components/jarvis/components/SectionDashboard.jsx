import { useEffect, useRef } from "react";
import { stocksData } from "../data/staticData.js";
import {
  getPemClass,
  getChangeClass,
  getChangeSign,
  formatCurrency,
} from "../utils/helpers.js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function PortfolioChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    let myPortfolioChart = null;

    if (ctx) {
      myPortfolioChart = new Chart(ctx, {
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
              pointRadius: 0,
              pointHoverRadius: 6,
            },
            {
              label: "S&P 500",
              data: [
                2450000, 2452000, 2455000, 2450000, 2458000, 2460000, 2463000,
                2461000,
              ],
              borderColor: "#64748b",
              borderDash: [5, 5],
              fill: false,
              tension: 0.4,
              pointRadius: 0,
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
              labels: { color: "#94a3b8", boxWidth: 12, padding: 20 },
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
                callback: (v) => "$" + (v / 1000000).toFixed(2) + "M",
              },
            },
          },
        },
      });
    }

    // Clean up chart instance when component unmounts
    return () => {
      if (myPortfolioChart) {
        myPortfolioChart.destroy();
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export function AllocationChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    let myAllocationChart = null;

    if (ctx) {
      myAllocationChart = new Chart(ctx, {
        type: "doughnut", // Replaces Highcharts pie with an inner cutout
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
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%", // Gives it the exact donut ring appearance
          plugins: {
            legend: {
              display: true,
              position: "right",
              labels: {
                color: "#94a3b8",
                boxWidth: 12,
                padding: 15,
                font: { family: "Inter, sans-serif" },
              },
            },
          },
        },
      });
    }

    return () => {
      if (myAllocationChart) {
        myAllocationChart.destroy();
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default function SectionDashboard({ onOpenModal }) {
  return (
    <section id="dashboard" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>Good morning, Noland</h2>
          <p>Thursday, April 9, 2026</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search stocks, metrics..." />
          </div>
          <div className="header-icon">
            <i className="fas fa-bell"></i>
            <span className="notification-dot"></span>
          </div>
          <div className="header-icon">
            <i className="fas fa-cog"></i>
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
            <i className="fas fa-arrow-up"></i>+$127,450 (+5.44%) today
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
            <i className="fas fa-arrow-up"></i>+0.5% vs S&amp;P 500
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Active Positions</h4>
            <i className="fas fa-layer-group"></i>
          </div>
          <div className="stat-value">24</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>+2 new this week
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <h4>Avg PEM Score</h4>
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-value">72.4</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i>+3.2 vs last month
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
          <div className="chart-container">
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
            {stocksData.slice(0, 5).map((stock) => {
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
                    <div className={`pem-score ${pemClass}`}>{stock.pem}</div>
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
    </section>
  );
}
