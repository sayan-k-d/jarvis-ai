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
    marketCapRaw: parseFloat(overview.MarketCapitalization) || 0,
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
  const [allStocksData, setAllStocksData] = useState([]);
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

      // Normalize keys to uppercase so symbol lookups are case-insensitive
      pemScores.forEach((item) => {
        if (item.symbol)
          pemBySymbol[item.symbol.trim().toUpperCase()] = item.pemScore;
      });

      // Query overview grids for target tickers + all overviews in parallel
      const [companyResults, allOverviewsRes] = await Promise.all([
        Promise.all(
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
        ),
        // Omit keyword entirely so the API returns all records instead of filtering by empty string
        fetchWithInterceptor("getCompanyOverviewDataDasboard", {
          size: 1000,
          page: 0,
        }).catch(() => ({ content: [] })),
      ]);

      const enriched = TARGET_TICKERS.map((ticker, idx) => {
        const overview = companyResults[idx];
        if (!overview) return null;
        return buildStockEntry(
          overview,
          pemBySymbol[ticker.toUpperCase()] ?? 0,
        );
      }).filter(Boolean);

      if (enriched.length > 0) {
        setApiStocksData(enriched);
        setApiDataReady(true);
      }

      const allContent = allOverviewsRes?.content || [];

      const allEnriched = allContent
        // .filter((o) => o.Symbol)
        .map((o) =>
          buildStockEntry(o, pemBySymbol[o.Symbol.trim().toUpperCase()] ?? 0),
        );

      if (allEnriched.length > 0) {
        setAllStocksData(allEnriched);
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

  return { apiStocksData, allStocksData, apiDataReady, apiLoading, apiError };
}
