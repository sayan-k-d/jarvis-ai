// components/ResponsiveStockTable.jsx
import { useEffect, useState } from "react";
import {
  getPemClass,
  getChangeClass,
  getChangeSign,
} from "../utils/helpers.js";

function useIsPhone() {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = (e) => setIsPhone(e.matches);
    setIsPhone(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isPhone;
}

/**
 * columns: [{ key, label, render(stock), mobile?: boolean }]
 *   mobile: false  → omit from the phone card
 * action: optional (stock) => ReactNode, rendered as the card footer button
 */
export default function ResponsiveStockTable({
  data,
  columns,
  onRowClick,
  action,
  minWidth = 760,
}) {
  const isPhone = useIsPhone();

  if (isPhone) {
    const mobileCols = columns.filter(
      (c) => c.mobile !== false && c.key !== "stock" && c.key !== "pem",
    );

    return (
      <div className="holdings-cards">
        {data.map((stock) => {
          const chClass = getChangeClass(stock.change);
          const chSign = getChangeSign(stock.change);
          return (
            <div
              key={stock.symbol}
              className="holding-card"
              role={onRowClick ? "button" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={() => onRowClick?.(stock.symbol)}
              onKeyDown={(e) => e.key === "Enter" && onRowClick?.(stock.symbol)}
            >
              <div className="holding-card-top">
                <div className="stock-info">
                  <div className="stock-logo">{stock.symbol.slice(0, 2)}</div>
                  <div className="stock-details">
                    <h4>{stock.symbol}</h4>
                    <span>{stock.name}</span>
                  </div>
                </div>
                <div className="holding-card-headline">
                  <div className="hc-price">${stock.price.toFixed(2)}</div>
                  <div className={`price-change ${chClass}`}>
                    {chSign}
                    {stock.change.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="holding-card-grid">
                {mobileCols.map((col) => (
                  <div className="hc-item" key={col.key}>
                    <label>{col.label}</label>
                    <span>{col.render(stock)}</span>
                  </div>
                ))}
              </div>

              <div className="holding-card-footer">
                <div className={`pem-score ${getPemClass(stock.pem)}`}>
                  {stock.pem}
                </div>
                <div className="trend-bar">
                  <div
                    className="trend-bar-fill"
                    style={{ width: `${stock.pem}%` }}
                  />
                </div>
                {action ? (
                  action(stock)
                ) : (
                  <i className="fas fa-chevron-right hc-chevron"></i>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            {action && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((stock) => (
            <tr
              key={stock.symbol}
              onClick={() => onRowClick?.(stock.symbol)}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
            >
              {columns.map((c) => (
                <td key={c.key}>{c.render(stock)}</td>
              ))}
              {action && (
                <td onClick={(e) => e.stopPropagation()}>{action(stock)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
