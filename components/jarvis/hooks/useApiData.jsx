import { useState, useEffect, useCallback } from "react";
import { TARGET_TICKERS } from "../data/staticData.js";
import { calculatePEMScores, formatMarketCap } from "../utils/helpers.js";
import { fetchWithInterceptor } from "../utils/helpers.js"; // Check relative path matches layout

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
      // Fetch public PEM metrics concurrently
      const [pemRes, rulesRes] = await Promise.all([
        fetchWithInterceptor("getImportsDataDashboard", {
          metaDataName: "PEM_NEW",
          pageNumber: 0,
          pageSize: 1000,
        }).catch(() => ({ content: [] })),
        fetchWithInterceptor("getAllPemRuleDasboard").catch(() => []),
      ]);

      const pemContent = pemRes?.content || [];
      const pemRules = Array.isArray(rulesRes)
        ? rulesRes
        : rulesRes?.content || [];
      const pemScores = calculatePEMScores(pemContent, pemRules);
      const pemBySymbol = {};

      pemScores.forEach((item) => {
        if (item.symbol) pemBySymbol[item.symbol.trim()] = item.pemScore;
      });

      // Query overview grids for target market tickers in parallel
      const companyResults = await Promise.all(
        TARGET_TICKERS.map(async (ticker) => {
          try {
            const json = await fetchWithInterceptor(
              "getCompanyOverviewDataDasboard",
              {
                size: 25,
                page: 0,
                keyword: ticker,
              },
            );
            const batch = json?.content || [];
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
