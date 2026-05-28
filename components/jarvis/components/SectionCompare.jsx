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

function CompareCardStatic({
  stock,
  isWinner,
  scores,
  categoryWinners,
  color,
}) {
  const pemColor =
    stock.pem >= 75
      ? "var(--accent-emerald)"
      : stock.pem >= 60
        ? "var(--accent-amber)"
        : "var(--accent-rose)";
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
          <div className="value" style={{ fontSize: "0.9em" }}>
            {stock.sector}
          </div>
        </div>
      </div>
      <div className="compare-pem-bar">
        <div className="compare-pem-header">
          <span>PEM Score</span>
          <span className="score" style={{ color: pemColor }}>
            {stock.pem}
          </span>
        </div>
        <div className="compare-pem-track">
          <div
            className="compare-pem-fill"
            style={{ width: `${stock.pem}%`, background: pemColor }}
          ></div>
        </div>
      </div>
      <div
        className="compare-metrics"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {["growth", "momentum", "quality"].map((m) => (
          <div
            key={m}
            className="compare-metric"
            style={{ textAlign: "center" }}
          >
            <label style={{ textTransform: "capitalize" }}>{m}</label>
            <div
              className="value"
              style={{
                color:
                  categoryWinners[m] === stock.symbol
                    ? "var(--accent-emerald)"
                    : "inherit",
              }}
            >
              {scores[m]}{" "}
              {categoryWinners[m] === stock.symbol && (
                <i
                  className="fas fa-trophy winner-trophy"
                  style={{ fontSize: "0.7em" }}
                ></i>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareCardApi({ stock, isWinner }) {
  const a = stock._api;
  const pemColor =
    stock.pem >= 75
      ? "var(--accent-emerald)"
      : stock.pem >= 60
        ? "var(--accent-amber)"
        : "var(--accent-rose)";
  const pemClass = getPemClass(stock.pem);
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
      <div className="compare-metrics">
        <div className="compare-metric">
          <label>Market Cap</label>
          <div className="value">{stock.marketCap}</div>
        </div>
        <div className="compare-metric">
          <label>P/E Ratio</label>
          <div className="value">{stock.pe.toFixed(1)}</div>
        </div>
        <div className="compare-metric">
          <label>EPS</label>
          <div className="value">${stock.eps.toFixed(2)}</div>
        </div>
        <div className="compare-metric">
          <label>Fwd P/E</label>
          <div className="value">{a.forwardPE.toFixed(1)}</div>
        </div>
        <div className="compare-metric">
          <label>Beta</label>
          <div className="value">{a.beta.toFixed(2)}</div>
        </div>
        <div className="compare-metric">
          <label>Div Yield</label>
          <div className="value">{(a.dividendYield * 100).toFixed(2)}%</div>
        </div>
        <div className="compare-metric">
          <label>52W High</label>
          <div className="value">${a.week52High.toFixed(2)}</div>
        </div>
        <div className="compare-metric">
          <label>52W Low</label>
          <div className="value">${a.week52Low.toFixed(2)}</div>
        </div>
        <div className="compare-metric">
          <label>ROE</label>
          <div className="value">{(a.roe * 100).toFixed(1)}%</div>
        </div>
        <div className="compare-metric">
          <label>Profit Margin</label>
          <div className="value">{(a.profitMargin * 100).toFixed(1)}%</div>
        </div>
        <div className="compare-metric">
          <label>Rev Growth</label>
          <div className="value">{(a.revenueGrowth * 100).toFixed(1)}%</div>
        </div>
        <div className="compare-metric">
          <label>YTD Return</label>
          <div
            className="value"
            style={{
              color:
                a.ytdReturn >= 0
                  ? "var(--accent-emerald)"
                  : "var(--accent-rose)",
            }}
          >
            {a.ytdReturn >= 0 ? "+" : ""}
            {a.ytdReturn.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="compare-pem-bar">
        <div className="compare-pem-header">
          <span>PEM Score</span>
          <span className="score" style={{ color: pemColor }}>
            {stock.pem}
          </span>
        </div>
        <div className="compare-pem-track">
          <div
            className="compare-pem-fill"
            style={{
              width: `${Math.min(stock.pem, 100)}%`,
              background: pemColor,
            }}
          ></div>
        </div>
      </div>
      <div
        style={{ fontSize: "0.75em", color: "var(--text-muted)", marginTop: 8 }}
      >
        <i className="fas fa-tag" style={{ marginRight: 4 }}></i>
        {stock.sector}
      </div>
    </div>
  );
}

export default function SectionCompare({
  onOpenModal,
  apiStocksData,
  apiDataReady,
}) {
  const [sel1, setSel1] = useState("");
  const [sel2, setSel2] = useState("");
  const [sel3, setSel3] = useState("");

  const sourceList =
    apiDataReady && apiStocksData.length > 0 ? apiStocksData : stocksData;
  const selected = [sel1, sel2, sel3].filter(Boolean);
  const stocks = selected
    .map((sym) => sourceList.find((s) => s.symbol === sym))
    .filter(Boolean);

  const winnerPem =
    stocks.length >= 2
      ? getWinner(Object.fromEntries(stocks.map((s) => [s.symbol, s.pem])))
      : null;
  const winnerStock = stocks.find((s) => s.symbol === winnerPem);
  const scores = selected.map(
    (sym) =>
      stockScores[sym] || {
        growth: 70,
        valuation: 70,
        momentum: 70,
        quality: 70,
        risk: 70,
        dividend: 70,
      },
  );

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

  const [comparisonResult, setComparisonResult] = useState("");
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  useEffect(() => {
    // 1. Filter out empty selections or placeholders
    const selectedStocks = [sel1, sel2, sel3].filter(
      (stock) => stock && stock.trim() !== "" && !stock.includes("Select"),
    );

    // 2. Trigger API call ONLY when 2 or 3 valid stocks are chosen
    if (selectedStocks.length < 2) return;
    const fetchComparison = async () => {
      try {
        setIsLoadingComparison(true);
        setComparisonResult(""); // Clear old result while loading

        // 3. Construct dynamic prompt format
        let prompt = `Compare ${selectedStocks.length === 2 ? "two" : "three"} stocks with full details ${selectedStocks[0]} vs ${selectedStocks[1]}`;
        if (selectedStocks[2]) {
          prompt += ` vs ${selectedStocks[2]}`;
        }

        // 4. Fire the API call
        const response = await sendChatMessage(prompt);
        setComparisonResult(response);
      } catch (error) {
        console.error("Error fetching comparison:", error);
        setComparisonResult(
          "Unable to generate stock comparison at this time.",
        );
      } finally {
        setIsLoadingComparison(false);
      }
    };

    fetchComparison();
  }, [sel1, sel2, sel3]);

  return (
    <section id="compare" className="section active">
      <div className="header">
        <div className="header-left">
          <h2>Smart Compare</h2>
          <p>Select up to 3 stocks to compare with AI-powered insights</p>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.85em", color: "var(--text-muted)" }}>
            Select stocks to compare:
          </span>
          <select
            className="compare-select"
            value={sel1}
            onChange={(e) => setSel1(e.target.value)}
          >
            {mkOptions("Select Stock 1")}
          </select>
          <select
            className="compare-select"
            value={sel2}
            onChange={(e) => setSel2(e.target.value)}
          >
            {mkOptions("Select Stock 2")}
          </select>
          <select
            className="compare-select"
            value={sel3}
            onChange={(e) => setSel3(e.target.value)}
          >
            {mkOptions("Select Stock 3 (Optional)")}
          </select>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn btn-secondary" onClick={reset}>
              <i className="fas fa-refresh"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>
          <i
            className="fas fa-bolt"
            style={{ color: "var(--accent-amber)", marginRight: 8 }}
          ></i>{" "}
          Quick Comparisons
        </h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            className="btn btn-secondary"
            onClick={() => loadPreset("tech")}
          >
            <i className="fas fa-microchip"></i> Tech Giants
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => loadPreset("cloud")}
          >
            <i className="fas fa-cloud"></i> Cloud Leaders
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => loadPreset("value")}
          >
            <i className="fas fa-tag"></i> Value vs Growth
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => loadPreset("chips")}
          >
            <i className="fas fa-memory"></i> Chip Wars
          </button>
        </div>
      </div>

      {stocks.length < 2 ? (
        <div
          className="chart-card"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <i
            className="fas fa-balance-scale"
            style={{
              fontSize: "4em",
              color: "var(--text-muted)",
              marginBottom: 20,
            }}
          ></i>
          <h3 style={{ color: "var(--text-muted)", marginBottom: 8 }}>
            {selected.length === 0
              ? "Select stocks to compare"
              : "Select at least 2 stocks to compare"}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85em" }}>
            Choose from the dropdowns above or use a quick comparison preset
          </p>
        </div>
      ) : (
        <>
          {/* AI Verdict */}
          <div className="chart-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>
              <i
                className="fas fa-robot"
                style={{ color: "var(--accent-cyan)", marginRight: 8 }}
              ></i>{" "}
              AI Analysis
            </h3>
            <div className="ai-insight-box">
              <div className="ai-badge">
                <i className="fas fa-brain"></i> Jarvis AI
              </div>
              {/* Loading and Results Container */}
              {(isLoadingComparison || comparisonResult) &&
                (isLoadingComparison ? (
                  <div style={{ opacity: 0.6, fontStyle: "italic" }}>
                    <i
                      className="fas fa-spinner fa-spin"
                      style={{ marginRight: 8 }}
                    ></i>
                    Analyzing...
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: "0.95em",
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {comparisonResult.includes(
                      "I currently do not have access",
                    ) ? (
                      <p
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
                      comparisonResult
                    )}
                  </p>
                ))}
            </div>
          </div>

          {/* Stock Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${stocks.length}, 1fr)`,
              gap: 20,
              marginBottom: 24,
            }}
          >
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
                  color={COLORS[i]}
                />
              ),
            )}
          </div>

          {/* Factor Comparison */}
          <div className="category-compare">
            <h3>
              <i
                className="fas fa-chart-bar"
                style={{ color: "var(--accent-blue)", marginRight: 8 }}
              ></i>{" "}
              Factor Comparison
            </h3>
            {METRICS.map((metric) => {
              const vals = {};
              selected.forEach((s, i) => {
                vals[s] = scores[i][metric];
              });
              const maxVal = Math.max(...Object.values(vals));
              return (
                <div key={metric} className="category-row">
                  <div className="category-name">{METRIC_LABELS[metric]}</div>
                  <div className="category-bars">
                    {selected.map((sym, i) => {
                      const width = (vals[sym] / maxVal) * 100;
                      const isWinner = sym === getWinner(vals);
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

          {/* Key Insights */}
          <div className="chart-card">
            <h3 style={{ marginBottom: 16 }}>
              <i
                className="fas fa-lightbulb"
                style={{ color: "var(--accent-amber)", marginRight: 8 }}
              ></i>{" "}
              Key Insights
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
              }}
            >
              {generateInsights(stocks, scores).map((insight, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-tertiary)",
                    padding: 16,
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <i
                      className={`fas ${insight.icon}`}
                      style={{ color: insight.color }}
                    ></i>
                    <span style={{ fontWeight: 600, fontSize: "0.85em" }}>
                      {insight.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8em",
                      color: "var(--text-secondary)",
                      margin: 0,
                    }}
                  >
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
