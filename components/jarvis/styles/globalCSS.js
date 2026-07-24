export const globalCSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg-primary: #0a0f1c;
    --bg-secondary: #111827;
    --bg-tertiary: #1f2937;
    --bg-card: #1a2332;
    --border-color: rgba(255, 255, 255, 0.08);
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --accent-cyan: #06b6d4;
    --accent-blue: #3b82f6;
    --accent-emerald: #06b6d4;
    --accent-amber: #f59e0b;
    --accent-rose: #ef4444;
    --accent-purple: #8b5cf6;
    --sidebar-width: 260px;
    --topbar-height: 0px;
  }

  html { -webkit-text-size-adjust: 100%; }

  body {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }

  img, svg, canvas, video { max-width: 100%; }

  .sidebar {
    position: fixed; left: 0; top: 0;
    width: var(--sidebar-width); height: 100vh;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    padding: 20px 0;
    display: flex; flex-direction: column;
    z-index: 100;
    transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  }

  .logo { padding: 0 24px 24px; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; position: relative; }
  .logo h1 { font-size: 1.4em; font-weight: 700; display: flex; align-items: center; gap: 10px; }
  .logo h1 i { color: var(--accent-cyan); }
  .logo span { font-size: 0.7em; color: var(--text-muted); font-weight: 400; }

  .sidebar-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; }

  .nav-section { padding: 0 12px; margin-bottom: 24px; }
  .nav-section-title { font-size: 0.65em; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); padding: 0 12px; margin-bottom: 8px; }

  .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; }
  .nav-item:hover { background: rgba(255, 255, 255, 0.05); }
  .nav-item:focus-visible { outline: 2px solid var(--accent-cyan); outline-offset: -2px; }
  .nav-item.active { background: linear-gradient(90deg, rgba(6, 182, 212, 0.2), transparent); border-left: 3px solid var(--accent-cyan); }
  .nav-item i { width: 20px; text-align: center; color: var(--text-secondary); }
  .nav-item.active i { color: var(--accent-cyan); }
  .nav-item span { font-size: 0.85em; color: var(--text-secondary); }
  .nav-item.active span { color: var(--text-primary); font-weight: 500; }
  .nav-item .badge { margin-left: auto; background: var(--accent-rose); color: white; font-size: 0.65em; padding: 2px 6px; border-radius: 10px; font-weight: 600; }

  .sidebar-footer { margin-top: auto; padding: 20px 24px; border-top: 1px solid var(--border-color); }
  .user-info { display: flex; align-items: center; gap: 12px; }
  .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue)); display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; }
  .user-details h4 { font-size: 0.85em; font-weight: 500; }
  .user-details span { font-size: 0.7em; color: var(--text-muted); }

  /* Mobile shell — hidden on desktop */
  .mobile-topbar, .sidebar-close { display: none; }
  .sidebar-backdrop {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    opacity: 0; visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 99;
  }
  .sidebar-backdrop.show { opacity: 1; visibility: visible; }

  .main-content { margin-left: var(--sidebar-width); padding: 24px 32px; min-height: 100vh; }

  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 16px; }
  .header-left h2 { font-size: 1.5em; font-weight: 600; margin-bottom: 4px; }
  .header-left p { font-size: 0.8em; color: var(--text-muted); }
  .header-right { display: flex; align-items: center; gap: 16px; }
  .header-icons { display: flex; gap: 12px; flex-shrink: 0; }

  .search-box { display: flex; align-items: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 16px; width: 280px; }
  .search-box i { color: var(--text-muted); margin-right: 10px; }
  .search-box input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 0.85em; width: 100%; font-family: inherit; }
  .search-box input::placeholder { color: var(--text-muted); }

  .header-icon { width: 40px; height: 40px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; flex-shrink: 0; font-family: inherit; }
  .header-icon i { color: var(--text-secondary); }
  .header-icon:focus-visible { outline: 2px solid var(--accent-cyan); outline-offset: 2px; }
  .header-icon .notification-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: var(--accent-rose); border-radius: 50%; border: 2px solid var(--bg-card); }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
  .stat-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; min-width: 0; }
  .stat-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .stat-card-header h4 { font-size: 0.75em; color: var(--text-muted); font-weight: 400; }
  .stat-card-header i { color: var(--text-muted); font-size: 1em; }
  .stat-value { font-size: 1.8em; font-weight: 700; margin-bottom: 4px; }
  .stat-change { font-size: 0.75em; display: flex; align-items: center; gap: 4px; min-width: 0; }
  .stat-change span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stat-change.positive { color: var(--accent-emerald); }
  .stat-change.negative { color: var(--accent-rose); }
  .stat-change i { font-size: 0.9em; flex-shrink: 0; }

  .charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px; }
  .chart-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; min-width: 0; }
  .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; }
  .chart-header h3 { font-size: 1em; font-weight: 600; }
  .chart-tabs { display: flex; gap: 8px; }
  .chart-tab { padding: 6px 12px; border-radius: 6px; font-size: 0.7em; cursor: pointer; background: transparent; color: var(--text-muted); border: none; font-family: inherit; }
  .chart-tab.active { background: var(--accent-cyan); color: var(--bg-primary); font-weight: 500; }
  .chart-container { height: 260px; }
  .canvas-wrap { position: relative; height: 100%; width: 100%; min-height: 0; }
  .canvas-wrap canvas { display: block; }

  .holdings-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; }
  .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 12px; }
  .table-header h3 { font-size: 1em; font-weight: 600; }
  .table-actions { display: flex; gap: 8px; }
  .table-btn { padding: 6px 12px; border-radius: 6px; font-size: 0.7em; cursor: pointer; background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); font-family: inherit; }
  .table-btn:hover { background: rgba(255, 255, 255, 0.05); }
  .table-btn.primary { background: var(--accent-cyan); color: var(--bg-primary); border: none; }

  .table-scroll { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table-scroll table { min-width: 720px; }

  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 12px; font-size: 0.7em; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border-color); white-space: nowrap; }
  td { padding: 14px 12px; font-size: 0.8em; border-bottom: 1px solid var(--border-color); }
  tr:hover { background: rgba(255, 255, 255, 0.02); }

  .stock-info { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .stock-logo { width: 36px; height: 36px; border-radius: 8px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.7em; flex-shrink: 0; }
  .stock-details { min-width: 0; }
  .stock-details h4 { font-weight: 500; margin-bottom: 2px; }
  .stock-details span { font-size: 0.7em; color: var(--text-muted); }

  .pem-score { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 8px; font-weight: 600; font-size: 0.85em; flex-shrink: 0; }
  .pem-high   { background: rgba(6, 182, 212, 0.2); color: var(--accent-emerald); }
  .pem-medium { background: rgba(245, 158, 11, 0.2);  color: var(--accent-amber);   }
  .pem-low    { background: rgba(239, 68, 68, 0.2);   color: var(--accent-rose);    }

  .price-change          { font-weight: 500; }
  .price-change.positive { color: var(--accent-emerald); }
  .price-change.negative { color: var(--accent-rose); }

  .trend-bar { width: 60px; height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
  .trend-bar-fill { height: 100%; border-radius: 3px; background: var(--accent-emerald); }

  /* Phone holdings card list */
  .holdings-cards { display: flex; flex-direction: column; gap: 12px; }
  .holding-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 14px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.15s;
  }
  .holding-card:active { transform: scale(0.985); }
  .holding-card:focus-visible { outline: 2px solid var(--accent-cyan); outline-offset: 2px; }
  .holding-card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .holding-card-top .pem-score { width: 44px; height: 44px; }
  .holding-card-top .stock-details h4 { font-size: 0.95em; }
  .holding-card-top .stock-details span { display: block; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .holding-card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px; }
  .hc-item { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .hc-item label { font-size: 0.62em; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
  .hc-item span { font-size: 0.82em; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .holding-card-trend { display: flex; align-items: center; gap: 12px; }
  .holding-card-trend .trend-bar { flex: 1; width: auto; }
  .holding-card-trend i { color: var(--text-muted); font-size: 0.75em; }

  .ai-panel {
    position: fixed; right: 0; top: 0;
    width: 400px; height: 100vh;
    background: var(--bg-secondary);
    border-left: 1px solid var(--border-color);
    display: flex; flex-direction: column;
    z-index: 200;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
  }
  .ai-panel.open { transform: translateX(0); }

  .ai-header { padding: 20px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; }
  .ai-avatar { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ai-avatar i { font-size: 1.2em; color: white; }
  .ai-info h3 { font-size: 0.95em; font-weight: 600; }
  .ai-info span { font-size: 0.7em; color: var(--accent-emerald); display: flex; align-items: center; gap: 4px; }
  .ai-info span::before { content: ""; width: 6px; height: 6px; background: var(--accent-emerald); border-radius: 50%; }
  .ai-header-actions { margin-left: auto; display: flex; gap: 8px; }
  .ai-header-btn { width: 32px; height: 32px; border-radius: 8px; background: var(--bg-tertiary); border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .ai-header-btn:hover { background: var(--accent-cyan); color: var(--bg-primary); }

  .ai-messages { flex: 1; overflow-y: auto; padding: 20px; }
  .ai-message { margin-bottom: 16px; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
  .ai-message.user { text-align: right; }
  .message-bubble { display: inline-block; max-width: 85%; padding: 12px 16px; border-radius: 12px; font-size: 0.8em; line-height: 1.5; }
  .ai-message.bot .message-bubble  { background: var(--bg-card); border-radius: 4px 12px 12px 12px; text-align: left; }
  .ai-message.user .message-bubble { background: var(--accent-cyan); color: var(--bg-primary); border-radius: 12px 12px 4px 12px; }

  .ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .suggestion-chip { padding: 6px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 16px; font-size: 0.7em; cursor: pointer; transition: all 0.2s; }
  .suggestion-chip:hover { background: var(--accent-cyan); color: var(--bg-primary); border-color: var(--accent-cyan); }

  .ai-input { padding: 20px; border-top: 1px solid var(--border-color); }
  .input-container { display: flex; align-items: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 8px 16px; }
  .input-container input { flex: 1; background: none; border: none; outline: none; color: var(--text-primary); font-size: 0.85em; padding: 8px 0; font-family: inherit; min-width: 0; }
  .input-container input::placeholder { color: var(--text-muted); }
  .input-actions { display: flex; gap: 8px; }
  .input-actions button { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
  .input-actions button:hover { color: var(--accent-cyan); }
  .send-btn { background: var(--accent-cyan) !important; color: var(--bg-primary) !important; border-radius: 8px !important; padding: 8px !important; }

  .alerts-list { max-height: 300px; overflow-y: auto; }
  .alert-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 8px; background: var(--bg-card); cursor: pointer; transition: all 0.2s; }
  .alert-item:hover { background: var(--bg-tertiary); }
  .alert-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .alert-icon.warning { background: rgba(245, 158, 11, 0.2); color: var(--accent-amber); }
  .alert-icon.danger  { background: rgba(239, 68, 68, 0.2);  color: var(--accent-rose);  }
  .alert-icon.success { background: rgba(6, 182, 212, 0.2); color: var(--accent-emerald); }
  .alert-icon.info    { background: rgba(59, 130, 246, 0.2); color: var(--accent-blue);  }
  .alert-content { flex: 1; min-width: 0; }
  .alert-content h4 { font-size: 0.8em; font-weight: 500; margin-bottom: 4px; }
  .alert-content p { font-size: 0.7em; color: var(--text-muted); }
  .alert-time { font-size: 0.65em; color: var(--text-muted); flex-shrink: 0; }

  .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  .watchlist-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; border-radius: 8px; margin-bottom: 8px; background: var(--bg-tertiary); cursor: pointer; transition: all 0.2s; gap: 12px; }
  .watchlist-item:hover { background: rgba(255, 255, 255, 0.1); }
  .watchlist-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .watchlist-price h4 { font-size: 0.85em; font-weight: 500; margin-bottom: 2px; }
  .watchlist-price span { font-size: 0.7em; color: var(--text-muted); }
  .watchlist-right { text-align: right; flex-shrink: 0; }
  .watchlist-right .price { font-size: 0.85em; font-weight: 500; margin-bottom: 2px; }
  .watchlist-right .change { font-size: 0.7em; }

  .quick-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .quick-action { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--bg-tertiary); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
  .quick-action:hover { background: rgba(255, 255, 255, 0.1); }
  .quick-action i { font-size: 1.2em; color: var(--accent-cyan); flex-shrink: 0; }
  .quick-action span { font-size: 0.8em; }

  .compare-select { padding: 10px 16px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 0.85em; min-width: 180px; cursor: pointer; font-family: inherit; }
  .compare-select:focus { outline: none; border-color: var(--accent-cyan); }

  .compare-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; position: relative; overflow: hidden; min-width: 0; }
  .compare-card.winner { border-color: var(--accent-emerald); box-shadow: 0 0 20px rgba(6, 182, 212, 0.1); }
  .compare-card.winner::before { content: "TOP PICK"; position: absolute; top: 12px; right: -30px; background: var(--accent-emerald); color: white; font-size: 0.6em; font-weight: 700; padding: 4px 40px; transform: rotate(45deg); }
  .compare-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .compare-logo { width: 56px; height: 56px; border-radius: 12px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.2em; font-weight: 700; flex-shrink: 0; }
  .compare-stock-info h3 { font-size: 1.2em; margin-bottom: 4px; }
  .compare-stock-info span { font-size: 0.8em; color: var(--text-muted); }
  .compare-price { margin-left: auto; text-align: right; }
  .compare-price .price { font-size: 1.4em; font-weight: 700; }
  .compare-price .change { font-size: 0.85em; }
  .compare-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .compare-metric { background: var(--bg-tertiary); padding: 12px; border-radius: 8px; min-width: 0; }
  .compare-metric label { font-size: 0.65em; color: var(--text-muted); display: block; margin-bottom: 4px; }
  .compare-metric .value { font-size: 1.1em; font-weight: 600; }
  .compare-metric .winner-badge { display: inline-block; background: rgba(6, 182, 212, 0.2); color: var(--accent-emerald); font-size: 0.6em; padding: 2px 6px; border-radius: 4px; margin-left: 6px; }
  .compare-pem-bar { background: var(--bg-tertiary); border-radius: 8px; padding: 12px; margin-bottom: 16px; }
  .compare-pem-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .compare-pem-header span { font-size: 0.75em; color: var(--text-muted); }
  .compare-pem-header .score { font-size: 1.4em; font-weight: 700; }
  .compare-pem-track { height: 8px; background: var(--bg-primary); border-radius: 4px; overflow: hidden; }
  .compare-pem-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }

  .category-compare { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .category-compare h3 { font-size: 1em; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .category-row { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
  .category-row:last-child { border-bottom: none; }
  .category-name { width: 100px; font-size: 0.75em; color: var(--text-muted); flex-shrink: 0; }
  .category-bars { flex: 1; display: flex; gap: 8px; min-width: 0; }
  .category-bar-item { flex: 1; text-align: center; min-width: 0; }
  .category-bar-track { height: 24px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; margin-bottom: 4px; }
  .category-bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; font-size: 0.7em; font-weight: 600; min-width: 30px; }
  .category-bar-item .stock-label { font-size: 0.65em; color: var(--text-muted); }
  .winner-trophy { color: var(--accent-amber); }

  .allocation-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .allocation-color { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
  .allocation-info { flex: 1; min-width: 0; }
  .allocation-info h4 { font-size: 0.8em; font-weight: 500; margin-bottom: 2px; }
  .allocation-info span { font-size: 0.7em; color: var(--text-muted); }
  .allocation-percent { font-weight: 600; font-size: 0.85em; }

  .ai-toggle {
    position: fixed; right: 20px; bottom: 20px;
    width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 200;
    box-shadow: 0 8px 32px rgba(6, 182, 212, 0.4);
    transition: all 0.3s; border: none;
  }
  .ai-toggle:hover { transform: scale(1.1); }
  .ai-toggle i { font-size: 1.5em; color: white; }
  .ai-toggle.hidden { opacity: 0; pointer-events: none; }

  .skeleton { background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-card) 50%, var(--bg-tertiary) 75%); background-size: 200% 100%; animation: skeleton 1.5s infinite; border-radius: 4px; }
  @keyframes skeleton { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-secondary); }
  ::-webkit-scrollbar-thumb { background: var(--bg-tertiary); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

  .section { display: none; }
  .section.active { display: block; }

  .pem-detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px; }
  .pem-factor { background: var(--bg-tertiary); padding: 16px; border-radius: 10px; min-width: 0; }
  .pem-factor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .pem-factor-header h4 { font-size: 0.75em; color: var(--text-muted); }
  .pem-factor-value { font-size: 1.4em; font-weight: 600; }
  .pem-factor-change { font-size: 0.7em; }
  .pem-factor-change.positive { color: var(--accent-emerald); }
  .pem-factor-change.negative { color: var(--accent-rose); }

  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: none; align-items: center; justify-content: center; z-index: 300; }
  .modal-overlay.active { display: flex; }
  .modal { background: var(--bg-secondary); border-radius: 16px; width: 90%; max-width: 900px; max-height: 90vh; overflow: hidden; border: 1px solid var(--border-color); }
  .modal-header { padding: 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .modal-header h2 { font-size: 1.3em; }
  .modal-close { width: 36px; height: 36px; border-radius: 8px; background: var(--bg-tertiary); border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .modal-close:hover { background: var(--accent-rose); color: white; }
  .modal-body { padding: 24px; max-height: calc(90vh - 100px); overflow-y: auto; -webkit-overflow-scrolling: touch; }

  .stock-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
  .stock-header-logo { width: 64px; height: 64px; border-radius: 14px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.4em; font-weight: 700; flex-shrink: 0; }
  .stock-header-info h2 { font-size: 1.4em; margin-bottom: 4px; }
  .stock-header-info p { font-size: 0.85em; color: var(--text-muted); }
  .stock-price-info { margin-left: auto; text-align: right; }
  .stock-price-info .price { font-size: 1.8em; font-weight: 700; }
  .stock-price-info .change { font-size: 0.9em; }

  .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .metric-card { background: var(--bg-card); padding: 16px; border-radius: 10px; min-width: 0; }
  .metric-card label { font-size: 0.7em; color: var(--text-muted); display: block; margin-bottom: 4px; }
  .metric-card .value { font-size: 1.2em; font-weight: 600; }

  .analysis-section { margin-bottom: 24px; }
  .analysis-section h3 { font-size: 0.9em; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .ai-insight-box { background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 12px; padding: 20px; }
  .ai-insight-box .ai-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-cyan); color: var(--bg-primary); padding: 4px 10px; border-radius: 12px; font-size: 0.65em; font-weight: 600; margin-bottom: 12px; }
  .ai-insight-box p { font-size: 0.85em; line-height: 1.6; }

  .btn { padding: 10px 20px; border-radius: 8px; font-size: 0.8em; font-weight: 500; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; }
  .btn-primary   { background: var(--accent-cyan); color: var(--bg-primary); }
  .btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); }
  .btn:hover { opacity: 0.9; }

  /* ========================================= */
  /* TRADING AGENTS SPECIFIC CSS               */
  /* ========================================= */

  .ta-container { background: var(--bg-primary); min-height: 100vh; color: var(--text-primary); font-family: inherit; }

  .ta-home { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
  .ta-logo-circle { width: 64px; height: 64px; border-radius: 50%; border: 1px solid var(--border-color); background: var(--bg-card); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; color: var(--accent-emerald); }
  .ta-logo-circle svg { width: 32px; height: 32px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ta-title { font-size: 2.5em; font-weight: 700; margin-bottom: 32px; text-align: center; color: var(--text-primary); }
  .ta-form { width: 100%; max-width: 600px; position: relative; }
  .ta-input { width: 100%; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px 60px 20px 24px; font-size: 1.1em; color: var(--text-primary); outline: none; transition: border-color 0.2s; font-family: inherit; }
  .ta-input::placeholder { color: var(--text-muted); }
  .ta-input:focus { border-color: var(--accent-emerald); }
  .ta-submit { position: absolute; right: 8px; top: 8px; bottom: 8px; width: 48px; border-radius: 8px; background: var(--accent-emerald); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--bg-primary); transition: opacity 0.2s; }
  .ta-submit:hover { opacity: 0.9; }
  .ta-submit svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ta-hint { margin-top: 32px; color: var(--text-muted); font-size: 0.9em; text-align: center; line-height: 1.6; }
  .ta-hint span { color: var(--accent-emerald); cursor: pointer; }
  .ta-hint small { display: block; margin-top: 8px; font-size: 0.8em; color: var(--text-secondary); }
  .ta-error { color: var(--accent-rose); margin-top: 16px; font-size: 0.9em; }

  .ta-loading-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg-secondary); padding: 20px; }
  .ta-loading-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 32px; width: 100%; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .ta-loading-title { font-size: 1.2em; font-weight: 600; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .ta-spinner { color: var(--accent-emerald); animation: ta-spin 1s linear infinite; display: inline-block; font-size: 1.2em; }
  @keyframes ta-spin { 100% { transform: rotate(360deg); } }
  .ta-agent-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
  .ta-agent-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.9em; gap: 12px; }
  .ta-agent-name { color: var(--text-muted); }
  .ta-agent-name.active { color: var(--text-primary); }
  .ta-status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; border: 1px solid transparent; flex-shrink: 0; }
  .ta-status-badge.waiting { color: var(--text-muted); }
  .ta-status-badge.pending { color: var(--accent-amber); background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); animation: ta-pulse 1.5s infinite; }
  .ta-status-badge.done { color: var(--accent-emerald); background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
  @keyframes ta-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  .ta-progress-bg { height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; }
  .ta-progress-fill { height: 100%; background: var(--accent-emerald); transition: width 0.1s linear; }

  .ta-dashboard { display: flex; height: 100vh; overflow: hidden; background: var(--bg-primary); }
  .ta-sidebar-left { width: 260px; background: var(--bg-secondary); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; flex-shrink: 0; }
  .ta-sidebar-right { width: 320px; background: var(--bg-secondary); border-left: 1px solid var(--border-color); display: flex; flex-direction: column; flex-shrink: 0; }
  .ta-main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  .ta-header-bar { padding: 16px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); gap: 12px; }
  .ta-header-title { font-size: 1.1em; font-weight: 600; }
  .ta-btn-outline { background: rgba(6, 182, 212, 0.1); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3); padding: 8px 16px; border-radius: 6px; font-size: 0.85em; cursor: pointer; font-family: inherit; transition: background 0.2s; flex-shrink: 0; }
  .ta-btn-outline:hover { background: rgba(6, 182, 212, 0.2); }
  .ta-sidebar-header { padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; font-size: 0.85em; font-weight: 700; letter-spacing: 0.1em; color: var(--text-primary); text-transform: uppercase; }
  .ta-sidebar-header svg { width: 20px; height: 20px; color: var(--accent-emerald); fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ta-sidebar-content { padding: 16px; overflow-y: auto; flex: 1; }
  .ta-section-title { font-size: 0.7em; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }

  .ta-menu-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .ta-menu-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 6px; font-size: 0.85em; cursor: pointer; transition: background 0.2s; color: var(--text-secondary); }
  .ta-menu-item:hover { background: var(--bg-tertiary); color: var(--text-primary); }
  .ta-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-emerald); flex-shrink: 0; }

  .ta-content-scroll { flex: 1; overflow-y: auto; padding: 32px; }
  .ta-report-container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }

  .ta-decision-box { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  .ta-decision-label { font-size: 0.8em; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 12px; font-weight: 600; }
  .ta-decision-value { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; }
  .ta-decision-status { font-size: 2.5em; font-weight: 700; }
  .ta-decision-status.buy { color: var(--accent-emerald); }
  .ta-decision-status.sell { color: var(--accent-rose); }
  .ta-decision-status.hold { color: var(--accent-amber); }
  .ta-decision-price { font-size: 1.5em; color: var(--text-secondary); }

  .ta-report-section h3 { font-size: 1.2em; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 16px; color: var(--text-primary); }
  .ta-report-text { background: var(--bg-card); border: 1px solid var(--border-color); padding: 24px; border-radius: 8px; color: var(--text-secondary); line-height: 1.6; font-size: 0.95em; }

  .ta-analyst-grid { display: flex; flex-direction: column; gap: 16px; }
  .ta-analyst-card { background: var(--bg-card); border: 1px solid var(--border-color); border-left: 4px solid var(--accent-emerald); border-radius: 8px; padding: 16px 20px; }
  .ta-analyst-card h4 { color: var(--accent-emerald); font-size: 0.9em; margin-bottom: 8px; font-weight: 600; }
  .ta-analyst-card p { font-size: 0.9em; color: var(--text-secondary); line-height: 1.5; }

  .ta-btn-solid { width: 100%; background: var(--accent-emerald); color: var(--bg-primary); border: none; padding: 12px; border-radius: 6px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; font-family: inherit; margin-bottom: 24px; }
  .ta-btn-solid:hover { opacity: 0.9; }
  .ta-config-list { display: flex; flex-direction: column; gap: 12px; font-size: 0.85em; color: var(--text-secondary); }
  .ta-config-label { color: var(--text-muted); margin-right: 8px; }
  .ta-config-value { color: var(--text-primary); }
  .ta-config-code { background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: var(--text-primary); }
  .ta-log-box { background: var(--bg-card); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; font-size: 0.8em; color: var(--text-muted); font-style: italic; text-align: center; margin-top: 16px; }

  /* ========================================= */
  /* RESPONSIVE — 1440px : large desktop       */
  /* ========================================= */

  @media (max-width: 1440px) {
    .main-content { padding: 24px 28px; }
    .stats-grid { gap: 16px; }
    .charts-row { gap: 16px; }
  }

  /* ========================================= */
  /* RESPONSIVE — 1280px : small desktop       */
  /* ========================================= */

  @media (max-width: 1280px) {
    :root { --sidebar-width: 220px; }

    .main-content { padding: 20px 24px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-row { grid-template-columns: 1fr; }
    .chart-container { height: 300px; }
    .chart-container.allocation { height: 320px; }
    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
    .pem-detail-grid { grid-template-columns: repeat(2, 1fr); }
    .ai-panel { width: 360px; }
    .ta-sidebar-right { width: 280px; }
  }

  /* ========================================= */
  /* RESPONSIVE — 1024px : tablet, drawer nav  */
  /* ========================================= */

  @media (max-width: 1024px) {
    .mobile-topbar {
      display: flex; align-items: center; gap: 14px;
      position: sticky; top: 0; z-index: 90;
      height: 60px; padding: 0 16px;
      background: rgba(17, 24, 39, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
    }
    .hamburger {
      width: 40px; height: 40px; flex-shrink: 0;
      border-radius: 10px; border: 1px solid var(--border-color);
      background: var(--bg-card); color: var(--text-primary);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 1em; transition: all 0.2s;
    }
    .hamburger:active { transform: scale(0.94); background: var(--bg-tertiary); }
    .mobile-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 1.05em; letter-spacing: -0.01em; }
    .mobile-logo i { color: var(--accent-cyan); }
    .mobile-avatar {
      margin-left: auto; width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
      display: flex; align-items: center; justify-content: center;
      font-size: 0.72em; font-weight: 700;
    }

    .sidebar { width: 280px; transform: translateX(-100%); box-shadow: 4px 0 32px rgba(0,0,0,0.5); }
    .sidebar.open { transform: translateX(0); }
    .sidebar-close {
      display: flex; align-items: center; justify-content: center;
      position: absolute; top: -4px; right: 20px;
      width: 34px; height: 34px; border-radius: 8px;
      background: var(--bg-tertiary); border: none;
      color: var(--text-secondary); cursor: pointer;
    }
    .sidebar-close:hover { background: var(--accent-rose); color: #fff; }
    .nav-item { padding: 14px 12px; }
    .nav-item span { font-size: 0.9em; }

    .main-content { margin-left: 0; padding: 20px 16px 90px; }

    .header { flex-direction: column; align-items: stretch; gap: 16px; margin-bottom: 24px; }
    .header-right { flex-wrap: wrap; gap: 12px; justify-content: space-between; }
    .search-box { flex: 1; min-width: 200px; width: auto; }

    .two-column { grid-template-columns: 1fr; }
    .compare-metrics { grid-template-columns: repeat(2, 1fr); }
  }

  /* ========================================= */
  /* RESPONSIVE — 768px : phones               */
  /* ========================================= */

  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .stat-card { padding: 16px; }
    .stat-value { font-size: 1.4em; }
    .stat-change { font-size: 0.7em; }

    .chart-card { padding: 16px 14px; }
    .chart-header { flex-wrap: wrap; gap: 12px; margin-bottom: 14px; }
    .chart-header h3 { font-size: 0.92em; }
    .chart-tabs { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 2px; scrollbar-width: none; }
    .chart-tabs::-webkit-scrollbar { display: none; }
    .chart-tab { flex-shrink: 0; padding: 7px 13px; }
    .chart-container { height: 240px; }
    .chart-container.allocation { height: 290px; }

    .holdings-card { padding: 16px 14px; }
    .table-header { flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
    .table-actions { width: 100%; }
    .table-btn { flex: 1; min-width: 0; text-align: center; padding: 9px 12px; }

    .quick-actions { grid-template-columns: 1fr; }
    .metrics-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .pem-detail-grid { grid-template-columns: 1fr; }

    /* Compare section */
    .compare-card { padding: 18px; }
    .compare-header { flex-wrap: wrap; gap: 12px; }
    .compare-price { margin-left: 0; width: 100%; text-align: left; }
    .compare-metrics { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .compare-select { width: 100%; min-width: 0; }
    .category-compare { padding: 18px 16px; }
    .category-row { flex-direction: column; align-items: stretch; gap: 8px; }
    .category-name { width: auto; }

    /* AI panel goes full screen */
    .ai-panel { width: 100%; }
    .ai-messages { padding: 16px; }
    .ai-input { padding: 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
    .message-bubble { max-width: 90%; }
    .ai-toggle { width: 52px; height: 52px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); }
    .ai-toggle i { font-size: 1.25em; }

    /* Modal goes full screen */
    .modal { width: 100%; height: 100%; max-height: 100vh; border-radius: 0; }
    .modal-header { padding: 16px; }
    .modal-header h2 { font-size: 1.1em; }
    .modal-body { max-height: calc(100vh - 70px); padding: 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
    .stock-header { flex-wrap: wrap; gap: 14px; margin-bottom: 18px; }
    .stock-header-logo { width: 52px; height: 52px; font-size: 1.15em; }
    .stock-price-info { margin-left: 0; width: 100%; text-align: left; }
    .stock-price-info .price { font-size: 1.5em; }

    /* Trading agents */
    .ta-dashboard { flex-direction: column; height: auto; min-height: 100vh; overflow: visible; }
    .ta-sidebar-left, .ta-sidebar-right { width: 100%; border-left: none; border-right: none; border-bottom: 1px solid var(--border-color); }
    .ta-sidebar-content { max-height: 260px; }
    .ta-main-area { overflow: visible; }
    .ta-content-scroll { padding: 20px 16px; overflow: visible; }
    .ta-report-container { gap: 24px; }
    .ta-header-bar { padding: 14px 16px; }
    .ta-title { font-size: 1.7em; }
    .ta-input { padding: 16px 56px 16px 18px; font-size: 1em; }
    .ta-loading-card { padding: 24px 20px; }
    .ta-decision-box { padding: 18px; }
    .ta-decision-status { font-size: 2em; }
    .ta-decision-price { font-size: 1.2em; }
    .ta-report-text { padding: 18px 16px; font-size: 0.9em; }
  }

  /* ========================================= */
  /* RESPONSIVE — 480px : small phones         */
  /* ========================================= */

  @media (max-width: 480px) {
    .main-content { padding: 16px 12px 90px; }
    .stats-grid { grid-template-columns: 1fr; }
    .metrics-grid { grid-template-columns: 1fr; }
    .compare-metrics { grid-template-columns: 1fr; }
    .header-left h2 { font-size: 1.25em; }
    .chart-container { height: 210px; }
    .chart-container.allocation { height: 270px; }
    .ta-decision-status { font-size: 1.8em; }
    .ta-title { font-size: 1.45em; }
  }

  @media (max-width: 420px) {
    .holding-card-grid { grid-template-columns: repeat(2, 1fr); gap: 12px 10px; }
    .holding-card-top .stock-details span { max-width: 110px; }
  }

  /* ========================================= */
  /* Landscape phones & reduced motion         */
  /* ========================================= */

  @media (max-height: 480px) and (orientation: landscape) {
    .sidebar { padding: 12px 0; }
    .logo { padding-bottom: 14px; margin-bottom: 12px; }
    .chart-container { height: 200px; }
    .ta-home { min-height: auto; padding: 40px 20px; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }


  /* ===== StockAnalysis inside main-content ===== */

  .ta-section { margin: -24px -32px; }
  .ta-home, .ta-loading-wrapper { min-height: calc(100vh - 48px); }
  .ta-dashboard { height: calc(100vh - 48px); }

  .ta-chevron { display: none; margin-left: auto; }
  .ta-chevron svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .ta-sidebar-toggle { width: 100%; background: none; text-align: left; cursor: default; font-family: inherit; }

  .ta-loading-text strong { color: var(--accent-emerald); }
  .ta-header-title strong { color: var(--accent-emerald); }

  .ta-ticker-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 20px; max-width: 600px; }
  .ta-chip {
    padding: 8px 16px; border-radius: 20px;
    background: var(--bg-tertiary); border: 1px solid var(--border-color);
    color: var(--text-secondary); font-size: 0.8em; font-family: inherit;
    cursor: pointer; transition: all 0.2s;
  }
  .ta-chip:hover { background: var(--accent-emerald); color: var(--bg-primary); border-color: var(--accent-emerald); }
  .ta-chip:active { transform: scale(0.95); }


  .holding-card-headline { text-align: right; flex-shrink: 0; }
  .hc-price { font-size: 0.95em; font-weight: 700; margin-bottom: 2px; }
  .holding-card-headline .price-change { font-size: 0.78em; }

  .holding-card-footer { display: flex; align-items: center; gap: 12px; }
  .holding-card-footer .trend-bar { flex: 1; width: auto; }
  .holding-card-footer .pem-score { width: 38px; height: 38px; font-size: 0.8em; }
  .holding-card-footer .table-btn { flex-shrink: 0; padding: 8px 16px; }
  .hc-chevron { color: var(--text-muted); font-size: 0.75em; }

  @media (max-width: 768px) {
    .holding-card-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 400px) {
    .holding-card-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 1280px) {
    .ta-section { margin: -20px -24px; }
    .ta-home, .ta-loading-wrapper { min-height: calc(100vh - 40px); }
    .ta-dashboard { height: calc(100vh - 40px); }
  }

  @media (max-width: 1024px) {
    /* topbar (60px) + main-content padding */
    .ta-section { margin: -20px -16px -90px; }
    .ta-home, .ta-loading-wrapper { min-height: calc(100vh - 100px); }
    .ta-dashboard { height: calc(100vh - 100px); }
  }

  @media (max-width: 768px) {
    .ta-dashboard { height: auto; min-height: calc(100vh - 100px); }
    .ta-sidebar-toggle { cursor: pointer; }
    .ta-sidebar-toggle:active { background: var(--bg-tertiary); }
    .ta-chevron { display: flex; align-items: center; }
    .ta-sidebar-content { max-height: none; padding: 12px 16px 16px; }
    .ta-menu-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .ta-menu-item { font-size: 0.78em; padding: 10px; }

    .ta-header-bar { flex-direction: column; align-items: stretch; gap: 12px; }
    .ta-header-title { font-size: 1em; }
    .ta-btn-outline { width: 100%; padding: 11px 16px; }

    .ta-home { padding: 32px 16px; }
    .ta-logo-circle { width: 52px; height: 52px; margin-bottom: 24px; }
    .ta-logo-circle svg { width: 26px; height: 26px; }
    .ta-form { max-width: 100%; }
    .ta-ticker-chips { margin-top: 16px; }
    .ta-hint { margin-top: 24px; font-size: 0.8em; }
  }

  @media (max-width: 480px) {
    .ta-section { margin: -16px -12px -90px; }
    .ta-menu-list { grid-template-columns: 1fr; }
    .ta-loading-title { font-size: 1em; }
    .ta-agent-row { font-size: 0.82em; }
  }


  /* ===== SectionOthers shared ===== */

  .section-title-icon { margin-right: 8px; }
  .section-gap { margin-top: 24px; }
  .stats-grid-secondary { margin-top: 20px; }

  .insight-card { margin-bottom: 24px; border-left: 4px solid var(--accent-cyan); }
  .insight-purple { border-left-color: var(--accent-purple); }
  .insight-amber  { border-left-color: var(--accent-amber); }
  .insight-rose   { border-left-color: var(--accent-rose); }
  .insight-title { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 1em; }
  .insight-body { font-size: 0.9em; line-height: 1.7; color: var(--text-secondary); }
  .insight-loading { opacity: 0.6; font-style: italic; }

  .header-actions { display: flex; gap: 12px; flex-wrap: wrap; }

  /* Transactions */
  .tx-list { display: flex; flex-direction: column; }
  .tx-row { display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid var(--border-color); }
  .tx-row:last-child { border-bottom: none; }
  .tx-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tx-body { flex: 1; min-width: 0; }
  .tx-body h4 { font-size: 0.85em; font-weight: 500; }
  .tx-body span { font-size: 0.7em; color: var(--text-muted); }
  .tx-date { font-size: 0.7em; color: var(--text-muted); flex-shrink: 0; }

  /* Opportunities */
  .opp-list { margin-top: 20px; display: flex; flex-direction: column; gap: 16px; }
  .opp-card {
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 12px; padding: 20px; cursor: pointer;
    display: flex; align-items: center; gap: 20px;
    transition: border-color 0.2s, transform 0.15s;
  }
  .opp-card:hover { border-color: var(--accent-cyan); }
  .opp-card:active { transform: scale(0.995); }
  .opp-card:focus-visible { outline: 2px solid var(--accent-cyan); outline-offset: 2px; }
  .opp-main { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
  .opp-logo { width: 50px; height: 50px; font-size: 1em; }
  .opp-text { min-width: 0; }
  .opp-text h4 { font-size: 1em; margin-bottom: 4px; }
  .opp-ticker { color: var(--text-muted); font-weight: 400; }
  .opp-text p { font-size: 0.8em; color: var(--text-secondary); line-height: 1.5; }
  .opp-metrics { display: flex; gap: 24px; flex-shrink: 0; }
  .opp-metric { text-align: right; }
  .opp-metric .pem-score { margin-bottom: 8px; }
  .opp-conviction { font-size: 0.75em; font-weight: 500; display: block; }
  .opp-upside-value { font-size: 1.1em; font-weight: 600; color: var(--accent-emerald); }
  .opp-upside-label { font-size: 0.7em; color: var(--text-muted); }

  /* Risk alerts */
  .risk-alert { display: flex; align-items: flex-start; padding: 16px; background: var(--bg-tertiary); border-radius: 10px; margin-bottom: 12px; border-left: 3px solid; }
  .risk-alert-rose  { border-left-color: var(--accent-rose); }
  .risk-alert-amber { border-left-color: var(--accent-amber); }
  .risk-alert-blue  { border-left-color: var(--accent-blue); }
  .risk-alert-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; }
  .risk-alert-rose  .risk-alert-icon { background: rgba(239,68,68,0.2); color: var(--accent-rose); }
  .risk-alert-amber .risk-alert-icon { background: rgba(245,158,11,0.2); color: var(--accent-amber); }
  .risk-alert-blue  .risk-alert-icon { background: rgba(59,130,246,0.2); color: var(--accent-blue); }
  .risk-alert-body { flex: 1; min-width: 0; }
  .risk-alert-title { font-weight: 600; font-size: 0.85em; margin-bottom: 4px; }
  .risk-alert-msg { font-size: 0.75em; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.5; }
  .risk-alert-action { font-size: 0.7em; color: var(--accent-cyan); }
  .risk-alert-action i { margin-right: 4px; }
  .risk-chart-container { height: 250px; }

  /* Heatmap */
  .heatmap-grid { display: grid; grid-template-columns: repeat(9, 1fr); gap: 8px; }
  .heatmap-cell { text-align: center; cursor: pointer; }
  .heatmap-cell:focus-visible { outline: 2px solid var(--accent-cyan); outline-offset: 2px; border-radius: 8px; }
  .heatmap-tile { width: 100%; aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
  .heatmap-tile span { font-weight: 700; font-size: 0.9em; }
  .heatmap-low    { background: rgba(16,185,129,0.6); }
  .heatmap-medium { background: rgba(245,158,11,0.6); }
  .heatmap-high   { background: rgba(239,68,68,0.6); }
  .heatmap-risk, .heatmap-return { font-size: 0.65em; }
  .heatmap-risk { color: var(--text-muted); }
  .heatmap-legend { display: flex; justify-content: center; flex-wrap: wrap; gap: 24px; margin-top: 16px; font-size: 0.7em; }
  .legend-item { display: flex; align-items: center; gap: 6px; }
  .legend-swatch { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }

  /* Suggestions */
  .suggestion-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .suggestion-card { background: var(--bg-tertiary); padding: 20px; border-radius: 10px; }
  .suggestion-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .suggestion-head i { color: var(--accent-amber); font-size: 1.2em; }
  .suggestion-head span { font-weight: 600; font-size: 0.85em; }
  .suggestion-card p { font-size: 0.8em; color: var(--text-secondary); line-height: 1.5; }

  /* Sentiment */
  .sentiment-container { display: flex; align-items: center; justify-content: center; }
  .sentiment-block { text-align: center; }
  .sentiment-headline { font-size: 4em; font-weight: 700; color: var(--accent-emerald); line-height: 1; }
  .sentiment-caption { color: var(--text-muted); font-size: 0.85em; margin-top: 6px; }
  .sentiment-splits { display: flex; gap: 20px; justify-content: center; margin-top: 20px; }
  .sentiment-split div { font-size: 1.5em; font-weight: 600; }
  .sentiment-split span { font-size: 0.7em; color: var(--text-muted); }

  /* Screener */
  .screener-card { margin-bottom: 24px; }
  .screener-toggle {
    display: flex; align-items: center; gap: 10px; width: 100%;
    background: none; border: none; color: inherit; font-family: inherit;
    padding: 0; margin-bottom: 20px; cursor: default; text-align: left;
  }
  .screener-toggle h3 { font-size: 1em; font-weight: 600; }
  .filter-count { background: var(--accent-cyan); color: var(--bg-primary); font-size: 0.65em; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
  .screener-chevron { display: none; margin-left: auto; color: var(--text-muted); transition: transform 0.2s; }
  .screener-chevron.open { transform: rotate(180deg); }
  .filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .filter-field label { font-size: 0.7em; color: var(--text-muted); display: block; margin-bottom: 8px; }
  .filter-field select {
    width: 100%; padding: 10px;
    background: var(--bg-tertiary); border: 1px solid var(--border-color);
    border-radius: 8px; color: var(--text-primary);
    font-size: 0.85em; font-family: inherit;
  }
  .filter-field select:focus { outline: none; border-color: var(--accent-cyan); }
  .screener-apply { margin-top: 20px; }

  .table-action-btn { padding: 6px 12px; font-size: 0.7em; }
  .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .empty-state i { font-size: 2em; margin-bottom: 12px; opacity: 0.4; }
  .empty-state p { font-size: 0.85em; }

  /* ===== SectionOthers responsive ===== */

  @media (max-width: 1280px) {
    .heatmap-grid { grid-template-columns: repeat(6, 1fr); }
    .suggestion-grid { grid-template-columns: repeat(2, 1fr); }
    .filter-grid { grid-template-columns: repeat(2, 1fr); }
    .risk-chart-container { height: 300px; }
  }

  @media (max-width: 1024px) {
    .opp-metrics { gap: 16px; }
    .sentiment-headline { font-size: 3em; }
  }

  @media (max-width: 768px) {
    .header-actions { width: 100%; }
    .header-actions .btn { flex: 1; justify-content: center; }

    .insight-card { padding: 16px 14px; }
    .insight-body { font-size: 0.85em; }

    /* Opportunity cards stack */
    .opp-card { flex-direction: column; align-items: stretch; gap: 14px; padding: 16px; }
    .opp-metrics { justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 1px solid var(--border-color); }
    .opp-metric { display: flex; align-items: center; gap: 10px; text-align: left; }
    .opp-metric .pem-score { margin-bottom: 0; }
    .opp-upside { flex-direction: column; align-items: flex-end; gap: 0; text-align: right; }

    .heatmap-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .heatmap-tile span { font-size: 0.8em; }
    .heatmap-legend { gap: 14px; }

    .suggestion-grid { grid-template-columns: 1fr; }
    .suggestion-card { padding: 16px; }

    .risk-alert { padding: 14px; }
    .risk-chart-container { height: 280px; }

    .sentiment-container { height: auto; padding: 20px 0; }
    .sentiment-headline { font-size: 2.6em; }
    .sentiment-splits { gap: 16px; }
    .sentiment-split div { font-size: 1.2em; }

    /* Screener becomes an accordion */
    .screener-toggle { cursor: pointer; margin-bottom: 0; padding: 4px 0; }
    .screener-chevron { display: block; }
    .filter-grid { grid-template-columns: 1fr; gap: 12px; margin-top: 16px; }
    .filter-field select { padding: 12px 10px; font-size: 0.9em; }
    .screener-apply { width: 100%; justify-content: center; margin-top: 16px; }

    .tx-row { padding: 12px 8px; }
  }

  @media (max-width: 480px) {
    .heatmap-grid { grid-template-columns: repeat(3, 1fr); }
    .sentiment-headline { font-size: 2.2em; }
    .opp-text h4 { font-size: 0.92em; }
  }


  /* ===== Smart Compare ===== */

  .compare-selector-card { margin-bottom: 24px; }
  .compare-selector-label { font-size: 0.85em; color: var(--text-muted); display: block; margin-bottom: 14px; }
  .compare-selector-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .compare-selector-row .compare-select { flex: 1; min-width: 180px; }
  .compare-reset { margin-left: auto; flex-shrink: 0; }

  .compare-presets-card { margin-bottom: 24px; }
  .compare-presets { display: flex; gap: 12px; flex-wrap: wrap; }

  .compare-empty { text-align: center; padding: 60px 20px; }
  .compare-empty i { font-size: 4em; color: var(--text-muted); margin-bottom: 20px; display: block; }
  .compare-empty h3 { color: var(--text-muted); margin-bottom: 8px; }
  .compare-empty p { color: var(--text-muted); font-size: 0.85em; }

  .compare-ai-card { margin-bottom: 24px; }
  .compare-loading { opacity: 0.6; font-style: italic; font-size: 0.9em; }
  .compare-loading i { margin-right: 8px; }
  .compare-verdict { font-size: 0.95em; line-height: 1.7; color: var(--text-secondary); }
  .compare-verdict-pre { white-space: pre-line; }
  .compare-verdict p { margin-bottom: 10px; }
  .compare-verdict p:last-child { margin-bottom: 0; }

  .compare-grid { display: grid; gap: 20px; margin-bottom: 24px; }
  .compare-grid[data-count="2"] { grid-template-columns: repeat(2, 1fr); }
  .compare-grid[data-count="3"] { grid-template-columns: repeat(3, 1fr); }

  .compare-value-sm { font-size: 0.9em; }
  .compare-metrics-triple { grid-template-columns: repeat(3, 1fr); }
  .compare-metric-centered { text-align: center; }
  .compare-trophy { font-size: 0.7em; }
  .compare-sector { font-size: 0.75em; color: var(--text-muted); margin-top: 8px; display: flex; align-items: center; gap: 5px; }

  .compare-insights { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .compare-insight { background: var(--bg-tertiary); padding: 16px; border-radius: 10px; }
  .compare-insight-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .compare-insight-head span { font-weight: 600; font-size: 0.85em; }
  .compare-insight p { font-size: 0.8em; color: var(--text-secondary); line-height: 1.5; }

  /* ===== Compare responsive ===== */

  @media (max-width: 1280px) {
    .compare-grid[data-count="3"] { grid-template-columns: repeat(2, 1fr); }
    .compare-card { padding: 20px; }
  }

  @media (max-width: 1024px) {
    .compare-selector-row .compare-select { min-width: calc(50% - 8px); }
    .compare-reset { margin-left: 0; }
  }

  @media (max-width: 768px) {
    /* One card per row — the winner ribbon and 2-col metrics still fit */
    .compare-grid[data-count="2"],
    .compare-grid[data-count="3"] { grid-template-columns: 1fr; gap: 16px; }

    .compare-selector-card, .compare-presets-card, .compare-ai-card { padding: 16px 14px; }
    .compare-selector-row { flex-direction: column; align-items: stretch; gap: 10px; }
    .compare-selector-row .compare-select { width: 100%; min-width: 0; padding: 12px 14px; font-size: 0.9em; }
    .compare-reset { width: 100%; justify-content: center; margin-top: 4px; }

    .compare-presets { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .compare-presets .btn { justify-content: center; padding: 11px 10px; font-size: 0.75em; }

    .compare-empty { padding: 40px 16px; }
    .compare-empty i { font-size: 2.8em; margin-bottom: 14px; }
    .compare-empty h3 { font-size: 0.95em; }

    .compare-card { padding: 16px; }
    .compare-header { flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
    .compare-logo { width: 46px; height: 46px; font-size: 1em; }
    .compare-stock-info h3 { font-size: 1.05em; }
    .compare-price { margin-left: auto; }
    .compare-price .price { font-size: 1.15em; }
    .compare-metrics { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .compare-metrics-triple { grid-template-columns: repeat(3, 1fr); }
    .compare-metric { padding: 10px; }
    .compare-metric .value { font-size: 0.95em; }
    .compare-card.winner::before { font-size: 0.55em; padding: 4px 36px; }

    /* Factor bars stack: label above, bars below */
    .category-compare { padding: 16px 14px; }
    .category-row { flex-direction: column; align-items: stretch; gap: 8px; padding: 14px 0; }
    .category-name { width: auto; font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.05em; }
    .category-bars { gap: 6px; }
    .category-bar-track { height: 22px; }
    .category-bar-fill { font-size: 0.65em; padding-right: 6px; }

    .compare-insights { grid-template-columns: 1fr; gap: 12px; }
    .compare-verdict { font-size: 0.88em; }
  }

  @media (max-width: 480px) {
    .compare-presets { grid-template-columns: 1fr; }
    .compare-metrics { grid-template-columns: repeat(2, 1fr); }
    .compare-price { width: 100%; margin-left: 0; text-align: left; }
  }

  /* ===== Market Intelligence ===== */

  .insight-blue { border-left-color: var(--accent-blue); }

  .market-summary-layout { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
  .market-summary-text { flex: 1; min-width: 0; }

  .sentiment-badge { background: var(--bg-tertiary); padding: 12px 16px; border-radius: 8px; text-align: right; flex-shrink: 0; }
  .sentiment-badge-label { font-size: 0.65em; color: var(--text-muted); margin-bottom: 4px; white-space: nowrap; }
  .sentiment-badge-value { font-size: 1.4em; font-weight: 700; color: var(--accent-emerald); }

  .stats-grid-five { grid-template-columns: repeat(5, 1fr); margin-bottom: 24px; }
  .stat-value-sm { font-size: 1.4em; }

  .charts-row-market { grid-template-columns: 1.5fr 1fr; }
  .sector-chart-container { height: 280px; }

  /* Movers */
  .mover-list { display: flex; flex-direction: column; }
  .mover-row { display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.2s; }
  .mover-row:last-child { border-bottom: none; }
  .mover-row:hover { background: rgba(255,255,255,0.03); }
  .mover-row:focus-visible { outline: 2px solid var(--accent-cyan); outline-offset: -2px; border-radius: 6px; }
  .mover-logo { width: 36px; height: 36px; flex-shrink: 0; }
  .mover-body { flex: 1; min-width: 0; }
  .mover-symbol { font-weight: 500; font-size: 0.85em; margin-bottom: 2px; }
  .mover-reason { font-size: 0.7em; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mover-numbers { text-align: right; flex-shrink: 0; }
  .mover-change { font-weight: 600; font-size: 0.9em; margin-bottom: 2px; }
  .mover-price { font-size: 0.7em; color: var(--text-muted); }

  /* Events */
  .events-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  .event-card { background: var(--bg-tertiary); padding: 16px; border-radius: 10px; text-align: center; min-width: 0; }
  .event-date { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.65em; margin-bottom: 8px; white-space: nowrap; }
  .event-positive .event-date { background: rgba(16,185,129,0.2); color: var(--accent-emerald); }
  .event-neutral  .event-date { background: rgba(245,158,11,0.2); color: var(--accent-amber); }
  .event-title { font-weight: 600; font-size: 0.8em; margin-bottom: 4px; line-height: 1.4; }
  .event-impact { font-size: 0.7em; color: var(--text-muted); line-height: 1.4; }

  /* ===== Market responsive ===== */

  @media (max-width: 1440px) {
    .stats-grid-five { grid-template-columns: repeat(5, 1fr); gap: 14px; }
    .stat-value-sm { font-size: 1.25em; }
  }

  @media (max-width: 1280px) {
    .stats-grid-five { grid-template-columns: repeat(3, 1fr); }
    .charts-row-market { grid-template-columns: 1fr; }
    .events-grid { grid-template-columns: repeat(3, 1fr); }
    .sector-chart-container { height: 320px; }
  }

  @media (max-width: 1024px) {
    .market-summary-layout { gap: 16px; }
    .sentiment-badge { padding: 10px 14px; }
    .sentiment-badge-value { font-size: 1.2em; }
  }

  @media (max-width: 768px) {
    /* Sentiment badge moves above the text as a full-width strip */
    .market-summary-layout { flex-direction: column-reverse; gap: 14px; }
    .sentiment-badge { width: 100%; display: flex; align-items: center; justify-content: space-between; text-align: left; padding: 10px 14px; }
    .sentiment-badge-label { margin-bottom: 0; font-size: 0.7em; }
    .sentiment-badge-value { font-size: 1.1em; }

    .stats-grid-five { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .stat-value-sm { font-size: 1.3em; }

    .events-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .event-card { padding: 14px 12px; }

    .sector-chart-container { height: 300px; }

    .mover-row { padding: 12px 8px; }
    .mover-reason { max-width: 150px; }
  }

  @media (max-width: 480px) {
    .stats-grid-five { grid-template-columns: 1fr; }
    .events-grid { grid-template-columns: 1fr; }
    .event-card { display: flex; align-items: center; gap: 12px; text-align: left; }
    .event-date { margin-bottom: 0; flex-shrink: 0; }
    .event-title { margin-bottom: 2px; }
    .mover-reason { max-width: 120px; }
  }
`;
