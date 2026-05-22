import { useEffect, useRef } from "react";
import { stocksData } from "../data/staticData.js";
import {
  getPemClass,
  getChangeClass,
  getChangeSign,
  formatCurrency,
} from "../utils/helpers.js";

function PortfolioChart() {
  const ref = useRef(null);
  useEffect(() => {
    const H = window.Highcharts;
    if (!H || !ref.current) return;
    const chart = H.chart(ref.current, {
      chart: {
        type: "area",
        backgroundColor: "transparent",
        style: { fontFamily: "Inter, sans-serif" },
      },
      title: { text: null },
      credits: { enabled: false },
      legend: {
        itemStyle: { color: "#94a3b8" },
        itemHoverStyle: { color: "#f8fafc" },
      },
      xAxis: {
        categories: ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"],
        labels: { style: { color: "#94a3b8" } },
        gridLineColor: "rgba(148,163,184,0.1)",
        lineColor: "rgba(148,163,184,0.1)",
        tickColor: "rgba(148,163,184,0.1)",
      },
      yAxis: {
        title: { text: null },
        labels: {
          style: { color: "#94a3b8" },
          formatter: function () {
            return "$" + (this.value / 1000000).toFixed(2) + "M";
          },
        },
        gridLineColor: "rgba(148,163,184,0.1)",
      },
      tooltip: {
        backgroundColor: "#1a2332",
        borderColor: "rgba(255,255,255,0.08)",
        style: { color: "#f8fafc" },
        formatter: function () {
          return `<b>${this.series.name}</b><br/>$${(this.y / 1000000).toFixed(3)}M`;
        },
      },
      series: [
        {
          name: "Portfolio",
          data: [
            2450000, 2458000, 2462000, 2455000, 2465000, 2468000, 2472000,
            2473450,
          ],
          color: "#06b6d4",
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "rgba(6,182,212,0.2)"],
              [1, "rgba(6,182,212,0)"],
            ],
          },
          lineWidth: 2,
          marker: { enabled: false, states: { hover: { enabled: true } } },
        },
        {
          name: "S&P 500",
          data: [
            2450000, 2452000, 2455000, 2450000, 2458000, 2460000, 2463000,
            2461000,
          ],
          color: "#64748b",
          dashStyle: "Dash",
          fillColor: "transparent",
          lineWidth: 1.5,
          marker: { enabled: false },
        },
      ],
    });
    return () => {
      try {
        chart.destroy();
      } catch {}
    };
  }, []);
  return <div ref={ref} style={{ height: "100%" }} />;
}

function AllocationChart() {
  const ref = useRef(null);
  useEffect(() => {
    const H = window.Highcharts;
    if (!H || !ref.current) return;
    const chart = H.chart(ref.current, {
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        style: { fontFamily: "Inter, sans-serif" },
      },
      title: { text: null },
      credits: { enabled: false },
      legend: {
        itemStyle: { color: "#94a3b8" },
        itemHoverStyle: { color: "#f8fafc" },
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
      },
      tooltip: {
        backgroundColor: "#1a2332",
        borderColor: "rgba(255,255,255,0.08)",
        style: { color: "#f8fafc" },
      },
      plotOptions: {
        pie: {
          innerSize: "65%",
          dataLabels: { enabled: false },
          showInLegend: true,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "Allocation",
          data: [
            { name: "Technology", y: 42, color: "#06b6d4" },
            { name: "Healthcare", y: 18, color: "#10b981" },
            { name: "Financials", y: 22, color: "#3b82f6" },
            { name: "Consumer", y: 12, color: "#f59e0b" },
            { name: "Other", y: 6, color: "#64748b" },
          ],
        },
      ],
    });
    return () => {
      try {
        chart.destroy();
      } catch {}
    };
  }, []);
  return <div ref={ref} style={{ height: "100%" }} />;
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
