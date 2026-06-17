import React, { useState, useEffect } from "react";

// --- MOCK DATA ---
const STOCK_DATA = {
  AAPL: {
    ticker: "AAPL",
    decision: "BUY",
    price: "$214.94",
    summary:
      "Apple is currently at a critical junction where its legacy hardware dominance is being measured against its ability to lead in the generative AI era. The recent WWDC revealed a shift in momentum...",
    reports: {
      Market: "Trend is upward following WWDC announcements.",
      Fundamentals:
        "Strong balance sheet supports continued buybacks/dividends.",
      Risk: "Regulatory pressures in the EU remain a headwind.",
    },
  },
  GOOGL: {
    ticker: "GOOGL",
    decision: "BUY",
    price: "$176.33",
    summary:
      "Alphabet continues to leverage its search monopoly to fund aggressive AI investments. Cloud segment profitability is a major positive catalyst.",
    reports: {
      Market: "Strong consolidation phase, breaking out to new highs.",
      Fundamentals: "Cloud revenue growth accelerating; margins expanding.",
      Risk: "Antitrust trials remain the primary existential risk.",
    },
  },
  AMZN: {
    ticker: "AMZN",
    decision: "HOLD",
    price: "$183.15",
    summary:
      "AWS growth is stabilizing, but retail margins face pressure from international expansion and fulfillment costs.",
    reports: {
      Market: "Trading in a tight range, waiting for next earnings catalyst.",
      Fundamentals: "AWS run-rate is healthy, advertising revenue growing.",
      Risk: "Consumer spending slowdown could impact core retail.",
    },
  },
  NFLX: {
    ticker: "NFLX",
    decision: "BUY",
    price: "$669.02",
    summary:
      "Password sharing crackdown and ad-tier introduction have provided a massive tailwind to subscriber growth and revenue.",
    reports: {
      Market: "Clear uptrend with strong institutional accumulation.",
      Fundamentals: "Free cash flow generation is at all-time highs.",
      Risk: "Content strike delayed pipeline, which might cause a minor dip in engagement.",
    },
  },
  TSLA: {
    ticker: "TSLA",
    decision: "SELL",
    price: "$178.50",
    summary:
      "Increasing competition in China and aging vehicle lineup are putting heavy pressure on margins. FSD promises remain unfulfilled structurally.",
    reports: {
      Market: "Below 200-day moving average; technical damage is evident.",
      Fundamentals:
        "Operating margins have compressed significantly due to price cuts.",
      Risk: "Key man risk and geopolitical exposure in China.",
    },
  },
};

// --- REUSABLE SVG ICONS ---
const SparkleIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// --- VIEWS ---

const HomeView = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticker = input.trim().toUpperCase();
    if (STOCK_DATA[ticker]) {
      setError("");
      onSearch(ticker);
    } else {
      setError("Please enter one of: AAPL, GOOGL, AMZN, NFLX, TSLA...");
    }
  };

  return (
    <div className="ta-container ta-home">
      <div className="ta-logo-circle">
        <SparkleIcon />
      </div>

      <h1 className="ta-title">What equity would you like to analyze?</h1>

      <form onSubmit={handleSubmit} className="ta-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a NASDAQ-100 ticker (AAPL, MSFT...)"
          className="ta-input"
        />
        <button type="submit" className="ta-submit">
          <ArrowIcon />
        </button>
      </form>

      {error && <p className="ta-error">{error}</p>}

      <p className="ta-hint">
        <small>Not investment advice. For informational use only.</small>
      </p>
    </div>
  );
};

const LoadingView = ({ ticker, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const agents = [
    "Market Analyst",
    "Social Media Analyst",
    "News Analyst",
    "Fundamentals Analyst",
    "Risk Analyst",
  ];

  useEffect(() => {
    const duration = 3000; // 3 second mock load
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="ta-container ta-loading-wrapper">
      <div className="ta-loading-card">
        <h2 className="ta-loading-title">
          <span className="ta-spinner">↻</span>
          Preparing analysis...
        </h2>

        <div className="ta-agent-list">
          {agents.map((agent, idx) => {
            const isDone = progress > (idx + 1) * (100 / agents.length);
            const isCurrent = !isDone && progress > idx * (100 / agents.length);

            let statusClass = "waiting";
            let statusText = "waiting";

            if (isDone) {
              statusClass = "done";
              statusText = "done";
            } else if (isCurrent) {
              statusClass = "pending";
              statusText = "pending";
            }

            return (
              <div key={agent} className="ta-agent-row">
                <span
                  className={`ta-agent-name ${isDone || isCurrent ? "active" : ""}`}
                >
                  {agent}
                </span>
                <span className={`ta-status-badge ${statusClass}`}>
                  {statusText}
                </span>
              </div>
            );
          })}
        </div>

        <div className="ta-progress-bg">
          <div className="ta-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ ticker, onReset }) => {
  const data = STOCK_DATA[ticker];

  return (
    <div className="ta-dashboard">
      {/* LEFT SIDEBAR */}
      <div className="ta-sidebar-left">
        <div className="ta-sidebar-header">
          <SparkleIcon />
          <span>Trading Agents</span>
        </div>
        <div className="ta-sidebar-content">
          <h3 className="ta-section-title">Agent Pipeline</h3>
          <ul className="ta-menu-list">
            {[
              "Market Analyst",
              "Social Media Analyst",
              "News Analyst",
              "Fundamentals Analyst",
              "Risk Analyst",
              "Trader",
              "Portfolio Manager",
            ].map((agent) => (
              <li key={agent} className="ta-menu-item">
                <div className="ta-dot"></div>
                {agent}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="ta-main-area">
        <header className="ta-header-bar">
          <h2 className="ta-header-title">Final Trade Decision: {ticker}</h2>
          <button onClick={onReset} className="ta-btn-outline">
            Analyze Another Stock
          </button>
        </header>

        <main className="ta-content-scroll">
          <div className="ta-report-container">
            {/* Decision Banner */}
            <div className="ta-decision-box">
              <h3 className="ta-decision-label">Final Recommendation</h3>
              <div className="ta-decision-value">
                <span
                  className={`ta-decision-status ${data.decision.toLowerCase()}`}
                >
                  {data.decision}
                </span>
                <span className="ta-decision-price">@ {data.price}</span>
              </div>
            </div>

            {/* Summary */}
            <section className="ta-report-section">
              <h3>1. Executive Summary</h3>
              <div className="ta-report-text">{data.summary}</div>
            </section>

            {/* Breakdown */}
            <section className="ta-report-section">
              <h3>2. Analyst Breakdown</h3>
              <div className="ta-analyst-grid">
                {Object.entries(data.reports).map(([key, value]) => (
                  <div key={key} className="ta-analyst-card">
                    <h4>{key} Analyst:</h4>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function StockAnalysis() {
  const [view, setView] = useState("home"); // 'home', 'loading', 'dashboard'
  const [selectedTicker, setSelectedTicker] = useState(null);

  const handleSearch = (ticker) => {
    setSelectedTicker(ticker);
    setView("loading");
  };

  const handleLoadingComplete = () => {
    setView("dashboard");
  };

  const handleReset = () => {
    setSelectedTicker(null);
    setView("home");
  };

  return (
    <>
      {view === "home" && <HomeView onSearch={handleSearch} />}
      {view === "loading" && (
        <LoadingView
          ticker={selectedTicker}
          onComplete={handleLoadingComplete}
        />
      )}
      {view === "dashboard" && (
        <DashboardView ticker={selectedTicker} onReset={handleReset} />
      )}
    </>
  );
}
