import React, { useState, useEffect, useRef, useCallback } from "react";
import { sendChatMessage } from "../services/aiServices";
import { CSS } from "../styles/stockAnalysisStyles.js";

// ─── AGENT PIPELINE DEFINITION ───────────────────────────────────────────────
const PIPELINE = [
  {
    group: "Analyst Agents",
    agents: [
      { id: "market", name: "Market Analyst", icon: "chart" },
      { id: "social", name: "Social Media Analyst", icon: "users" },
      { id: "news", name: "News Analyst", icon: "newspaper" },
      { id: "fundamentals", name: "Fundamentals Analyst", icon: "dollar" },
    ],
  },
  {
    group: "Research Agents",
    agents: [
      { id: "bull", name: "Bull/Bear Advocates", icon: "arrows" },
      { id: "research", name: "Research Evaluator", icon: "search" },
    ],
  },
  {
    group: "Trading Desk",
    agents: [{ id: "trader", name: "Trader", icon: "trend" }],
  },
  {
    group: "Risk Management Agents",
    agents: [{ id: "risk", name: "Risk Analysts", icon: "shield" }],
  },
];

const ALL_AGENTS = PIPELINE.flatMap((g) => g.agents);
const LAST_AGENT_ID = ALL_AGENTS[ALL_AGENTS.length - 1].id;

// ─── PROMPTS ─────────────────────────────────────────────────────────────────
const PROMPTS = {
  market: (t) => `Give Market Analyst report of ${t}`,
  social: (t) => `Give Social Media Analyst report of ${t}.`,
  news: (t) => `Give News Analyst report of ${t}.`,
  fundamentals: (t) => `Give Fundamentals Analyst report of ${t}. `,
  bull: (t) => `Give Bull/Bear Advocates report of ${t}.`,
  research: (t) => `Give Research Evaluator report of ${t}.`,
  trader: (t) => `Give Trader Investment report of ${t}.`,
  risk: (t) => `Give Risk Analysis report of ${t}.`,
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
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

function useIsNarrow(ref, breakpoint = 900) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < breakpoint);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, breakpoint]);
  return narrow;
}

