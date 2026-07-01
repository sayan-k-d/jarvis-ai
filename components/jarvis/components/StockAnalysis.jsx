import React, { useState, useEffect, useRef, useCallback } from "react";
import { sendChatMessage } from "../services/aiServices";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d1117;
    --bg-card: #161b22;
    --bg-hover: #1c2128;
    --border: rgba(48, 54, 61, 0.8);
    --border-bright: rgba(6, 182, 212, 0.25);
    --green: #06b6d4;
    --green-dim: rgba(6, 182, 212, 0.12);
    --green-glow: rgba(6, 182, 212, 0.08);
    --amber: #f59e0b;
    --red: #ef4444;
    --text: #e6edf3;
    --text-muted: #7d8590;
    --text-dim: #484f58;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    --font-sans: 'Inter', -apple-system, sans-serif;
    --sidebar-w: 300px;
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-sans); overflow: hidden; }

  /* ── HOME ── */
  .home {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px;
    background: radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%);
  }

  .home-orb {
    width: 72px; height: 72px; border-radius: 50%;
    border: 1px solid var(--border-bright);
    background: var(--green-dim);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 36px;
    box-shadow: 0 0 32px rgba(16,185,129,0.15);
    animation: orb-pulse 3s ease-in-out infinite;
  }
  @keyframes orb-pulse {
    0%,100% { box-shadow: 0 0 24px rgba(16,185,129,0.12); }
    50%      { box-shadow: 0 0 48px rgba(16,185,129,0.25); }
  }
  .home-orb svg { width: 32px; height: 32px; stroke: var(--green); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

  .home-title {
    font-family: var(--font-mono); font-size: clamp(1.6rem, 4vw, 2.6rem);
    font-weight: 700; text-align: center; margin-bottom: 12px;
    color: var(--text); letter-spacing: -0.02em; line-height: 1.2;
  }
  .home-title span { color: var(--green); }

  .home-sub { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 48px; text-align: center; line-height: 1.6; max-width: 440px; }

  .search-wrap { width: 100%; max-width: 560px; position: relative; }
  .search-input {
    width: 100%; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 10px; padding: 18px 64px 18px 22px;
    font-size: 1.05rem; color: var(--text); outline: none;
    font-family: var(--font-mono); transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 0.02em;
  }
  .search-input::placeholder { color: var(--text-dim); }
  .search-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }

  .search-btn {
    position: absolute; right: 8px; top: 8px; bottom: 8px;
    width: 46px; border-radius: 6px;
    background: var(--green); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #0d1117; transition: opacity 0.2s, transform 0.1s;
  }
  .search-btn:hover { opacity: 0.88; }
  .search-btn:active { transform: scale(0.96); }
  .search-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

  .search-error { font-family: var(--font-mono); font-size: 0.8rem; color: var(--red); margin-top: 12px; text-align: center; }

  .home-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 24px; }
  .chip {
    font-family: var(--font-mono); font-size: 0.78rem;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 6px; padding: 6px 14px; cursor: pointer;
    color: var(--text-muted); transition: all 0.15s;
  }
  .chip:hover { border-color: var(--green); color: var(--green); background: var(--green-dim); }

  .home-disclaimer { margin-top: 40px; font-size: 0.75rem; color: var(--text-dim); text-align: center; }

  /* ── LOADING ── */
  .loading-shell {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    padding: 20px;
  }
  .loading-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; padding: 36px 40px;
    width: 100%; max-width: 520px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  }
  .loading-top { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
  .spinning { font-size: 1.3rem; color: var(--green); animation: spin 1s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-headline { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: var(--text); }
  .loading-sub { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 28px; font-family: var(--font-mono); }
  .loading-sub span { color: var(--green); }

  .agent-rows { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
  .agent-row { display: flex; justify-content: space-between; align-items: center; }
  .agent-label { font-family: var(--font-mono); font-size: 0.88rem; color: var(--text-dim); transition: color 0.3s; }
  .agent-label.active { color: var(--text); }
  .badge { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; padding: 3px 9px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.06em; border: 1px solid transparent; }
  .badge-wait  { color: var(--text-dim); }
  .badge-run   { color: var(--amber); background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.25); animation: blink 1.2s ease-in-out infinite; }
  .badge-done  { color: var(--green); background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.25); }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

  .progress-track { height: 6px; background: #21262d; border-radius: 3px; overflow: hidden; }
  .progress-fill  { height: 100%; background: var(--green); border-radius: 3px; transition: width 0.15s linear; box-shadow: 0 0 8px rgba(16,185,129,0.5); }

  /* ── DASHBOARD SHELL ── */
  .dash { display: flex; height: 100vh; overflow: hidden; background: var(--bg); }

  /* ── LEFT SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w); flex-shrink: 0;
    background: var(--bg-card); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow: hidden;
    transition: transform 0.25s ease;
  }
  .sidebar.collapsed { transform: translateX(-100%); position: absolute; z-index: 50; height: 100%; }

  .sidebar-top {
    padding: 16px 18px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--text);
  }
  .sidebar-top-icon { width: 18px; height: 18px; stroke: var(--green); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .sidebar-top-name { flex: 1; }
  .ticker-badge-sm {
    font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700;
    background: var(--green-dim); color: var(--green);
    border: 1px solid var(--border-bright); border-radius: 4px;
    padding: 2px 8px; letter-spacing: 0.05em;
  }

  .sidebar-scroll { flex: 1; overflow-y: auto; padding: 12px 0; }
  .sidebar-scroll::-webkit-scrollbar { width: 4px; }
  .sidebar-scroll::-webkit-scrollbar-thumb { background: #2d333b; border-radius: 2px; }

  /* ── SECTION GROUP ── */
  .group { margin-bottom: 4px; }
  .group-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 18px; cursor: pointer; user-select: none;
    font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600;
    color: var(--text-muted); letter-spacing: 0.05em;
    border: 1px solid transparent; border-radius: 6px; margin: 0 8px;
    transition: background 0.15s, color 0.15s;
  }
  .group-header:hover { background: var(--bg-hover); color: var(--text); }
  .group-header.open  { color: var(--green); }
  .group-title { display: flex; align-items: center; gap: 10px; }
  .group-chevron { font-size: 0.7rem; transition: transform 0.2s; color: var(--text-dim); }
  .group-chevron.open { transform: rotate(180deg); color: var(--green); }

  .group-body { overflow: hidden; transition: max-height 0.3s ease; }

  /* ── AGENT ITEM ── */
  .agent-item {
    padding: 0 8px; margin-bottom: 2px;
  }
  .agent-item-inner {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 12px; border-radius: 6px; cursor: default;
    transition: background 0.15s;
  }
  .agent-item-inner.clickable { cursor: pointer; }
  .agent-item-inner.clickable:hover { background: var(--bg-hover); }
  .agent-item-inner.active-view { background: var(--green-glow); border: 1px solid var(--border-bright) !important; }

  .agent-name-row { display: flex; align-items: center; gap: 8px; }
  .agent-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-dim); flex-shrink: 0; transition: background 0.3s; }
  .agent-dot.done { background: var(--green); box-shadow: 0 0 6px rgba(16,185,129,0.6); }
  .agent-dot.running { background: var(--amber); animation: blink 1s infinite; }
  .agent-name { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); transition: color 0.2s; }
  .agent-name.done    { color: var(--text); }
  .agent-name.running { color: var(--amber); }
  .agent-name.active-view { color: var(--green); }

  .see-report {
    font-family: var(--font-mono); font-size: 0.68rem; color: var(--green);
    display: flex; align-items: center; gap: 4px;
    opacity: 0.7; transition: opacity 0.2s;
    white-space: nowrap;
  }
  .see-report:hover { opacity: 1; }
  .see-report svg { width: 11px; height: 11px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  .sidebar-duration {
    padding: 12px 18px; border-top: 1px solid var(--border);
    font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);
  }
  .sidebar-duration span { color: var(--green); }

  /* ── MAIN ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  .top-bar {
    padding: 0 24px; height: 56px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--bg-card); flex-shrink: 0;
  }
  .top-bar-left { display: flex; align-items: center; gap: 12px; }
  .toggle-sidebar-btn {
    width: 32px; height: 32px; border-radius: 6px;
    background: transparent; border: 1px solid var(--border);
    color: var(--text-muted); cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: all 0.15s;
  }
  .toggle-sidebar-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-dim); }
  .toggle-sidebar-btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }
  .top-bar-title { font-family: var(--font-mono); font-size: 0.92rem; font-weight: 600; color: var(--text); }
  .top-bar-ticker { font-family: var(--font-mono); font-size: 0.78rem; color: var(--green); background: var(--green-dim); border: 1px solid var(--border-bright); padding: 3px 10px; border-radius: 5px; }

  .reset-btn {
    font-family: var(--font-mono); font-size: 0.8rem;
    background: transparent; border: 1px solid var(--border);
    color: var(--text-muted); padding: 7px 16px; border-radius: 6px;
    cursor: pointer; transition: all 0.15s;
  }
  .reset-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-dim); }

  /* ── CONTENT AREA ── */
  .content { flex: 1; overflow-y: auto; padding: 32px 40px; }
  .content::-webkit-scrollbar { width: 6px; }
  .content::-webkit-scrollbar-thumb { background: #2d333b; border-radius: 3px; }

  .content-inner { max-width: 860px; margin: 0 auto; }

  /* ── REPORT CARD ── */
  .report-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;
    animation: fade-up 0.4s ease both;
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .report-card-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
    padding-bottom: 16px; border-bottom: 1px solid var(--border);
  }
  .report-card-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--green-dim); border: 1px solid var(--border-bright);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .report-card-icon svg { width: 17px; height: 17px; stroke: var(--green); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .report-card-title { font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
  .report-card-agent { font-family: var(--font-sans); font-size: 1.05rem; font-weight: 600; color: var(--text); }

  .report-body { font-size: 0.9rem; line-height: 1.75; color: #c9d1d9; font-family: var(--font-sans); white-space: pre-wrap; }

  /* streaming cursor */
  .cursor { display: inline-block; width: 2px; height: 1em; background: var(--green); margin-left: 1px; animation: cursor-blink 0.7s step-end infinite; vertical-align: text-bottom; }
  @keyframes cursor-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }

  /* ── DECISION BANNER ── */
  .decision-banner {
    border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 28px;
    animation: fade-up 0.4s ease both;
    position: relative; overflow: hidden;
  }
  .decision-banner.buy  { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.3); }
  .decision-banner.sell { background: rgba(239,68,68,0.06);  border: 1px solid rgba(239,68,68,0.3);  }
  .decision-banner.hold { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.3); }

  .decision-glow {
    position: absolute; top: -40px; left: -40px;
    width: 200px; height: 200px; border-radius: 50%; pointer-events: none;
    filter: blur(60px); opacity: 0.15;
  }
  .decision-banner.buy  .decision-glow { background: var(--green); }
  .decision-banner.sell .decision-glow { background: var(--red); }
  .decision-banner.hold .decision-glow { background: var(--amber); }

  .decision-big { font-family: var(--font-mono); font-size: 3rem; font-weight: 700; line-height: 1; }
  .decision-banner.buy  .decision-big { color: var(--green); }
  .decision-banner.sell .decision-big { color: var(--red); }
  .decision-banner.hold .decision-big { color: var(--amber); }

  .decision-info { flex: 1; }
  .decision-label { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 4px; }
  .decision-price { font-family: var(--font-mono); font-size: 1.5rem; font-weight: 600; color: var(--text); }
  .decision-sub   { font-size: 0.82rem; color: var(--text-muted); margin-top: 6px; line-height: 1.4; }

  /* ── SKELETON ── */
  .skeleton-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;
    animation: fade-up 0.3s ease both;
  }
  .skel-line {
    height: 12px; background: #21262d; border-radius: 4px; margin-bottom: 10px;
    animation: shimmer 1.5s infinite;
    background: linear-gradient(90deg, #21262d 25%, #2d333b 50%, #21262d 75%);
    background-size: 200% 100%;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ── WAITING PLACEHOLDER ── */
  .waiting-state { text-align: center; padding: 80px 20px; color: var(--text-dim); }
  .waiting-state svg { width: 48px; height: 48px; stroke: var(--text-dim); fill: none; stroke-width: 1.2; margin-bottom: 20px; stroke-linecap: round; stroke-linejoin: round; }
  .waiting-state p { font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.8; }
  .waiting-state span { color: var(--green); }

  /* ── PROGRESS BAR (HEADER) ── */
  .progress-bar-header {
    height: 3px; background: #21262d; flex-shrink: 0;
  }
  .progress-bar-fill { height: 100%; background: var(--green); transition: width 0.4s ease; box-shadow: 0 0 6px rgba(16,185,129,0.6); }

  /* ── TIMER ── */
  .timer-display {
    font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);
  }
  .timer-display span { color: var(--green); }

  /* scrollbar global */
  * { scrollbar-width: thin; scrollbar-color: #2d333b transparent; }
`;

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
  // {
  //   group: "Final Verdict",
  //   agents: [{ id: "portfolio", name: "Portfolio Manager", icon: "star" }],
  // },
];

const ALL_AGENTS = PIPELINE.flatMap((g) => g.agents);

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
  // portfolio: (t) =>
  //   `You are a Portfolio Manager AI delivering the final investment decision for ${t}.`,
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = ({ type }) => {
  const paths = {
    chart: (
      <>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </>
    ),
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
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </>
    ),
    star: (
      <>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </>
    ),
    sparkle: (
      <>
        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </>
    ),
    arrow: (
      <>
        <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </>
    ),
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
    chevron: (
      <>
        <polyline points="6 9 12 15 18 9" />
      </>
    ),
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

// ─── MOCK sendChatMessage (replace with real implementation) ──────────────────
// Replace this with your actual sendChatMessage API call.
// It should accept a prompt string and return a Promise<string>.
// async function sendChatMessage(prompt) {
//   // ── Real implementation stub ──────────────────────────────────────────────
//   // Example: return await yourApi.sendMessage(prompt);
//   // ─────────────────────────────────────────────────────────────────────────

//   // Mock: simulate streaming response with 1.5-3s delay
//   await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));
//   const ticker = prompt.match(/\b([A-Z]{2,5})\b/)?.[1] || "STOCK";

//   const mocks = {
//     "Market Analyst": `The technical picture for ${ticker} presents a nuanced story. Price action over the past 90 days shows a clear ascending channel with higher highs and higher lows, suggesting underlying bullish momentum. The 50-day moving average is trending upward and has served as dynamic support on multiple retests.\n\nVolume analysis reveals periods of institutional accumulation, particularly on breakout days above key resistance levels. The relative strength index (RSI) sits around the 58-62 zone — constructive but not overbought — indicating room to run before exhaustion. MACD shows a bullish crossover that occurred roughly three weeks ago and remains intact.\n\nKey resistance sits at the recent swing high, while the most critical support confluence lies where the 50-day MA intersects with horizontal support from prior consolidation. A decisive close above resistance would signal a measured move significantly higher.\n\nOverall technical bias is cautiously BULLISH. The structure is constructive but requires confirmation. Traders should watch for volume-backed breakouts as validation rather than chasing moves into resistance.`,

//     "Social Media Analyst": `Social sentiment analysis for ${ticker} across major platforms shows a notably positive skew in the past 30-day rolling window. Twitter/X activity has seen a 40% increase in mention volume compared to the 90-day average, with the bullish-to-bearish ratio running approximately 3:1.\n\nOn Reddit, ${ticker} has gained significant traction in r/investing with several well-researched long-form posts gaining hundreds of upvotes. r/wallstreetbets discussions are more mixed, though options flow commentary skews bullish with near-term calls seeing elevated interest. StockTwits sentiment score sits at approximately 72% bullish among active traders.\n\nThe dominant retail narrative centers on the company's AI integration strategy, with many retail investors viewing it as a secular tailwind that the market may be underpricing relative to peers. There's also discussion around potential activist investor activity based on unconfirmed sources.\n\nOverall sentiment is POSITIVE. While social sentiment is a lagging and noisy indicator, the directional consensus across multiple platforms and the quality of the bullish arguments suggest this is more signal than noise at current levels.`,

//     "News Analyst": `The recent news flow surrounding ${ticker} has been predominantly positive, creating a constructive macro backdrop for the stock. The most impactful recent catalyst was the company's quarterly earnings beat, which exceeded consensus EPS estimates by approximately 8% while revenue growth came in ahead of expectations at the high end of guidance.\n\nAnalyst community activity has been notably positive, with three major banks upgrading their price targets in the past 45 days. No downgrades have been issued during the same period. Product news has been similarly encouraging, with the recent product launch receiving strong initial industry reviews and early demand signals that exceeded internal expectations.\n\nOn the regulatory front, there are ongoing proceedings in certain jurisdictions that represent a modest headwind, though legal experts quoted in recent coverage suggest the most adverse outcomes are priced in at current levels. The company recently settled a related matter favorably, removing one near-term uncertainty.\n\nThe overall news flow narrative is POSITIVE with improving momentum. The combination of earnings beats, analyst upgrades, and product validation creates a favorable backdrop that typically supports price action over a 3-6 month horizon.`,

//     "Fundamentals Analyst": `From a fundamental perspective, ${ticker} presents a compelling picture of quality growth at a reasonable valuation. Revenue has compounded at approximately 18% annually over the past three years with acceleration visible in the most recent two quarters, suggesting the business is not decelerating as some bears have argued.\n\nProfitability metrics are particularly impressive. Gross margins have expanded 200 basis points year-over-year, indicating pricing power and operating leverage. Free cash flow generation has reached record levels, with FCF yield now competitive with investment-grade fixed income — an increasingly rare quality among high-growth companies.\n\nThe balance sheet remains fortress-like: net cash position, manageable debt-to-EBITDA, and a consistent track record of returning capital via buybacks that have reduced share count by approximately 4% annually over five years. This capital allocation discipline is a significant underappreciated quality factor.\n\nOn valuation, the stock trades at a modest premium to sector peers on forward P/E and EV/EBITDA, but that premium appears justified given the superior growth trajectory, higher margins, and stronger balance sheet. A discounted cash flow model using conservative assumptions suggests 15-25% fundamental upside to current prices.`,

//     "Bull/Bear Advocates": `BULL CASE:\n\n1. AI monetization runway: The company's early-mover advantage in embedding AI into core products creates a multi-year revenue tailwind that consensus models significantly underestimate. Every 1% increase in AI-driven pricing power could add several hundred million in high-margin revenue.\n\n2. Capital return engine: With $40B+ in net cash and commitment to returning 100% of free cash flow, the stock is mechanically supported by buybacks that reduce share count and support EPS growth irrespective of revenue upside.\n\n3. Valuation floor: At current multiples, the stock is trading below its 5-year average forward P/E despite having a structurally better business. This represents a rare entry point that historically has yielded strong 12-month forward returns.\n\n4. Ecosystem lock-in: Customer switching costs are at an all-time high due to deep integration across enterprise workflows, providing revenue visibility and pricing power that moat-focused investors consistently undervalue.\n\nBEAR CASE:\n\n1. China exposure risk: Approximately 20% of revenue is derived from China, where geopolitical tensions and local competition from well-funded domestic players create meaningful revenue concentration risk that could materialize suddenly.\n\n2. Multiple compression: If the broader tech multiple contraction continues amid higher-for-longer interest rates, even strong fundamental execution may not prevent multiple compression from weighing on total returns.\n\n3. Competition intensification: Well-capitalized competitors are increasing R&D spend and hiring aggressively in the same product categories, potentially eroding the competitive moat faster than the market currently prices.\n\n4. Execution risk on new initiatives: Several major strategic bets are in early innings. Failure to execute even one could significantly damage the growth narrative and invite a de-rating.`,

//     "Research Evaluator": `Having synthesized reports from all four primary analysts and the bull/bear advocate assessment, several high-conviction consensus themes emerge for ${ticker}. The weight of evidence is tilted moderately bullish, though not without meaningful caveats.\n\nAreas of consensus: All four analyst teams flag strong recent momentum in both fundamentals and technicals. The earnings beat, analyst upgrades, and improving FCF generation are consistently highlighted as positive differentiators. Social sentiment corroborates the technical setup, suggesting retail and institutional attention is constructive simultaneously — a historically positive signal.\n\nAreas of disagreement: The primary point of debate centers on China revenue risk. The fundamentals analyst views it as manageable given diversification efforts; the risk analysts (previewed in their report) flag it as the single highest-probability tail risk. This tension deserves careful monitoring. The bull/bear debate surfaces a second disagreement on multiple sustainability — bulls see the current multiple as an entry point; bears see it as a ceiling.\n\nResearch Consensus Score: 6.8 / 10 (Moderately Bullish). The preponderance of evidence favors long positioning with defined risk parameters. The most critical factors to weight are (1) FCF generation and capital return program as a valuation floor, and (2) China exposure as the primary downside scenario. Investors with a 6-18 month horizon and defined stop-loss discipline appear well-positioned to add exposure at current levels.`,

//     Trader: `Based on comprehensive analysis from all research teams, my trading recommendation for ${ticker} is as follows:\n\n(1) TRADE DIRECTION: LONG (High Conviction). The technical, fundamental, and sentiment confluence creates a favorable risk/reward setup for long positioning.\n\n(2) ENTRY RANGE: Initiating or adding within 1-2% of current price is appropriate for conviction holders. Technically, any pullback to the 50-day moving average area would represent an even higher-conviction entry for those seeking better risk/reward.\n\n(3) STOP-LOSS: A hard stop at 7-8% below entry is appropriate, corresponding to a break below the 200-day moving average and invalidation of the bullish technical structure. This level has held as support through multiple tests and a break would signal fundamental narrative shift.\n\n(4) PRICE TARGETS: Near-term target (3 months): +15% from entry, corresponding to a test of all-time highs. Medium-term target (12 months): +25-30%, driven by earnings growth and modest multiple re-rating. Stretch target: +45% if AI monetization exceeds consensus by the magnitude the bull case describes.\n\n(5) POSITION SIZING: Medium-to-high conviction position. Suggesting 5-8% portfolio weight for aggressive growth portfolios; 2-4% for balanced portfolios. Do not risk more than 1.5% of total portfolio on the stop.\n\n(6) KEY CATALYSTS TO MONITOR: Next quarterly earnings date, any China regulatory developments, and confirmation of AI product adoption metrics at the next investor day.`,

//     "Risk Analysts": `Comprehensive risk assessment for ${ticker} yields an overall risk rating of MEDIUM. While the investment thesis is well-supported, several risk categories warrant careful monitoring.\n\n(1) Market/Systemic Risk: The stock carries a beta above 1.2, meaning it amplifies broad market moves. In a risk-off environment or significant S&P 500 correction (>10%), expect outsized drawdowns of 15-20%. This is a structural feature of high-growth tech, not a company-specific issue.\n\n(2) Company-Specific Risks: Key-person dependency remains elevated; executive departures have historically caused 5-10% single-day moves. Product cycle execution must remain flawless to justify premium valuation — any guidance miss above 5% below consensus typically triggers 15%+ corrections in this category.\n\n(3) Regulatory/Legal Risk: Ongoing antitrust review in multiple jurisdictions represents a long-dated but potentially significant risk. Current legal expert consensus places the probability of material adverse outcomes at 15-20%. This risk is largely event-driven and hard to hedge cost-effectively.\n\n(4) Macroeconomic Risks: Duration sensitivity to interest rates is meaningful. A 100bps unexpected Fed rate hike scenario historically correlates with 12-18% multiple compression for stocks in this valuation range.\n\n(5) Geopolitical Exposure: China revenue concentration (~20% of total) represents the highest-probability tail risk scenario. An escalation in trade tensions or Taiwan Strait crisis could result in 20-30% downside from this factor alone.\n\n(6) Liquidity/Volatility: High average daily volume provides excellent liquidity for position sizing. 30-day realized volatility is elevated vs. historical, suggesting options are expensive for hedging. The risk-adjusted recommendation is to size position appropriately rather than over-hedge with expensive puts.`,

//     // "Portfolio Manager": `FINAL DECISION: BUY\n\nAfter reviewing all analyst reports — technical, social sentiment, news, fundamentals, bull/bear debate, research synthesis, trading recommendation, and risk management assessment — I am issuing a BUY decision for ${ticker} with MEDIUM-HIGH conviction.\n\nThe investment thesis in one sentence: ${ticker} represents a high-quality compounding machine with multiple earnings growth tailwinds, trading at a rare discount to its intrinsic value on a risk-adjusted basis, with a capital return program providing meaningful downside protection.\n\nRecommended portfolio allocation: 5-6% for growth-oriented portfolios. For more conservative mandates, 2-3% is appropriate. Position should be built in two tranches — initiate at current prices and add on any weakness toward the 50-day moving average.\n\nConditions that would change this view: (1) Two consecutive quarters of revenue deceleration below 10% growth, (2) Material escalation in China trade restrictions that management acknowledges will impact forward guidance by more than 10%, (3) Any sign of core product competitive threat gaining >5% market share. If any of these conditions materialize, the position should be reduced to a monitoring position pending reassessment. The stop-loss at 8% below entry remains sacrosanct regardless of conviction level.`,
//   };

//   const agentName =
//     ALL_AGENTS.find((a) => {
//       const kw = a.id;
//       return prompt.toLowerCase().includes(kw) || prompt.includes(a.name);
//     })?.name || "Market Analyst";
//   // return mocks[agentName] || mocks["Market Analyst"];
//   return await sendChatMessage(prompt);
// }

// ─── TIMER HOOK ───────────────────────────────────────────────────────────────
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
  const reset = () => setElapsed(0);
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return { elapsed, fmt: fmt(elapsed), reset };
}

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
    if (!t || t.length < 1 || t.length > 6 || !/^[A-Z]+$/.test(t)) {
      setError("Enter a valid ticker symbol (e.g. AAPL, MSFT, GOOGL)");
      return;
    }
    setError("");
    onSearch(t);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(input);
  };

  return (
    <div className="home">
      <div className="home-orb">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <Icon type="sparkle" />
        </svg>
      </div>

      <h1 className="home-title">
        What equity would you
        <br />
        like to <span>analyze?</span>
      </h1>
      <p className="home-sub">
        Multi-agent AI pipeline — market, sentiment, fundamentals, risk, and
        final portfolio verdict.
      </p>

      <form onSubmit={handleSubmit} className="search-wrap">
        <input
          className="search-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Enter a ticker symbol  (AAPL, NVDA, TSLA…)"
          autoFocus
        />
        <button type="submit" className="search-btn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <Icon type="arrow" />
          </svg>
        </button>
      </form>

      {error && <p className="search-error">{error}</p>}

      <div className="home-chips">
        {COMMON.map((t) => (
          <button
            key={t}
            className="chip"
            onClick={() => {
              setInput(t);
              submit(t);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="home-disclaimer">
        Not investment advice. For informational purposes only.
      </p>
    </div>
  );
}

// ─── LOADING VIEW ─────────────────────────────────────────────────────────────
function LoadingView({ ticker, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  const LOADING_AGENTS = [
    "Market Analyst",
    "Social Media Analyst",
    "News Analyst",
    "Fundamentals Analyst",
    "Bull/Bear Advocates",
    "Research Evaluator",
    "Trader",
    "Risk Analysts",
    // "Portfolio Manager",
  ];

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
        Math.min(
          Math.floor((p / 100) * LOADING_AGENTS.length),
          LOADING_AGENTS.length - 1,
        ),
      );
      if (step >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 200);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="loading-shell">
      <div className="loading-card">
        <div className="loading-top">
          <span className="spinning">↻</span>
          <span className="loading-headline">Preparing analysis...</span>
        </div>
        <p className="loading-sub">
          Analyzing <span>{ticker}</span> across {LOADING_AGENTS.length} AI
          agents
        </p>

        <div className="agent-rows">
          {LOADING_AGENTS.map((name, idx) => {
            const done = idx < currentIdx;
            const running = idx === currentIdx;
            return (
              <div key={name} className="agent-row">
                <span
                  className={`agent-label${done || running ? " active" : ""}`}
                >
                  {name}
                </span>
                <span
                  className={`badge ${done ? "badge-done" : running ? "badge-run" : "badge-wait"}`}
                >
                  {done ? "done" : running ? "running" : "waiting"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ ticker, onReset }) {
  const [reports, setReports] = useState({}); // id → string
  const [status, setStatus] = useState({}); // id → 'pending'|'streaming'|'done'
  const [activeView, setActiveView] = useState(null); // id of currently viewed report
  const [openGroups, setOpenGroups] = useState(
    Object.fromEntries(PIPELINE.map((g) => [g.group, true])),
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streamText, setStreamText] = useState(""); // currently streaming text
  const [streamingId, setStreamingId] = useState(null);
  const { elapsed, fmt: timerFmt, reset: resetTimer } = useTimer(true);
  const contentRef = useRef(null);
  const abortRef = useRef(false);

  // ── Run the full pipeline sequentially ──────────────────────────────────────
  useEffect(() => {
    abortRef.current = false;
    resetTimer();

    // Check session cache
    const cached = SESSION[ticker];
    if (cached) {
      setReports(cached);
      const doneStatus = {};
      ALL_AGENTS.forEach((a) => {
        doneStatus[a.id] = "done";
      });
      setStatus(doneStatus);
      setActiveView("portfolio");
      return;
    }

    async function runPipeline() {
      const newReports = {};

      for (const agent of ALL_AGENTS) {
        if (abortRef.current) break;

        // Mark as pending initially
        setStatus((s) => ({ ...s, [agent.id]: "pending" }));
        await new Promise((r) => setTimeout(r, 100));

        // Mark as streaming
        setStatus((s) => ({ ...s, [agent.id]: "streaming" }));
        setStreamingId(agent.id);
        setStreamText("");
        setActiveView(agent.id);

        try {
          const prompt = PROMPTS[agent.id](ticker);
          const response = await sendChatMessage(prompt);

          if (abortRef.current) break;

          // Simulate character-by-character streaming
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

          // Small gap between agents
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
        setActiveView("portfolio");
      }
    }

    runPipeline();
    return () => {
      abortRef.current = true;
    };
  }, [ticker]);

  // ── Auto-scroll content area ─────────────────────────────────────────────
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamText, activeView]);

  // ── Derive total pipeline progress ─────────────────────────────────────────
  const doneCount = ALL_AGENTS.filter((a) => status[a.id] === "done").length;
  const totalProgress = (doneCount / ALL_AGENTS.length) * 100;

  // ── Toggle sidebar group ────────────────────────────────────────────────────
  const toggleGroup = (group) => {
    setOpenGroups((g) => ({ ...g, [group]: !g[group] }));
  };

  // ── Determine what to show in main content ──────────────────────────────────
  const getDisplayContent = () => {
    if (!activeView) return null;
    if (activeView === streamingId) return streamText;
    return reports[activeView] || null;
  };

  const displayContent = getDisplayContent();
  const activeAgent = ALL_AGENTS.find((a) => a.id === activeView);
  const isStreaming = activeView === streamingId;

  // ── Parse final decision from portfolio report ──────────────────────────────
  const getFinalDecision = () => {
    const portReport =
      reports["portfolio"] || (streamingId === "portfolio" ? streamText : "");
    const match = portReport.match(/FINAL DECISION:\s*(BUY|SELL|HOLD)/i);
    return match ? match[1].toUpperCase() : null;
  };
  const finalDecision = getFinalDecision();

  // ── Decision banner colors ──────────────────────────────────────────────────
  const decisionColor = {
    BUY: "var(--green)",
    SELL: "var(--red)",
    HOLD: "var(--amber)",
  };

  return (
    <div className="dash">
      {/* ── SIDEBAR ── */}
      <div className={`sidebar${sidebarOpen ? "" : " collapsed"}`}>
        <div className="sidebar-top">
          <svg
            className="sidebar-top-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Icon type="brain" />
          </svg>
          <span className="sidebar-top-name">Trading Agents</span>
          {ticker && <span className="ticker-badge-sm">{ticker}</span>}
        </div>

        <div className="sidebar-scroll">
          {PIPELINE.map((group) => {
            const isOpen = openGroups[group.group];
            const allDone = group.agents.every((a) => status[a.id] === "done");
            return (
              <div key={group.group} className="group">
                <div
                  className={`group-header${isOpen ? " open" : ""}`}
                  onClick={() => toggleGroup(group.group)}
                >
                  <span className="group-title">
                    {allDone && (
                      <span
                        style={{ color: "var(--green)", fontSize: "0.7rem" }}
                      >
                        ✓
                      </span>
                    )}
                    {group.group}
                  </span>
                  <svg
                    className={`group-chevron${isOpen ? " open" : ""}`}
                    viewBox="0 0 24 24"
                    style={{
                      width: 14,
                      height: 14,
                      stroke: "currentColor",
                      fill: "none",
                      strokeWidth: 2.5,
                      strokeLinecap: "round",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Icon type="chevron" />
                  </svg>
                </div>

                <div
                  className="group-body"
                  style={{ maxHeight: isOpen ? "400px" : "0" }}
                >
                  {group.agents.map((agent) => {
                    const st = status[agent.id];
                    const isDone = st === "done";
                    const isRunning = st === "streaming" || st === "pending";
                    const isActive = activeView === agent.id;
                    const hasReport = !!reports[agent.id];

                    return (
                      <div key={agent.id} className="agent-item">
                        <div
                          className={`agent-item-inner${isDone ? " clickable" : ""}${isActive ? " active-view" : ""}`}
                          onClick={() => isDone && setActiveView(agent.id)}
                        >
                          <div className="agent-name-row">
                            <div
                              className={`agent-dot${isDone ? " done" : isRunning ? " running" : ""}`}
                            />
                            <span
                              className={`agent-name${isDone ? " done" : isRunning ? " running" : ""}${isActive ? " active-view" : ""}`}
                            >
                              {agent.name}
                            </span>
                          </div>
                          {isDone && (
                            <span className="see-report">
                              <svg
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <Icon type="doc" />
                              </svg>
                              see report
                            </span>
                          )}
                          {isRunning && (
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                color: "var(--amber)",
                              }}
                            >
                              running
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="sidebar-duration">
          Progress: {doneCount}/{ALL_AGENTS.length} · Duration:{" "}
          <span>{timerFmt}</span>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div className="main">
        {/* Progress Bar */}
        <div className="progress-bar-header">
          <div
            className="progress-bar-fill"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button
              className="toggle-sidebar-btn"
              onClick={() => setSidebarOpen((s) => !s)}
              title="Toggle sidebar"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <Icon type="bars" />
              </svg>
            </button>
            <span className="top-bar-title">
              {activeAgent ? activeAgent.name : "Preparing analysis..."}
            </span>
            {ticker && <span className="top-bar-ticker">{ticker}</span>}
            {elapsed > 0 && (
              <span className="timer-display">
                · <span>{timerFmt}</span>
              </span>
            )}
          </div>
          <button className="reset-btn" onClick={onReset}>
            ← New Analysis
          </button>
        </div>

        {/* Content */}
        <div className="content" ref={contentRef}>
          <div className="content-inner">
            {/* Final decision banner — show when portfolio report is done */}
            {finalDecision && activeView === "portfolio" && (
              <div className={`decision-banner ${finalDecision.toLowerCase()}`}>
                <div className="decision-glow" />
                <div className="decision-big">{finalDecision}</div>
                <div className="decision-info">
                  <div className="decision-label">
                    Final Portfolio Recommendation · {ticker}
                  </div>
                  <div className="decision-price">{ticker}</div>
                  <div className="decision-sub">
                    Portfolio Manager AI · High conviction composite analysis
                    across all {ALL_AGENTS.length} agents
                  </div>
                </div>
              </div>
            )}

            {/* Report card */}
            {displayContent ? (
              <div className="report-card">
                <div className="report-card-header">
                  <div className="report-card-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <Icon type={activeAgent?.icon || "star"} />
                    </svg>
                  </div>
                  <div>
                    <div className="report-card-title">
                      {PIPELINE.find((g) =>
                        g.agents.some((a) => a.id === activeView),
                      )?.group || "Analysis"}
                    </div>
                    <div className="report-card-agent">{activeAgent?.name}</div>
                  </div>
                  {isStreaming && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        color: "var(--amber)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ animation: "blink 1s infinite" }}>⬤</span>{" "}
                      Streaming
                    </span>
                  )}
                </div>
                <div className="report-body">
                  {displayContent}
                  {isStreaming && <span className="cursor" />}
                </div>
              </div>
            ) : (
              <div className="waiting-state">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <Icon type="brain" />
                </svg>
                <p>
                  Initializing agent pipeline for <span>{ticker}</span>…<br />
                  Reports will appear here as each agent completes.
                </p>
              </div>
            )}

            {/* Skeleton loaders for upcoming agents */}
            {isStreaming && (
              <div className="skeleton-card">
                <div
                  className="skel-line"
                  style={{ width: "40%", marginBottom: 16 }}
                />
                <div className="skel-line" style={{ width: "95%" }} />
                <div className="skel-line" style={{ width: "88%" }} />
                <div className="skel-line" style={{ width: "92%" }} />
                <div className="skel-line" style={{ width: "70%" }} />
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
  const handleReady = () => {
    setView("dashboard");
  };
  const handleReset = () => {
    setTicker(null);
    setView("home");
  };

  return (
    <>
      <style>{CSS}</style>
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
