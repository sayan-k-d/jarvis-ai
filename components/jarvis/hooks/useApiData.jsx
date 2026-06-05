import { useState, useEffect, useCallback } from "react";
import { TARGET_TICKERS } from "../data/staticData.js";
import { calculatePEMScores, formatMarketCap } from "../utils/helpers.js";
import { getTokenFromParent } from "../utils/tokenBridge";

const BACKEND_BASE = "http://35.226.245.206:9092/JarvisV3/";
const getToken = await getTokenFromParent();

function proxyUrl(apiPath) {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    return `http://35.226.245.206:9092/JarvisV3/${encodeURIComponent(apiPath)}`;
  }
  return `http://35.226.245.206:9092/JarvisV3/${encodeURIComponent(apiPath)}`;
}

function getAuthHeaders() {
  const token = getToken;
  // typeof window !== "undefined"
  //   ? localStorage.getItem("access_token") || ""
  //   : "";
  return token
    ? { Authorization: "Bearer " + token, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

function buildStockEntry(overview, pemScore) {
  return {
    symbol: overview.Symbol,
    name: overview.Name,
    price: parseFloat(overview.price) || 0,
    change: parseFloat(overview.changePrice) || 0,
    shares: 0,
    pem: pemScore,
    sector: overview.Sector || "N/A",
    marketCap: formatMarketCap(overview.MarketCapitalization),
    pe: parseFloat(overview.PERatio) || 0,
    eps: parseFloat(overview.EPS) || 0,
    description: overview.Description || "",
    _api: {
      ytdReturn: parseFloat(overview.ytdReturn) || 0,
      beta: parseFloat(overview.Beta) || 0,
      week52High: parseFloat(overview["52WeekHigh"]) || 0,
      week52Low: parseFloat(overview["52WeekLow"]) || 0,
      dividendYield: parseFloat(overview.DividendYield) || 0,
      roe: parseFloat(overview.ReturnOnEquityTTM) || 0,
      pegRatio: parseFloat(overview.PEGRatio) || 0,
      forwardPE: parseFloat(overview.ForwardPE) || 0,
      revenueGrowth: parseFloat(overview.QuarterlyRevenueGrowthYOY) || 0,
      profitMargin: parseFloat(overview.ProfitMargin) || 0,
    },
  };
}

export function useApiData() {
  const [apiStocksData, setApiStocksData] = useState([]);
  const [apiDataReady, setApiDataReady] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const bootstrap = useCallback(async () => {
    setApiLoading(true);
    try {
      // Parallel: PEM content, PEM rules, company overviews
      const [pemRes, rulesRes] = await Promise.all([
        fetch(
          // proxyUrl(
          "http://35.226.245.206:9092/JarvisV3/getImportsDataDashboard?metaDataName=PEM_NEW&pageNumber=0&pageSize=1000",
          // ),
        )
          .then((r) => (r.ok ? r.json() : { content: [] }))
          .catch(() => ({ content: [] })),
        fetch("http://35.226.245.206:9092/JarvisV3/getAllPemRuleDasboard")
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
      ]);

      const pemContent = pemRes.content || [];
      const pemRules = Array.isArray(rulesRes)
        ? rulesRes
        : rulesRes.content || [];
      const pemScores = calculatePEMScores(pemContent, pemRules);
      const pemBySymbol = {};
      pemScores.forEach((item) => {
        if (item.symbol) pemBySymbol[item.symbol.trim()] = item.pemScore;
      });

      // One request per ticker in parallel
      const companyResults = await Promise.all(
        TARGET_TICKERS.map(async (ticker) => {
          try {
            const res = await fetch(
              // proxyUrl(
              `http://35.226.245.206:9092/JarvisV3/getCompanyOverviewDataDasboard?size=25&page=0&keyword=${encodeURIComponent(ticker)}`,
              // ),
              // { headers: getAuthHeaders() },
            );
            if (!res.ok) return null;
            const json = await res.json();
            const batch = json.content || [];
            return batch.find((c) => c.Symbol === ticker) || batch[0] || null;
          } catch {
            return null;
          }
        }),
      );

      const enriched = TARGET_TICKERS.map((ticker, idx) => {
        const overview = companyResults[idx];
        if (!overview) return null;
        return buildStockEntry(overview, pemBySymbol[ticker] ?? 0);
      }).filter(Boolean);

      if (enriched.length > 0) {
        setApiStocksData(enriched);
        setApiDataReady(true);
      }
    } catch (err) {
      setApiError(err.message);
      console.error("[Jarvis API] Bootstrap failed:", err);
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(bootstrap, 300);
    return () => clearTimeout(timer);
  }, [bootstrap]);

  return { apiStocksData, apiDataReady, apiLoading, apiError };
}
