import {
  getPemClass,
  getChangeClass,
  getChangeSign,
} from "../utils/helpers.js";

const growthVal = Math.floor(Math.random() * 20) + 70;
const valuationVal = Math.floor(Math.random() * 20) + 60;
const momentumVal = Math.floor(Math.random() * 30) + 60;

function ModalBodyStatic({ stock }) {
  const pemClass = getPemClass(stock.pem);
  const changeClass = getChangeClass(stock.change);
  const changeSign = getChangeSign(stock.change);
  const growth = growthVal;
  const valuation = valuationVal;
  const momentum = momentumVal;

  return (
    <>
      <div className="stock-header">
        <div className="stock-header-logo">{stock.symbol.slice(0, 2)}</div>
        <div className="stock-header-info">
          <h2>{stock.symbol}</h2>
          <p>
            {stock.sector} • {stock.marketCap} Market Cap
          </p>
        </div>
        <div className="stock-price-info">
          <div className="price">${stock.price.toFixed(2)}</div>
          <div className={`change ${changeClass}`}>
            {changeSign}
            {stock.change.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <label>P/E Ratio</label>
          <div className="value">{stock.pe.toFixed(1)}</div>
        </div>
        <div className="metric-card">
          <label>EPS</label>
          <div className="value">${stock.eps.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <label>PEM Score</label>
          <div className="value">
            <div
              className={`pem-score ${pemClass}`}
              style={{
                display: "inline-block",
                width: "auto",
                height: "auto",
                padding: "4px 12px",
              }}
            >
              {stock.pem}
            </div>
          </div>
        </div>
        <div className="metric-card">
          <label>Shares Owned</label>
          <div className="value">{stock.shares}</div>
        </div>
      </div>

      <div className="analysis-section">
        <h3>
          <i
            className="fas fa-robot"
            style={{ color: "var(--accent-cyan)" }}
          ></i>{" "}
          AI Analysis
        </h3>
        <div className="ai-insight-box">
          <div className="ai-badge">
            <i className="fas fa-robot"></i> Jarvis AI
          </div>
          <p>{stock.description}</p>
          <p style={{ marginTop: 12 }}>
            <strong>AI Insight:</strong> {stock.name} demonstrates{" "}
            {stock.pem >= 75 ? "strong" : stock.pem >= 60 ? "moderate" : "weak"}{" "}
            fundamentals with a PEM score of {stock.pem}.{" "}
            {stock.change >= 2
              ? "Recent momentum is positive with strong buying interest."
              : stock.change >= 0
                ? "Trading steady with neutral momentum."
                : "Price pressure detected - consider monitoring for entry points."}
          </p>
        </div>
      </div>

      <div className="analysis-section">
        <h3>Score Breakdown</h3>
        <div className="pem-detail-grid">
          <div className="pem-factor">
            <div className="pem-factor-header">
              <h4>Growth</h4>
            </div>
            <div
              className="pem-factor-value"
              style={{ color: "var(--accent-emerald)" }}
            >
              {growth}
            </div>
          </div>
          <div className="pem-factor">
            <div className="pem-factor-header">
              <h4>Valuation</h4>
            </div>
            <div
              className="pem-factor-value"
              style={{ color: "var(--accent-amber)" }}
            >
              {valuation}
            </div>
          </div>
          <div className="pem-factor">
            <div className="pem-factor-header">
              <h4>Momentum</h4>
            </div>
            <div
              className="pem-factor-value"
              style={{
                color:
                  stock.change >= 0
                    ? "var(--accent-emerald)"
                    : "var(--accent-rose)",
              }}
            >
              {momentum}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Add to Portfolio
        </button>
        <button className="btn btn-secondary">
          <i className="fas fa-bell"></i> Set Alert
        </button>
        <button className="btn btn-secondary">
          <i className="fas fa-chart-line"></i> Full Analysis
        </button>
      </div>
    </>
  );
}

function ModalBodyApi({ stock }) {
  const a = stock._api;
  const pemClass = getPemClass(stock.pem);
  const changeClass = getChangeClass(stock.change);
  const changeSign = getChangeSign(stock.change);

  return (
    <>
      <div className="stock-header">
        <div className="stock-header-logo">{stock.symbol.slice(0, 2)}</div>
        <div className="stock-header-info">
          <h2>{stock.symbol}</h2>
          <p>
            {stock.sector} • {stock.marketCap} Market Cap
          </p>
        </div>
        <div className="stock-price-info">
          <div className="price">${stock.price.toFixed(2)}</div>
          <div className={`change ${changeClass}`}>
            {changeSign}
            {stock.change.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <label>P/E Ratio</label>
          <div className="value">{stock.pe.toFixed(1)}</div>
        </div>
        <div className="metric-card">
          <label>EPS</label>
          <div className="value">${stock.eps.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <label>PEM Score</label>
          <div className="value">
            <div
              className={`pem-score ${pemClass}`}
              style={{
                display: "inline-block",
                width: "auto",
                height: "auto",
                padding: "4px 12px",
              }}
            >
              {stock.pem}
            </div>
          </div>
        </div>
        <div className="metric-card">
          <label>Market Cap</label>
          <div className="value">{stock.marketCap}</div>
        </div>
        <div className="metric-card">
          <label>Forward P/E</label>
          <div className="value">{a.forwardPE.toFixed(1)}</div>
        </div>
        <div className="metric-card">
          <label>Beta</label>
          <div className="value">{a.beta.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <label>52W High</label>
          <div className="value">${a.week52High.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <label>52W Low</label>
          <div className="value">${a.week52Low.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <label>ROE</label>
          <div className="value">{(a.roe * 100).toFixed(1)}%</div>
        </div>
        <div className="metric-card">
          <label>Profit Margin</label>
          <div className="value">{(a.profitMargin * 100).toFixed(1)}%</div>
        </div>
        <div className="metric-card">
          <label>Div Yield</label>
          <div className="value">{(a.dividendYield * 100).toFixed(2)}%</div>
        </div>
        <div className="metric-card">
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

      <div className="analysis-section">
        <h3>
          <i
            className="fas fa-robot"
            style={{ color: "var(--accent-cyan)" }}
          ></i>{" "}
          AI Analysis
        </h3>
        <div className="ai-insight-box">
          <div className="ai-badge">
            <i className="fas fa-robot"></i> Jarvis AI
          </div>
          <p>{stock.description}</p>
          <p style={{ marginTop: 12 }}>
            <strong>AI Insight:</strong> {stock.name} demonstrates{" "}
            {stock.pem >= 25
              ? "strong"
              : stock.pem >= 15
                ? "moderate"
                : "developing"}{" "}
            fundamentals with PEM {stock.pem}.{" "}
            {stock.change >= 2
              ? "Recent momentum is positive."
              : stock.change >= 0
                ? "Trading steady."
                : "Price pressure detected — monitor for entry points."}{" "}
            YTD return of {a.ytdReturn >= 0 ? "+" : ""}
            {a.ytdReturn.toFixed(2)}%.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Add to Portfolio
        </button>
        <button className="btn btn-secondary">
          <i className="fas fa-bell"></i> Set Alert
        </button>
        <button className="btn btn-secondary">
          <i className="fas fa-chart-line"></i> Full Analysis
        </button>
      </div>
    </>
  );
}

export default function StockModal({ stock, onClose }) {
  if (!stock) return null;

  return (
    <div
      className={`modal-overlay${stock ? " active" : ""}`}
      id="stockModal"
      onClick={(e) => {
        if (e.target.classList.contains("modal-overlay")) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 id="modalStockName">
            {stock.name} ({stock.symbol})
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body" id="modalBody">
          {stock._api ? (
            <ModalBodyApi stock={stock} />
          ) : (
            <ModalBodyStatic stock={stock} />
          )}
        </div>
      </div>
    </div>
  );
}
