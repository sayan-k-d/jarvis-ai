import { useEffect, useState } from "react";
import { stocksData, stockScores } from "../data/staticData.js";
import {
  getPemClass,
  getChangeClass,
  getChangeSign,
  getWinner,
  generateVerdict,
  generateInsights,
} from "../utils/helpers.js";
import { sendChatMessage } from "../services/aiServices.js";

const COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b"];
const METRICS = [
  "growth",
  "valuation",
  "momentum",
  "quality",
  "risk",
  "dividend",
];
const METRIC_LABELS = {
  growth: "Growth",
  valuation: "Valuation",
  momentum: "Momentum",
  quality: "Quality",
  risk: "Risk",
  dividend: "Dividend",
};

const DEFAULT_SCORES = {
  growth: 70,
  valuation: 70,
  momentum: 70,
  quality: 70,
  risk: 70,
  dividend: 70,
};

const NO_ACCESS = "I currently do not have access";

function useMediaQuery(query) {
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

function pemColorFor(pem) {
  return pem >= 75
    ? "var(--accent-emerald)"
    : pem >= 60
      ? "var(--accent-amber)"
      : "var(--accent-rose)";
}

/* ── Shared card chrome ───────────────────────────────────── */

function CompareCardShell({ stock, isWinner, children }) {
  const chClass = getChangeClass(stock.change);
  const chSign = getChangeSign(stock.change);
  return (
    <div className={`compare-card${isWinner ? " winner" : ""}`}>
      <div className="compare-header">
        <div className="compare-logo">{stock.symbol.slice(0, 2)}</div>
        <div className="compare-stock-info">
          <h3>{stock.symbol}</h3>
          <span>{stock.name}</span>
        </div>
        <div className="compare-price">
          <div className="price">${stock.price.toFixed(2)}</div>
          <div className={`change ${chClass}`}>
            {chSign}
            {stock.change.toFixed(2)}%
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function PemBar({ pem }) {
  const color = pemColorFor(pem);
  return (
    <div className="compare-pem-bar">
      <div className="compare-pem-header">
        <span>PEM Score</span>
        <span className="score" style={{ color }}>
          {pem}
        </span>
      </div>
      <div className="compare-pem-track">
        <div
          className="compare-pem-fill"
          style={{ width: `${Math.min(pem, 100)}%`, background: color }}
        ></div>
      </div>
    </div>
  );
}

function CompareCardStatic({ stock, isWinner, scores, categoryWinners }) {
  return (
    <CompareCardShell stock={stock} isWinner={isWinner}>
      <div className="compare-metrics">
        <div className="compare-metric">
          <label>Market Cap</label>
          <div className="value">{stock.marketCap}</div>
        </div>
        <div className="compare-metric">
          <label>P/E Ratio</label>
          <div className="value">
            {stock.pe.toFixed(1)}
            {categoryWinners.valuation === stock.symbol && (
              <span className="winner-badge">Best</span>
            )}
          </div>
        </div>
        <div className="compare-metric">
          <label>EPS</label>
          <div className="value">
            ${stock.eps.toFixed(2)}
            {categoryWinners.growth === stock.symbol && (
              <span className="winner-badge">Best</span>
            )}
          </div>
        </div>
        <div className="compare-metric">
          <label>Sector</label>
          <div className="value compare-value-sm">{stock.sector}</div>
        </div>
      </div>

      <PemBar pem={stock.pem} />

      <div className="compare-metrics compare-metrics-triple">
        {["growth", "momentum", "quality"].map((m) => {
          const won = categoryWinners[m] === stock.symbol;
          return (
            <div key={m} className="compare-metric compare-metric-centered">
              <label>{METRIC_LABELS[m]}</label>
              <div
                className="value"
                style={{ color: won ? "var(--accent-emerald)" : "inherit" }}
              >
                {scores[m]}{" "}
                {won && (
                  <i className="fas fa-trophy winner-trophy compare-trophy"></i>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </CompareCardShell>
  );
}

function CompareCardApi({ stock, isWinner }) {
  const a = stock._api;
  const apiMetrics = [
    { label: "Market Cap", value: stock.marketCap },
    { label: "P/E Ratio", value: stock.pe.toFixed(1) },
    { label: "EPS", value: `$${stock.eps.toFixed(2)}` },
    { label: "Fwd P/E", value: a.forwardPE.toFixed(1) },
    { label: "Beta", value: a.beta.toFixed(2) },
    { label: "Div Yield", value: `${(a.dividendYield * 100).toFixed(2)}%` },
    { label: "52W High", value: `$${a.week52High.toFixed(2)}` },
    { label: "52W Low", value: `$${a.week52Low.toFixed(2)}` },
    { label: "ROE", value: `${(a.roe * 100).toFixed(1)}%` },
    { label: "Profit Margin", value: `${(a.profitMargin * 100).toFixed(1)}%` },
    { label: "Rev Growth", value: `${(a.revenueGrowth * 100).toFixed(1)}%` },
    {
      label: "YTD Return",
      value: `${a.ytdReturn >= 0 ? "+" : ""}${a.ytdReturn.toFixed(2)}%`,
      color: a.ytdReturn >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)",
    },
  ];

  return (
    <CompareCardShell stock={stock} isWinner={isWinner}>
      <div className="compare-metrics">
        {apiMetrics.map((m) => (
          <div key={m.label} className="compare-metric">
            <label>{m.label}</label>
            <div
              className="value"
              style={m.color ? { color: m.color } : undefined}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <PemBar pem={stock.pem} />

      <div className="compare-sector">
        <i className="fas fa-tag"></i>
        {stock.sector}
      </div>
    </CompareCardShell>
  );
}

/* ── Main section ─────────────────────────────────────────── */

export default function SectionCompare({
  onOpenModal,
  apiStocksData,
  apiDataReady,
}) {
  const [sel1, setSel1] = useState("");
  const [sel2, setSel2] = useState("");
  const [sel3, setSel3] = useState("");
  const [comparisonResult, setComparisonResult] = useState("");
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sourceList =
    apiDataReady && apiStocksData?.length > 0 ? apiStocksData : stocksData;
  const selected = [sel1, sel2, sel3].filter(Boolean);
  const stocks = selected
    .map((sym) => sourceList.find((s) => s.symbol === sym))
    .filter(Boolean);

  const winnerPem =
    stocks.length >= 2
      ? getWinner(Object.fromEntries(stocks.map((s) => [s.symbol, s.pem])))
      : null;
  const winnerStock = stocks.find((s) => s.symbol === winnerPem);
  const scores = selected.map((sym) => stockScores[sym] || DEFAULT_SCORES);

  const categoryWinners = {};
  METRICS.forEach((m) => {
    const vals = {};
    selected.forEach((s, idx) => {
      vals[s] = scores[idx][m];
    });
    categoryWinners[m] = getWinner(vals);
  });

  const loadPreset = (preset) => {
    const presets = {
      tech: ["AAPL", "MSFT", "GOOGL"],
      cloud: ["MSFT", "AMZN", "GOOGL"],
      value: ["AAPL", "JNJ", "JPM"],
      chips: ["NVDA", "AAPL", "MSFT"],
    };
    const [a, b, c] = presets[preset] || presets.tech;
    setSel1(a || "");
    setSel2(b || "");
    setSel3(c || "");
  };

  const reset = () => {
    setSel1("");
    setSel2("");
    setSel3("");
    setComparisonResult("");
    setIsLoadingComparison(false);
  };

  const mkOptions = (placeholder) => (
    <>
      <option value="">{placeholder}</option>
      {sourceList.map((s) => (
        <option key={s.symbol} value={s.symbol}>
          {s.symbol} - {s.name}
        </option>
      ))}
    </>
  );

  useEffect(() => {
    const selectedStocks = [sel1, sel2, sel3].filter(
      (stock) => stock && stock.trim() !== "" && !stock.includes("Select"),
    );
    if (selectedStocks.length < 2) return;

    let cancelled = false;

    const fetchComparison = async () => {
      try {
        setIsLoadingComparison(true);
        setComparisonResult("");

        let prompt = `Compare ${
          selectedStocks.length === 2 ? "two" : "three"
        } stocks with full details ${selectedStocks[0]} vs ${selectedStocks[1]}`;
        if (selectedStocks[2]) prompt += ` vs ${selectedStocks[2]}`;

        const response = await sendChatMessage(prompt);
        if (!cancelled) setComparisonResult(response);
      } catch (error) {
        console.error("Error fetching comparison:", error);
        if (!cancelled) {
          setComparisonResult(
            "Unable to generate stock comparison at this time.",
          );
        }
      } finally {
        if (!cancelled) setIsLoadingComparison(false);
      }
    };

    fetchComparison();
    return () => {
      cancelled = true;
    };
  }, [sel1, sel2, sel3]);

  const presets = [
    { key: "tech", icon: "fa-microchip", label: "Tech Giants" },
    { key: "cloud", icon: "fa-cloud", label: "Cloud Leaders" },
    { key: "value", icon: "fa-tag", label: "Value vs Growth" },
    { key: "chips", icon: "fa-memory", label: "Chip Wars" },
  ];

  return (
    <section id="compare" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>Smart Compare</h2>
          <p>Select up to 3 stocks to compare with AI-powered insights</p>
        </div>
      </div>

      {/* Selector bar */}
      <div className="chart-card compare-selector-card">
        <span className="compare-selector-label">
          Select stocks to compare:
        </span>
        <div className="compare-selector-row">
          <select
            className="compare-select"
            value={sel1}
            onChange={(e) => setSel1(e.target.value)}
            aria-label="Stock 1"
          >
            {mkOptions("Select Stock 1")}
          </select>
          <select
            className="compare-select"
            value={sel2}
            onChange={(e) => setSel2(e.target.value)}
            aria-label="Stock 2"
          >
            {mkOptions("Select Stock 2")}
          </select>
          <select
            className="compare-select"
            value={sel3}
            onChange={(e) => setSel3(e.target.value)}
            aria-label="Stock 3, optional"
          >
            {mkOptions("Select Stock 3 (Optional)")}
          </select>
          <button className="btn btn-secondary compare-reset" onClick={reset}>
            <i className="fas fa-refresh"></i> <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="chart-card compare-presets-card">
        <h3 className="insight-title">
          <i
            className="fas fa-bolt"
            style={{ color: "var(--accent-amber)" }}
          ></i>
          Quick Comparisons
        </h3>
        <div className="compare-presets">
          {presets.map((p) => (
            <button
              key={p.key}
              className="btn btn-secondary"
              onClick={() => loadPreset(p.key)}
            >
              <i className={`fas ${p.icon}`}></i> <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {stocks.length < 2 ? (
        <div className="chart-card compare-empty">
          <i className="fas fa-balance-scale"></i>
          <h3>
            {selected.length === 0
              ? "Select stocks to compare"
              : "Select at least 2 stocks to compare"}
          </h3>
          <p>
            Choose from the dropdowns above or use a quick comparison preset
          </p>
        </div>
      ) : (
        <>
          {/* AI Verdict */}
          <div className="chart-card compare-ai-card">
            <h3 className="insight-title">
              <i
                className="fas fa-robot"
                style={{ color: "var(--accent-cyan)" }}
              ></i>
              AI Analysis
            </h3>
            <div className="ai-insight-box">
              <div className="ai-badge">
                <i className="fas fa-brain"></i> Jarvis AI
              </div>

              {isLoadingComparison ? (
                <div className="compare-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  Analyzing...
                </div>
              ) : comparisonResult ? (
                comparisonResult.includes(NO_ACCESS) ? (
                  <div
                    className="compare-verdict"
                    dangerouslySetInnerHTML={{
                      __html: generateVerdict(
                        stocks,
                        winnerStock,
                        scores,
                        stockScores,
                      ),
                    }}
                  />
                ) : (
                  <div className="compare-verdict compare-verdict-pre">
                    {comparisonResult}
                  </div>
                )
              ) : null}
            </div>
          </div>

          {/* Stock cards — column count driven by CSS, not inline style */}
          <div className="compare-grid" data-count={stocks.length}>
            {stocks.map((stock, i) =>
              apiDataReady && stock._api ? (
                <CompareCardApi
                  key={stock.symbol}
                  stock={stock}
                  isWinner={stock.symbol === winnerPem}
                />
              ) : (
                <CompareCardStatic
                  key={stock.symbol}
                  stock={stock}
                  isWinner={stock.symbol === winnerPem}
                  scores={scores[i]}
                  categoryWinners={categoryWinners}
                />
              ),
            )}
          </div>

          {/* Factor comparison */}
          <div className="category-compare">
            <h3>
              <i
                className="fas fa-chart-bar section-title-icon"
                style={{ color: "var(--accent-blue)" }}
              ></i>
              Factor Comparison
            </h3>
            {METRICS.map((metric) => {
              const vals = {};
              selected.forEach((s, i) => {
                vals[s] = scores[i][metric];
              });
              const maxVal = Math.max(...Object.values(vals));
              const metricWinner = getWinner(vals);
              return (
                <div key={metric} className="category-row">
                  <div className="category-name">{METRIC_LABELS[metric]}</div>
                  <div className="category-bars">
                    {selected.map((sym, i) => {
                      const width = (vals[sym] / maxVal) * 100;
                      const isWinner = sym === metricWinner;
                      return (
                        <div key={sym} className="category-bar-item">
                          <div className="category-bar-track">
                            <div
                              className="category-bar-fill"
                              style={{
                                width: `${width}%`,
                                background: isWinner
                                  ? "var(--accent-emerald)"
                                  : COLORS[i],
                              }}
                            >
                              {vals[sym]}
                            </div>
                          </div>
                          <div className="stock-label">{sym}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key insights */}
          <div className="chart-card">
            <h3 className="insight-title">
              <i
                className="fas fa-lightbulb"
                style={{ color: "var(--accent-amber)" }}
              ></i>
              Key Insights
            </h3>
            <div className="compare-insights">
              {generateInsights(stocks, scores).map((insight, i) => (
                <div key={i} className="compare-insight">
                  <div className="compare-insight-head">
                    <i
                      className={`fas ${insight.icon}`}
                      style={{ color: insight.color }}
                    ></i>
                    <span>{insight.title}</span>
                  </div>
                  <p>{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
