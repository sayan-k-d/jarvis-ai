export function getPemClass(pem) {
  return pem >= 70 ? "pem-high" : pem >= 50 ? "pem-medium" : "pem-low";
}
export function getChangeClass(change) {
  return change >= 0 ? "positive" : "negative";
}
export function getChangeSign(change) {
  return change >= 0 ? "+" : "";
}
export function formatCurrency(num) {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
export function formatMarketCap(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return "N/A";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(0) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(0) + "M";
  return String(n);
}
export function getWinner(values) {
  const max = Math.max(...Object.values(values));
  return Object.keys(values).find((k) => values[k] === max);
}
export function generateVerdict(stocks, winnerStock, scores, stockScores) {
  if (!winnerStock) return "Analyzing...";
  const n = stocks.length;
  let verdict = "";
  if (n === 2) {
    const s1 = stocks[0],
      s2 = stocks[1];
    verdict = `Comparing <strong>${s1.symbol}</strong> vs <strong>${s2.symbol}</strong>: `;
    if (winnerStock.pem > s1.pem + 10) {
      verdict += `${winnerStock.symbol} shows significantly stronger fundamentals with PEM ${winnerStock.pem} vs ${winnerStock === s1 ? s2.pem : s1.pem}. `;
    } else {
      verdict += `Both are competitive, but <strong>${winnerStock.symbol}</strong> edges ahead. `;
    }
    if (winnerStock.change > 2)
      verdict += `${winnerStock.symbol} showing strong momentum at +${winnerStock.change.toFixed(1)}%. `;
    verdict += `<strong>AI Recommendation:</strong> ${winnerStock.symbol} is the preferred choice.`;
  } else {
    verdict = `Among ${n} stocks, <strong>${winnerStock.symbol}</strong> is the top pick with PEM ${winnerStock.pem}. `;
    const hg = stocks.filter(
      (s) => (stockScores?.[s.symbol]?.growth || 70) > 80,
    );
    const vp = stocks.filter(
      (s) => (stockScores?.[s.symbol]?.valuation || 70) > 80,
    );
    if (hg.length) verdict += `Growth: ${hg.map((s) => s.symbol).join(", ")}. `;
    if (vp.length) verdict += `Value: ${vp.map((s) => s.symbol).join(", ")}. `;
    verdict += `<strong>Recommendation:</strong> Add ${winnerStock.symbol} at 5-8% target.`;
  }
  return verdict;
}
export function generateInsights(stocks, scores) {
  let bG = { stock: null, score: 0 },
    bV = { stock: null, score: 0 };
  let bM = { stock: null, score: 0 },
    sf = { stock: null, score: 100 };
  stocks.forEach((s, i) => {
    if (scores[i].growth > bG.score) bG = { stock: s, score: scores[i].growth };
    if (scores[i].valuation > bV.score)
      bV = { stock: s, score: scores[i].valuation };
    if (scores[i].momentum > bM.score)
      bM = { stock: s, score: scores[i].momentum };
    if (scores[i].risk < sf.score) sf = { stock: s, score: scores[i].risk };
  });
  const insights = [
    {
      icon: "fa-chart-line",
      color: "var(--accent-emerald)",
      title: "Growth Leader",
      text: `${bG.stock?.symbol} leads with ${bG.score} growth score.`,
    },
    {
      icon: "fa-tag",
      color: "var(--accent-blue)",
      title: "Best Valuation",
      text: `${bV.stock?.symbol} offers best value at ${bV.score}/100.`,
    },
    {
      icon: "fa-bolt",
      color: "var(--accent-amber)",
      title: "Top Momentum",
      text: `${bM.stock?.symbol} showing strongest price momentum.`,
    },
    {
      icon: "fa-shield-alt",
      color: "var(--accent-purple)",
      title: "Lowest Risk",
      text: `${sf.stock?.symbol} has the lowest risk profile in group.`,
    },
  ];
  if (stocks.length >= 2) {
    const diff = Math.abs(stocks[0].pem - stocks[1].pem);
    if (diff > 15)
      insights.push({
        icon: "fa-balance-scale",
        color: "var(--accent-cyan)",
        title: "Quality Gap",
        text: `Significant ${diff} pt PEM gap between ${stocks[0].symbol} and ${stocks[1].symbol}.`,
      });
  }
  return insights.slice(0, 6);
}
export function getDynamicAiResponse(question, stocksData) {
  const q = question.toLowerCase();
  if (q.includes("stock") || q.includes("analyze")) {
    return (
      `I've analyzed ${stocksData
        .slice(0, 3)
        .map((s) => s.symbol)
        .join(", ")}:\n\n` +
      stocksData
        .slice(0, 3)
        .map(
          (s) =>
            `• <strong>${s.symbol}</strong>: $${s.price.toFixed(2)} (${s.change >= 0 ? "+" : ""}${s.change.toFixed(2)}%) - PEM: ${s.pem}`,
        )
        .join("\n") +
      `\n\nShall I provide a detailed comparison?`
    );
  }
  if (q.includes("market"))
    return "Market showing strength with S&P 500 at 5,278 (+1.8%). Tech sector leading the rally.";
  if (q.includes("risk"))
    return "Portfolio risk score is 68 (Moderate). Main concerns: Tech concentration at 42% and TSLA price divergence.";
  if (q.includes("opportunit"))
    return "Top opportunities:\n\n1. <strong>NVDA</strong> - +28% upside\n2. <strong>GOOGL</strong> - +30% upside\n3. <strong>META</strong> - +22% upside";
  return "I can help with:\n\n• <strong>Market analysis</strong>\n• <strong>Portfolio insights</strong>\n• <strong>Opportunities</strong>\n• <strong>Risk assessment</strong>\n• <strong>Stock research</strong>";
}
export function calculatePEMScores(content, rules) {
  const elementMap = {
    element6: "Organic Sales Growth Rate of Company (TTM)",
    element7: "Organic Growth rate of TAM",
    element11: "Revenue Generation Consistency",
    element12: "Normalized ROIC",
    element17: "Tailwinds",
    element18: "Pricing Power",
    element22: "Value Proposition Savings/Efficiency",
  };
  const percentBased = [
    "Organic Sales Growth Rate of Company (TTM)",
    "Organic Growth rate of TAM",
    "Normalized ROIC",
  ];
  const getRank = (value, fieldName) => {
    if (value == null || value === "") return 0;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 0;
    const relevant = (rules || []).filter((r) =>
      r.simpleRule?.includes(`{${fieldName}}`),
    );
    for (const rule of relevant) {
      const expr = rule.simpleRule
        .replaceAll(`{${fieldName}}`, "val")
        .replace(/'/g, "")
        .replace(/\band\b/g, "&&")
        .replace(/\bor\b/g, "||")
        .replace(/\b=\b/g, "===");
      const val = percentBased.includes(fieldName)
        ? parseFloat(value) * 100
        : parseFloat(value);
      try {
        const fn = new Function("val", `return ${expr};`);
        if (!isNaN(val) && fn(val)) return parseInt(rule.rank);
      } catch {}
    }
    return 0;
  };
  return content.map((item) => {
    let totalScore = 0;
    for (const [ek, rk] of Object.entries(elementMap))
      totalScore += getRank(item[ek], rk);
    return {
      idMarketData: item.idMarketData,
      name: item.element1,
      symbol: item.element2,
      pemScore: totalScore,
    };
  });
}

const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });
  const stringified = searchParams.toString();
  return stringified ? `?${stringified}` : "";
};

export const fetchWithInterceptor = async (url, queries = {}, options = {}) => {
  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  let finalUrl = "";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (isLocal) {
      // Direct local development fallback hits the IP directly with normal query strings
      finalUrl = `http://35.226.245.206:9092/JarvisV3/${url}${buildQueryString(queries)}`;
    } else {
      // FIX: Flatten parameters out for the Vercel proxy handler
      const proxyParams = new URLSearchParams({ api: url });

      Object.entries(queries).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          proxyParams.append(key, value);
        }
      });

      finalUrl = `/api/proxy?${proxyParams.toString()}`;
    }
  } else {
    finalUrl = url + buildQueryString(queries);
  }

  // Set standard payload headers
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    if (options.headers && options.headers["Content-Type"]) {
      delete options.headers["Content-Type"];
    }
  }

  try {
    const response = await fetch(finalUrl, options);

    if (!response.ok) {
      const errorText = await response.json().catch(() => ({}));
      return errorText;
    }

    return await response.json();
  } catch (error) {
    console.error("Public Fetch execution failure:", error);
    throw error;
  }
};
