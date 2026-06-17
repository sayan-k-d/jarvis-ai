/**
 * JarvisDashboard.jsx
 * ─────────────────────────────────────────────────────────────
 * Main entry point. Drop this into a Next.js page:
 *
 *   import JarvisDashboard from "../components/JarvisDashboard";
 *   export default function Page() { return <JarvisDashboard />; }
 *
 * External CDN dependencies (add to _document.js or layout):
 *   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
 *   <script src="https://code.highcharts.com/highcharts.js"></script>
 *   <script src="https://code.highcharts.com/modules/accessibility.js"></script>
 */

import { useState, useCallback, useRef } from "react";
import { globalCSS } from "./styles/globalCSS.js";
import { stocksData } from "./data/staticData.js";
import { useApiData } from "./hooks/useApiData.jsx";
import Sidebar from "./components/Sidebar.jsx";
import AIPanel from "./components/AIPanel.jsx";
import StockModal from "./components/StockModal.jsx";
import SectionDashboard from "./components/SectionDashboard.jsx";
import SectionMarket from "./components/SectionMarket.jsx";
import SectionCompare from "./components/SectionCompare.jsx";
import StockAnalysis from "./components/StockAnalysis.jsx";
import {
  SectionPortfolioIntel,
  SectionOpportunities,
  SectionRisk,
  SectionStocks,
  SectionScreener,
} from "./components/SectionOthers.jsx";

export default function JarvisDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [aiOpen, setAiOpen] = useState(false);
  const [modalStock, setModalStock] = useState(null);
  // externalQuestion: string + timestamp to force re-trigger even for same question
  const [aiQuestion, setAiQuestion] = useState(null);
  const aiQuestionRef = useRef(null);

  const { apiStocksData, allStocksData, apiDataReady, apiLoading } =
    useApiData();

  // Resolve stock from API data first, then static fallback
  const resolveStock = useCallback(
    (symbol) => {
      if (apiDataReady && apiStocksData.length > 0) {
        const apiStock = apiStocksData.find((s) => s.symbol === symbol);
        if (apiStock) return apiStock;
      }
      return stocksData.find((s) => s.symbol === symbol) || null;
    },
    [apiStocksData, apiDataReady],
  );

  const handleOpenModal = useCallback(
    (symbol) => {
      setModalStock(resolveStock(symbol));
    },
    [resolveStock],
  );

  const handleAskAI = useCallback((question) => {
    setAiOpen(true);
    // Append timestamp so same question can be fired multiple times
    const tagged = question + "__" + Date.now();
    setAiQuestion(tagged);
    aiQuestionRef.current = tagged;
  }, []);

  const toggleAI = () => setAiOpen((prev) => !prev);

  // The active stock list: prefer API data when ready
  const activeList =
    apiDataReady && apiStocksData.length > 0 ? apiStocksData : stocksData;

  const sectionProps = {
    onOpenModal: handleOpenModal,
    onAskAI: handleAskAI,
    activeList,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />

      {/* ── Sidebar ── */}
      <Sidebar activeSection={activeSection} onNavClick={setActiveSection} />

      {/* ── Main Content ── */}
      <main className="main-content">
        {activeSection === "dashboard" && (
          <SectionDashboard {...sectionProps} />
        )}
        {activeSection === "market" && <SectionMarket {...sectionProps} />}
        {activeSection === "stockAnalysis" && (
          <StockAnalysis {...sectionProps} />
        )}
        {activeSection === "portfolio-intel" && (
          <SectionPortfolioIntel {...sectionProps} />
        )}
        {activeSection === "opportunities" && (
          <SectionOpportunities {...sectionProps} />
        )}
        {activeSection === "risk" && <SectionRisk {...sectionProps} />}
        {activeSection === "stocks" && <SectionStocks {...sectionProps} />}
        {activeSection === "screener" && (
          <SectionScreener {...sectionProps} allStocksData={allStocksData} />
        )}
        {activeSection === "compare" && (
          <SectionCompare
            onOpenModal={handleOpenModal}
            apiStocksData={apiStocksData}
            apiDataReady={apiDataReady}
          />
        )}
      </main>

      {/* ── AI Toggle Button ── */}
      <button
        className={`ai-toggle${aiOpen ? " hidden" : ""}`}
        id="aiToggle"
        onClick={toggleAI}
      >
        <i className="fas fa-robot"></i>
      </button>

      {/* ── AI Panel ── */}
      <AIPanel
        isOpen={aiOpen}
        onToggle={toggleAI}
        externalQuestion={aiQuestion ? aiQuestion.split("__")[0] : null}
        stocksData={activeList}
      />

      {/* ── Stock Modal ── */}
      {modalStock && (
        <StockModal stock={modalStock} onClose={() => setModalStock(null)} />
      )}

      {/* API loading indicator */}
      {apiLoading && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: "0.7em",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            zIndex: 150,
          }}
        >
          <div
            className="skeleton"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              animation: "bounce 1.4s infinite ease-in-out both",
            }}
          />
          Loading live data...
        </div>
      )}
    </>
  );
}
