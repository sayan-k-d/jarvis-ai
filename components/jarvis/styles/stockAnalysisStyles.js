export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  .ta-root, .ta-root *, .ta-root *::before, .ta-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .ta-root {
    --ta-bg: #0d1117;
    --ta-card: #161b22;
    --ta-hover: #1c2128;
    --ta-border: rgba(48, 54, 61, 0.8);
    --ta-border-bright: rgba(6, 182, 212, 0.25);
    --ta-green: #06b6d4;
    --ta-green-dim: rgba(6, 182, 212, 0.12);
    --ta-green-glow: rgba(6, 182, 212, 0.08);
    --ta-amber: #f59e0b;
    --ta-red: #ef4444;
    --ta-text: #e6edf3;
    --ta-muted: #7d8590;
    --ta-dim: #484f58;
    --ta-mono: 'JetBrains Mono', 'Fira Code', monospace;
    --ta-sans: 'Inter', -apple-system, sans-serif;

    background: var(--ta-bg);
    color: var(--ta-text);
    font-family: var(--ta-sans);
    scrollbar-width: thin;
    scrollbar-color: #2d333b transparent;

    /* Escape .main-content padding for full-bleed */
    margin: -24px -32px;
  }

  /* ══════════ HOME ══════════ */
  .ta-home {
    min-height: calc(100vh - 48px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px;
    background: radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 60%);
  }

  .ta-orb {
    width: 72px; height: 72px; border-radius: 50%;
    border: 1px solid var(--ta-border-bright);
    background: var(--ta-green-dim);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 36px;
    box-shadow: 0 0 32px rgba(6,182,212,0.15);
    animation: ta-orb-pulse 3s ease-in-out infinite;
  }
  @keyframes ta-orb-pulse {
    0%,100% { box-shadow: 0 0 24px rgba(6,182,212,0.12); }
    50%     { box-shadow: 0 0 48px rgba(6,182,212,0.25); }
  }
  .ta-orb svg { width: 32px; height: 32px; stroke: var(--ta-green); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

  .ta-home-title {
    font-family: var(--ta-mono); font-size: clamp(1.5rem, 4vw, 2.6rem);
    font-weight: 700; text-align: center; margin-bottom: 12px;
    color: var(--ta-text); letter-spacing: -0.02em; line-height: 1.2;
  }
  .ta-home-title span { color: var(--ta-green); }
  .ta-home-sub { font-size: 0.9rem; color: var(--ta-muted); margin-bottom: 48px; text-align: center; line-height: 1.6; max-width: 440px; }

  .ta-search-wrap { width: 100%; max-width: 560px; position: relative; }
  .ta-search-input {
    width: 100%; background: var(--ta-card); border: 1px solid var(--ta-border);
    border-radius: 10px; padding: 18px 64px 18px 22px;
    font-size: 1.05rem; color: var(--ta-text); outline: none;
    font-family: var(--ta-mono); transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 0.02em;
  }
  .ta-search-input::placeholder { color: var(--ta-dim); }
  .ta-search-input:focus { border-color: var(--ta-green); box-shadow: 0 0 0 3px rgba(6,182,212,0.12); }

  .ta-search-btn {
    position: absolute; right: 8px; top: 8px; bottom: 8px;
    width: 46px; border-radius: 6px;
    background: var(--ta-green); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #0d1117; transition: opacity 0.2s, transform 0.1s;
  }
  .ta-search-btn:hover { opacity: 0.88; }
  .ta-search-btn:active { transform: scale(0.96); }
  .ta-search-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

  .ta-search-error { font-family: var(--ta-mono); font-size: 0.8rem; color: var(--ta-red); margin-top: 12px; text-align: center; }

  .ta-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 24px; max-width: 560px; }
  .ta-chip {
    font-family: var(--ta-mono); font-size: 0.78rem;
    background: var(--ta-card); border: 1px solid var(--ta-border);
    border-radius: 6px; padding: 6px 14px; cursor: pointer;
    color: var(--ta-muted); transition: all 0.15s;
  }
  .ta-chip:hover { border-color: var(--ta-green); color: var(--ta-green); background: var(--ta-green-dim); }
  .ta-disclaimer { margin-top: 40px; font-size: 0.75rem; color: var(--ta-dim); text-align: center; }

  /* ══════════ LOADING ══════════ */
  .ta-loading-shell {
    min-height: calc(100vh - 48px);
    display: flex; align-items: center; justify-content: center;
    background: var(--ta-bg); padding: 20px;
  }
  .ta-loading-card {
    background: var(--ta-card); border: 1px solid var(--ta-border);
    border-radius: 14px; padding: 36px 40px;
    width: 100%; max-width: 520px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  }
  .ta-loading-top { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
  .ta-spinning { font-size: 1.3rem; color: var(--ta-green); animation: ta-spin 1s linear infinite; display: inline-block; }
  @keyframes ta-spin { to { transform: rotate(360deg); } }
  .ta-loading-headline { font-family: var(--ta-mono); font-size: 1.1rem; font-weight: 600; color: var(--ta-text); }
  .ta-loading-sub { font-size: 0.8rem; color: var(--ta-muted); margin-bottom: 28px; font-family: var(--ta-mono); }
  .ta-loading-sub span { color: var(--ta-green); }

  .ta-agent-rows { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
  .ta-agent-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .ta-agent-label { font-family: var(--ta-mono); font-size: 0.88rem; color: var(--ta-dim); transition: color 0.3s; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ta-agent-label.active { color: var(--ta-text); }
  .ta-badge { font-family: var(--ta-mono); font-size: 0.7rem; font-weight: 600; padding: 3px 9px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.06em; border: 1px solid transparent; flex-shrink: 0; }
  .ta-badge-wait { color: var(--ta-dim); }
  .ta-badge-run  { color: var(--ta-amber); background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.25); animation: ta-blink 1.2s ease-in-out infinite; }
  .ta-badge-done { color: var(--ta-green); background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.25); }
  @keyframes ta-blink { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

  .ta-progress-track { height: 6px; background: #21262d; border-radius: 3px; overflow: hidden; }
  .ta-progress-fill  { height: 100%; background: var(--ta-green); border-radius: 3px; transition: width 0.15s linear; box-shadow: 0 0 8px rgba(6,182,212,0.5); }

  /* ══════════ DASHBOARD ══════════ */
  .ta-dash {
    display: flex; flex-direction: column;
    height: calc(100vh - 48px); overflow: hidden;
    background: var(--ta-bg); position: relative;
  }

  .ta-progress-bar { height: 3px; background: #21262d; flex-shrink: 0; }
  .ta-progress-bar-fill { height: 100%; background: var(--ta-green); transition: width 0.4s ease; box-shadow: 0 0 6px rgba(6,182,212,0.6); }

  /* ── TOP BAR ── */
  .ta-topbar {
    padding: 0 24px; min-height: 56px;
    border-bottom: 1px solid var(--ta-border);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--ta-card); flex-shrink: 0; gap: 12px;
  }
  .ta-topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
  .ta-topbar-brand { display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
  .ta-topbar-brand svg { width: 17px; height: 17px; stroke: var(--ta-green); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ta-topbar-brand-text {
    font-family: var(--ta-mono); font-size: 0.72rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--ta-text);
  }
  .ta-topbar-title { font-family: var(--ta-mono); font-size: 0.9rem; font-weight: 600; color: var(--ta-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ta-topbar-ticker {
    font-family: var(--ta-mono); font-size: 0.75rem; color: var(--ta-green);
    background: var(--ta-green-dim); border: 1px solid var(--ta-border-bright);
    padding: 3px 10px; border-radius: 5px; flex-shrink: 0;
  }
  .ta-topbar-meta { font-family: var(--ta-mono); font-size: 0.72rem; color: var(--ta-muted); flex-shrink: 0; }
  .ta-topbar-meta span { color: var(--ta-green); }

  .ta-reset-btn {
    font-family: var(--ta-mono); font-size: 0.8rem; flex-shrink: 0;
    background: transparent; border: 1px solid var(--ta-border);
    color: var(--ta-muted); padding: 7px 16px; border-radius: 6px;
    cursor: pointer; transition: all 0.15s;
  }
  .ta-reset-btn:hover { border-color: var(--ta-green); color: var(--ta-green); background: var(--ta-green-dim); }
  .ta-reset-short { display: none; }

  /* ── AGENT STRIP (replaces the nested sidebar) ── */
  .ta-strip {
    display: flex; align-items: stretch; gap: 8px;
    padding: 10px 24px; background: var(--ta-card);
    border-bottom: 1px solid var(--ta-border); flex-shrink: 0;
    overflow-x: auto; overflow-y: hidden;
    scrollbar-width: none; -webkit-overflow-scrolling: touch;
  }
  .ta-strip::-webkit-scrollbar { display: none; }

  .ta-strip-group { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .ta-strip-group + .ta-strip-group { padding-left: 8px; border-left: 1px solid var(--ta-border); }
  .ta-strip-label {
    font-family: var(--ta-mono); font-size: 0.6rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--ta-dim);
    writing-mode: horizontal-tb; white-space: nowrap; padding-right: 2px;
  }

  .ta-pill {
    display: flex; align-items: center; gap: 7px; flex-shrink: 0;
    font-family: var(--ta-mono); font-size: 0.74rem;
    background: transparent; border: 1px solid var(--ta-border);
    color: var(--ta-muted); padding: 7px 12px; border-radius: 6px;
    cursor: default; white-space: nowrap; transition: all 0.15s;
  }
  .ta-pill.clickable { cursor: pointer; }
  .ta-pill.clickable:hover { background: var(--ta-hover); color: var(--ta-text); border-color: var(--ta-muted); }
  .ta-pill.active { background: var(--ta-green-glow); border-color: var(--ta-border-bright); color: var(--ta-green); }
  .ta-pill:focus-visible { outline: 2px solid var(--ta-green); outline-offset: 2px; }

  .ta-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ta-dim); flex-shrink: 0; transition: background 0.3s; }
  .ta-dot.done { background: var(--ta-green); box-shadow: 0 0 6px rgba(6,182,212,0.6); }
  .ta-dot.running { background: var(--ta-amber); animation: ta-blink 1s infinite; }
  .ta-pill.done .ta-pill-name { color: var(--ta-text); }
  .ta-pill.running .ta-pill-name { color: var(--ta-amber); }
  .ta-pill.active .ta-pill-name { color: var(--ta-green); }

  /* ── CONTENT ── */
  .ta-content { flex: 1; overflow-y: auto; padding: 32px 40px; -webkit-overflow-scrolling: touch; }
  .ta-content::-webkit-scrollbar { width: 6px; }
  .ta-content::-webkit-scrollbar-thumb { background: #2d333b; border-radius: 3px; }
  .ta-content-inner { max-width: 860px; margin: 0 auto; }

  /* ── REPORT CARD ── */
  .ta-report-card {
    background: var(--ta-card); border: 1px solid var(--ta-border);
    border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;
    animation: ta-fade-up 0.4s ease both;
  }
  @keyframes ta-fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ta-report-head {
    display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
    padding-bottom: 16px; border-bottom: 1px solid var(--ta-border);
  }
  .ta-report-heading { min-width: 0; }
  .ta-report-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--ta-green-dim); border: 1px solid var(--ta-border-bright);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ta-report-icon svg { width: 17px; height: 17px; stroke: var(--ta-green); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ta-report-kicker { font-family: var(--ta-mono); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ta-muted); }
  .ta-report-name { font-family: var(--ta-sans); font-size: 1.05rem; font-weight: 600; color: var(--ta-text); }

  .ta-streaming {
    margin-left: auto; font-family: var(--ta-mono); font-size: 0.72rem;
    color: var(--ta-amber); display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  }
  .ta-streaming-dot { animation: ta-blink 1s infinite; }

  .ta-report-body { font-size: 0.9rem; line-height: 1.75; color: #c9d1d9; font-family: var(--ta-sans); white-space: pre-wrap; word-break: break-word; }
  .ta-cursor { display: inline-block; width: 2px; height: 1em; background: var(--ta-green); margin-left: 1px; animation: ta-cursor-blink 0.7s step-end infinite; vertical-align: text-bottom; }
  @keyframes ta-cursor-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }

  /* ── DECISION BANNER ── */
  .ta-decision {
    border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 28px;
    animation: ta-fade-up 0.4s ease both;
    position: relative; overflow: hidden;
  }
  .ta-decision.buy  { background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.3); }
  .ta-decision.sell { background: rgba(239,68,68,0.06);  border: 1px solid rgba(239,68,68,0.3);  }
  .ta-decision.hold { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.3); }
  .ta-decision-glow {
    position: absolute; top: -40px; left: -40px;
    width: 200px; height: 200px; border-radius: 50%; pointer-events: none;
    filter: blur(60px); opacity: 0.15;
  }
  .ta-decision.buy  .ta-decision-glow { background: var(--ta-green); }
  .ta-decision.sell .ta-decision-glow { background: var(--ta-red); }
  .ta-decision.hold .ta-decision-glow { background: var(--ta-amber); }
  .ta-decision-big { font-family: var(--ta-mono); font-size: 3rem; font-weight: 700; line-height: 1; }
  .ta-decision.buy  .ta-decision-big { color: var(--ta-green); }
  .ta-decision.sell .ta-decision-big { color: var(--ta-red); }
  .ta-decision.hold .ta-decision-big { color: var(--ta-amber); }
  .ta-decision-info { flex: 1; min-width: 0; }
  .ta-decision-label { font-family: var(--ta-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ta-muted); margin-bottom: 4px; }
  .ta-decision-ticker { font-family: var(--ta-mono); font-size: 1.5rem; font-weight: 600; color: var(--ta-text); }
  .ta-decision-sub { font-size: 0.82rem; color: var(--ta-muted); margin-top: 6px; line-height: 1.4; }

  /* ── SKELETON / WAITING ── */
  .ta-skeleton {
    background: var(--ta-card); border: 1px solid var(--ta-border);
    border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;
    animation: ta-fade-up 0.3s ease both;
  }
  .ta-skel-line {
    height: 12px; border-radius: 4px; margin-bottom: 10px;
    animation: ta-shimmer 1.5s infinite;
    background: linear-gradient(90deg, #21262d 25%, #2d333b 50%, #21262d 75%);
    background-size: 200% 100%;
  }
  .ta-skel-40 { width: 40%; margin-bottom: 16px; }
  .ta-skel-95 { width: 95%; }
  .ta-skel-88 { width: 88%; }
  .ta-skel-92 { width: 92%; }
  .ta-skel-70 { width: 70%; }
  @keyframes ta-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .ta-waiting { text-align: center; padding: 80px 20px; color: var(--ta-dim); }
  .ta-waiting svg { margin-left:auto; margin-right:auto; width: 48px; height: 48px; stroke: var(--ta-dim); fill: none; stroke-width: 1.2; margin-bottom: 20px; stroke-linecap: round; stroke-linejoin: round; }
  .ta-waiting p { font-family: var(--ta-mono); font-size: 0.85rem; line-height: 1.8; }
  .ta-waiting span { color: var(--ta-green); }

  /* ══════════ RESPONSIVE ══════════ */

  @media (max-width: 1280px) {
    .ta-root { margin: -20px -24px; }
    .ta-home, .ta-loading-shell { min-height: calc(100vh - 40px); }
    .ta-dash { height: calc(100vh - 40px); }
    .ta-content { padding: 24px 28px; }
    .ta-topbar, .ta-strip { padding-left: 20px; padding-right: 20px; }
    .ta-decision-big { font-size: 2.4rem; }
  }

  @media (max-width: 1024px) {
    /* 60px app topbar + main-content padding */
    .ta-root { margin: -20px -16px -90px; }
    .ta-home, .ta-loading-shell { min-height: calc(100vh - 100px); }
    .ta-dash { height: calc(100vh - 100px); }
    .ta-topbar { padding: 8px 16px; flex-wrap: wrap; }
    .ta-strip { padding: 8px 16px; }
    .ta-topbar-brand-text { display: none; }
  }

  @media (max-width: 768px) {
    .ta-topbar { min-height: 52px; gap: 8px; }
    .ta-topbar-left { gap: 8px; }
    .ta-topbar-title { font-size: 0.8rem; }
    .ta-topbar-ticker { font-size: 0.7rem; padding: 2px 8px; }
    .ta-topbar-meta { display: none; }
    .ta-reset-btn { padding: 6px 12px; font-size: 0.72rem; }
    .ta-reset-full { display: none; }
    .ta-reset-short { display: inline; }

    .ta-strip-label { display: none; }
    .ta-strip-group + .ta-strip-group { padding-left: 6px; }
    .ta-pill { font-size: 0.68rem; padding: 6px 10px; gap: 6px; }

    .ta-content { padding: 20px 16px; }
    .ta-report-card { padding: 20px 18px; border-radius: 10px; margin-bottom: 18px; }
    .ta-report-head { gap: 10px; margin-bottom: 16px; padding-bottom: 14px; }
    .ta-report-icon { width: 32px; height: 32px; }
    .ta-report-name { font-size: 0.95rem; }
    .ta-report-body { font-size: 0.86rem; line-height: 1.7; }
    .ta-streaming-word { display: none; }
    .ta-skeleton { padding: 20px 18px; }
    .ta-waiting { padding: 50px 16px; }

    .ta-decision { flex-direction: column; align-items: flex-start; gap: 14px; padding: 20px 18px; }
    .ta-decision-big { font-size: 2.6rem; }
    .ta-decision-ticker { font-size: 1.2rem; }

    .ta-home { padding: 32px 18px; }
    .ta-orb { width: 60px; height: 60px; margin-bottom: 28px; }
    .ta-orb svg { width: 26px; height: 26px; }
    .ta-home-sub { margin-bottom: 32px; font-size: 0.84rem; }
    .ta-search-input { padding: 15px 56px 15px 18px; font-size: 0.95rem; }
    .ta-search-btn { width: 40px; }
    .ta-chips { gap: 6px; margin-top: 20px; }
    .ta-chip { font-size: 0.72rem; padding: 6px 11px; }
    .ta-disclaimer { margin-top: 28px; }

    .ta-loading-card { padding: 26px 20px; border-radius: 12px; }
    .ta-loading-headline { font-size: 0.98rem; }
    .ta-agent-rows { gap: 10px; margin-bottom: 22px; }
    .ta-agent-label { font-size: 0.8rem; }
    .ta-badge { font-size: 0.63rem; padding: 3px 7px; }
  }

  @media (max-width: 480px) {
    .ta-root { margin: -16px -12px -90px; }
    .ta-home-title { font-size: 1.5rem; }
    .ta-search-input { font-size: 0.88rem; padding: 14px 52px 14px 16px; }
    .ta-chips { display: grid; grid-template-columns: repeat(4, 1fr); }
    .ta-chip { text-align: center; padding: 7px 4px; }
    .ta-decision-big { font-size: 2.1rem; }
    .ta-content { padding: 16px 12px; }
    .ta-report-card { padding: 16px 14px; }
    .ta-topbar, .ta-strip { padding-left: 12px; padding-right: 12px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ta-root *, .ta-root *::before, .ta-root *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