function useTimer(running) {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [running]);
  const reset = useCallback(() => setElapsed(0), []);
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return { elapsed, fmt: fmt(elapsed), reset };
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = ({ type }) => {
  const paths = {
    chart: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    newspaper: (
      <>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8z" />
      </>
    ),
    dollar: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    arrows: (
      <>
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    trend: (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    star: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
    sparkle: (
      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    ),
    arrow: <path d="M14 5l7 7m0 0l-7 7m7-7H3" />,
    bars: (
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
    doc: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </>
    ),
    chevron: <polyline points="6 9 12 15 18 9" />,
    brain: (
      <>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
      </>
    ),
    external: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {paths[type] || paths.star}
    </svg>
  );
};

// ─── SESSION CACHE ────────────────────────────────────────────────────────────
const SESSION = {};

// ─── HOME VIEW ────────────────────────────────────────────────────────────────
function HomeView({ onSearch }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const COMMON = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "NVDA",
    "TSLA",
    "META",
    "NFLX",
  ];

  const submit = (ticker) => {
    const t = ticker.trim().toUpperCase();
    if (!t || t.length > 6 || !/^[A-Z]+$/.test(t)) {
      setError("Enter a valid ticker symbol (e.g. AAPL, MSFT, GOOGL)");
      return;
    }
    setError("");
    onSearch(t);
  };

  return (
    <div className="ta-root ta-home">
      <div className="ta-orb">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <Icon type="sparkle" />
        </svg>
      </div>

      <h1 className="ta-home-title">
        What equity would you
        <br />
        like to <span>analyze?</span>
      </h1>
      <p className="ta-home-sub">
        Multi-agent AI pipeline — market, sentiment, fundamentals, risk, and
        final portfolio verdict.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="ta-search-wrap"
      >
        <input
          className="ta-search-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Enter a ticker  (AAPL, NVDA…)"
          aria-label="Ticker symbol"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck="false"
        />
        <button type="submit" className="ta-search-btn" aria-label="Analyze">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <Icon type="arrow" />
          </svg>
        </button>
      </form>

      {error && (
        <p className="ta-search-error" role="alert">
          {error}
        </p>
      )}

      <div className="ta-chips">
        {COMMON.map((t) => (
          <button
            key={t}
            className="ta-chip"
            type="button"
            onClick={() => {
              setInput(t);
              submit(t);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="ta-disclaimer">
        Not investment advice. For informational purposes only.
      </p>
    </div>
  );
}

// ─── LOADING VIEW ─────────────────────────────────────────────────────────────
function LoadingView({ ticker, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const names = ALL_AGENTS.map((a) => a.name);

  useEffect(() => {
    const total = 4000;
    const interval = 80;
    const steps = total / interval;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const p = (step / steps) * 100;
      setProgress(p);
      setCurrentIdx(
        Math.min(Math.floor((p / 100) * names.length), names.length - 1),
      );
      if (step >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 200);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete, names.length]);

  return (
    <div className="ta-root ta-loading-shell">
      <div className="ta-loading-card">
        <div className="ta-loading-top">
          <span className="ta-spinning">↻</span>
          <span className="ta-loading-headline">Preparing analysis...</span>
        </div>
        <p className="ta-loading-sub">
          Analyzing <span>{ticker}</span> across {names.length} AI agents
        </p>

        <div className="ta-agent-rows">
          {names.map((name, idx) => {
            const done = idx < currentIdx;
            const running = idx === currentIdx;
            return (
              <div key={name} className="ta-agent-row">
                <span
                  className={`ta-agent-label${done || running ? " active" : ""}`}
                >
                  {name}
                </span>
                <span
                  className={`ta-badge ${
                    done
                      ? "ta-badge-done"
                      : running
                        ? "ta-badge-run"
                        : "ta-badge-wait"
                  }`}
                >
                  {done ? "done" : running ? "running" : "waiting"}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="ta-progress-track"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="ta-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ ticker, onReset }) {
  const [reports, setReports] = useState({});
  const [status, setStatus] = useState({});
  const [activeView, setActiveView] = useState(null);
  const [streamText, setStreamText] = useState("");
  const [streamingId, setStreamingId] = useState(null);
  const { elapsed, fmt: timerFmt, reset: resetTimer } = useTimer(true);
  const contentRef = useRef(null);
  const stripRef = useRef(null);
  const abortRef = useRef(false);

  // Sidebar closed by default on mobile, open on desktop
  // useEffect(() => {
  //   setSidebarOpen(!isMobile);
  // }, [isMobile]);

  // const prevMobile = useRef(null);
  // useEffect(() => {
  //   if (prevMobile.current !== null && prevMobile.current !== isMobile) {
  //     setSidebarOpen(!isMobile);
  //   }
  //   if (prevMobile.current === null) setSidebarOpen(!isMobile);
  //   prevMobile.current = isMobile;
  // }, [isMobile]);
  // // Lock body scroll while the mobile drawer is open
  // useEffect(() => {
  //   if (!isMobile) return;
  //   document.body.style.overflow = sidebarOpen ? "hidden" : "";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [isMobile, sidebarOpen]);

  // // Escape closes the drawer
  // useEffect(() => {
  //   if (!isMobile) return;
  //   const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
  //   window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, [isMobile]);

  // const selectReport = useCallback(
  //   (id) => {
  //     setActiveView(id);
  //     if (isMobile) setSidebarOpen(false);
  //   },
  //   [isMobile],
  // );

  // ── Run the full pipeline sequentially ──────────────────────────────────────
  useEffect(() => {
    abortRef.current = false;
    resetTimer();

    const cached = SESSION[ticker];
    if (cached) {
      setReports(cached);
      const doneStatus = {};
      ALL_AGENTS.forEach((a) => {
        doneStatus[a.id] = "done";
      });
      setStatus(doneStatus);
      setActiveView(LAST_AGENT_ID);
      return;
    }

    async function runPipeline() {
      const newReports = {};
      for (const agent of ALL_AGENTS) {
        if (abortRef.current) break;
        setStatus((s) => ({ ...s, [agent.id]: "pending" }));
        await new Promise((r) => setTimeout(r, 100));
        setStatus((s) => ({ ...s, [agent.id]: "streaming" }));
        setStreamingId(agent.id);
        setStreamText("");
        setActiveView(agent.id);

        try {
          const response = await sendChatMessage(PROMPTS[agent.id](ticker));
          if (abortRef.current) break;

          await new Promise((resolve) => {
            let i = 0;
            const speed = Math.max(8, Math.floor(response.length / 120));
            const stream = setInterval(() => {
              if (abortRef.current) {
                clearInterval(stream);
                resolve();
                return;
              }
              i += speed;
              setStreamText(response.slice(0, i));
              if (i >= response.length) {
                clearInterval(stream);
                setStreamText(response);
                resolve();
              }
            }, 16);
          });

          if (abortRef.current) break;
          newReports[agent.id] = response;
          setReports((r) => ({ ...r, [agent.id]: response }));
          setStatus((s) => ({ ...s, [agent.id]: "done" }));
          setStreamingId(null);
          setStreamText("");
          await new Promise((r) => setTimeout(r, 300));
        } catch (err) {
          const errMsg = `Error fetching analysis: ${err.message}`;
          newReports[agent.id] = errMsg;
          setReports((r) => ({ ...r, [agent.id]: errMsg }));
          setStatus((s) => ({ ...s, [agent.id]: "done" }));
          setStreamingId(null);
        }
      }
      if (!abortRef.current) {
        SESSION[ticker] = { ...newReports };
        setActiveView(LAST_AGENT_ID);
      }
    }

    runPipeline();
    return () => {
      abortRef.current = true;
    };
  }, [ticker, resetTimer]);

  // ── Auto-scroll content area ────────────────────────────────────────────────
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamText, activeView]);

  // Keep the running/active pill scrolled into view in the strip
  useEffect(() => {
    const el = stripRef.current?.querySelector(".ta-pill.active");
    el?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeView]);

  const doneCount = ALL_AGENTS.filter((a) => status[a.id] === "done").length;
  const totalProgress = (doneCount / ALL_AGENTS.length) * 100;

  const toggleGroup = (group) => {
    setOpenGroups((g) => ({ ...g, [group]: !g[group] }));
  };

  const getDisplayContent = () => {
    if (!activeView) return null;
    if (activeView === streamingId) return streamText;
    return reports[activeView] || null;
  };

  const displayContent = getDisplayContent();
  const activeAgent = ALL_AGENTS.find((a) => a.id === activeView);
  const isStreaming = activeView === streamingId;

  // Final decision parsed from whichever report declares it
  const getFinalDecision = () => {
    const finalReport =
      reports[LAST_AGENT_ID] ||
      (streamingId === LAST_AGENT_ID ? streamText : "");
    const match = finalReport.match(/\b(BUY|SELL|HOLD)\b/i);
    return match ? match[1].toUpperCase() : null;
  };
  const finalDecision = getFinalDecision();
  const pipelineComplete = doneCount === ALL_AGENTS.length;

  return (
    <div className="ta-root dash">
      {/* Backdrop — mobile only */}
      <div className="ta-progress-bar">
        <div
          className="ta-progress-bar-fill"
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      {/* ── SIDEBAR ── */}
      {/* <div className={`sidebar${sidebarOpen ? "" : " collapsed"}`}> */}
      <div className="ta-topbar">
        <div className="ta-topbar-left">
          <span className="ta-topbar-brand">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <Icon type="brain" />
            </svg>
            <span className="ta-topbar-brand-text">Trading Agents</span>
          </span>
          <span className="ta-topbar-title">
            {activeAgent ? activeAgent.name : "Preparing…"}
          </span>
          {ticker && <span className="ta-topbar-ticker">{ticker}</span>}
          {elapsed > 0 && (
            <span className="ta-topbar-meta">
              {doneCount}/{ALL_AGENTS.length} · <span>{timerFmt}</span>
            </span>
          )}
        </div>
        <button className="ta-reset-btn" onClick={onReset} type="button">
          <span className="ta-reset-full">← New Analysis</span>
          <span className="ta-reset-short">← New</span>
        </button>
      </div>

      <div className="ta-strip" ref={stripRef}>
        {PIPELINE.map((group) => (
          <div key={group.group} className="ta-strip-group">
            <span className="ta-strip-label">
              {group.group.replace(" Agents", "")}
            </span>
            {group.agents.map((agent) => {
              const st = status[agent.id];
              const isDone = st === "done";
              const isRunning = st === "streaming" || st === "pending";
              const isActive = activeView === agent.id;
              return (
                <button
                  key={agent.id}
                  type="button"
                  className={`ta-pill${isDone ? " done clickable" : ""}${
                    isRunning ? " running" : ""
                  }${isActive ? " active" : ""}`}
                  onClick={() => isDone && setActiveView(agent.id)}
                  disabled={!isDone}
                  title={agent.name}
                >
                  <span
                    className={`ta-dot${isDone ? " done" : isRunning ? " running" : ""}`}
                  />
                  <span className="ta-pill-name">{agent.name}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* <div className="sidebar-duration">
        Progress: {doneCount}/{ALL_AGENTS.length} · Duration:{" "}
        <span>{timerFmt}</span>
      </div> */}
      {/* </div> */}

      {/* ── MAIN AREA ── */}
      <div className="main">
        <div className="progress-bar-header">
          <div
            className="progress-bar-fill"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        <div className="top-bar">
          <div className="top-bar-left">
            <button
              className="toggle-sidebar-btn"
              onClick={() => setSidebarOpen((s) => !s)}
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
              type="button"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <Icon type="bars" />
              </svg>
            </button>
          </div>
        </div>

        <div className="ta-content" ref={contentRef}>
          <div className="ta-content-inner">
            {finalDecision &&
              pipelineComplete &&
              activeView === LAST_AGENT_ID && (
                <div className={`ta-decision ${finalDecision.toLowerCase()}`}>
                  <div className="ta-decision-glow" />
                  <div className="ta-decision-big">{finalDecision}</div>
                  <div className="ta-decision-info">
                    <div className="ta-decision-label">
                      Composite Recommendation · {ticker}
                    </div>
                    <div className="ta-decision-ticker">{ticker}</div>
                    <div className="ta-decision-sub">
                      Synthesized across all {ALL_AGENTS.length} analyst agents
                    </div>
                  </div>
                </div>
              )}

            {displayContent ? (
              <div className="ta-report-card">
                <div className="ta-report-head">
                  <div className="ta-report-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <Icon type={activeAgent?.icon || "star"} />
                    </svg>
                  </div>
                  <div className="ta-report-heading">
                    <div className="ta-report-kicker">
                      {PIPELINE.find((g) =>
                        g.agents.some((a) => a.id === activeView),
                      )?.group || "Analysis"}
                    </div>
                    <div className="ta-report-name">{activeAgent?.name}</div>
                  </div>
                  {isStreaming && (
                    <span className="ta-streaming">
                      <span className="ta-streaming-dot">⬤</span>
                      <span className="ta-streaming-word">Streaming</span>
                    </span>
                  )}
                </div>
                <div className="ta-report-body">
                  {displayContent}
                  {isStreaming && <span className="ta-cursor" />}
                </div>
              </div>
            ) : (
              <div className="ta-waiting">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <Icon type="brain" />
                </svg>
                <p>
                  Initializing agent pipeline for <span>{ticker}</span>…
                  <br />
                  Reports will appear here as each agent completes.
                </p>
              </div>
            )}

            {isStreaming && (
              <div className="ta-skeleton">
                <div className="ta-skel-line ta-skel-40" />
                <div className="ta-skel-line ta-skel-95" />
                <div className="ta-skel-line ta-skel-88" />
                <div className="ta-skel-line ta-skel-92" />
                <div className="ta-skel-line ta-skel-70" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function StockAnalysis() {
  const [view, setView] = useState("home");
  const [ticker, setTicker] = useState(null);

  const handleSearch = (t) => {
    setTicker(t);
    setView("loading");
  };
  const handleReady = useCallback(() => setView("dashboard"), []);
  const handleReset = () => {
    setTicker(null);
    setView("home");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {view === "home" && <HomeView onSearch={handleSearch} />}
      {view === "loading" && (
        <LoadingView ticker={ticker} onComplete={handleReady} />
      )}
      {view === "dashboard" && (
        <DashboardView ticker={ticker} onReset={handleReset} />
      )}
    </>
  );
}
