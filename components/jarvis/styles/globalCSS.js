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
  }

  body {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .sidebar {
    position: fixed; left: 0; top: 0;
    width: var(--sidebar-width); height: 100vh;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    padding: 20px 0;
    display: flex; flex-direction: column;
    z-index: 100;
  }

  .logo { padding: 0 24px 24px; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; }
  .logo h1 { font-size: 1.4em; font-weight: 700; display: flex; align-items: center; gap: 10px; }
  .logo h1 i { color: var(--accent-cyan); }
  .logo span { font-size: 0.7em; color: var(--text-muted); font-weight: 400; }

  .nav-section { padding: 0 12px; margin-bottom: 24px; }
  .nav-section-title { font-size: 0.65em; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); padding: 0 12px; margin-bottom: 8px; }

  .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; }
  .nav-item:hover { background: rgba(255, 255, 255, 0.05); }
  .nav-item.active { background: linear-gradient(90deg, rgba(6, 182, 212, 0.2), transparent); border-left: 3px solid var(--accent-cyan); }
  .nav-item i { width: 20px; text-align: center; color: var(--text-secondary); }
  .nav-item.active i { color: var(--accent-cyan); }
  .nav-item span { font-size: 0.85em; color: var(--text-secondary); }
  .nav-item.active span { color: var(--text-primary); font-weight: 500; }
  .nav-item .badge { margin-left: auto; background: var(--accent-rose); color: white; font-size: 0.65em; padding: 2px 6px; border-radius: 10px; font-weight: 600; }

  .sidebar-footer { margin-top: auto; padding: 20px 24px; border-top: 1px solid var(--border-color); }
  .user-info { display: flex; align-items: center; gap: 12px; }
  .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue)); display: flex; align-items: center; justify-content: center; font-weight: 600; }
  .user-details h4 { font-size: 0.85em; font-weight: 500; }
  .user-details span { font-size: 0.7em; color: var(--text-muted); }

  .main-content { margin-left: var(--sidebar-width); padding: 0 0 0 32px; min-height: 100vh; }

  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
  .header-left h2 { font-size: 1.5em; font-weight: 600; margin-bottom: 4px; }
  .header-left p { font-size: 0.8em; color: var(--text-muted); }
  .header-right { display: flex; align-items: center; gap: 16px; }

  .search-box { display: flex; align-items: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 16px; width: 280px; }
  .search-box i { color: var(--text-muted); margin-right: 10px; }
  .search-box input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 0.85em; width: 100%; }
  .search-box input::placeholder { color: var(--text-muted); }

  .header-icon { width: 40px; height: 40px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; }
  .header-icon i { color: var(--text-secondary); }
  .header-icon .notification-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: var(--accent-rose); border-radius: 50%; border: 2px solid var(--bg-card); }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
  .stat-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; }
  .stat-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .stat-card-header h4 { font-size: 0.75em; color: var(--text-muted); font-weight: 400; }
  .stat-card-header i { color: var(--text-muted); font-size: 1em; }
  .stat-value { font-size: 1.8em; font-weight: 700; margin-bottom: 4px; }
  .stat-change { font-size: 0.75em; display: flex; align-items: center; gap: 4px; }
  .stat-change.positive { color: var(--accent-emerald); }
  .stat-change.negative { color: var(--accent-rose); }
  .stat-change i { font-size: 0.9em; }

  .charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px; }
  .chart-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; }
  .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .chart-header h3 { font-size: 1em; font-weight: 600; }
  .chart-tabs { display: flex; gap: 8px; }
  .chart-tab { padding: 6px 12px; border-radius: 6px; font-size: 0.7em; cursor: pointer; background: transparent; color: var(--text-muted); border: none; font-family: inherit; }
  .chart-tab.active { background: var(--accent-cyan); color: var(--bg-primary); font-weight: 500; }
  .chart-container { height: 260px; }

  .holdings-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; }
  .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .table-header h3 { font-size: 1em; font-weight: 600; }
  .table-actions { display: flex; gap: 8px; }
  .table-btn { padding: 6px 12px; border-radius: 6px; font-size: 0.7em; cursor: pointer; background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); font-family: inherit; }
  .table-btn:hover { background: rgba(255, 255, 255, 0.05); }
  .table-btn.primary { background: var(--accent-cyan); color: var(--bg-primary); border: none; }

  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 12px; font-size: 0.7em; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border-color); }
  td { padding: 14px 12px; font-size: 0.8em; border-bottom: 1px solid var(--border-color); }
  tr:hover { background: rgba(255, 255, 255, 0.02); }

  .stock-info { display: flex; align-items: center; gap: 12px; }
  .stock-logo { width: 36px; height: 36px; border-radius: 8px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.7em; }
  .stock-details h4 { font-weight: 500; margin-bottom: 2px; }
  .stock-details span { font-size: 0.7em; color: var(--text-muted); }

  .pem-score { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 8px; font-weight: 600; font-size: 0.85em; }
  .pem-high   { background: rgba(6, 182, 212, 0.2); color: var(--accent-emerald); }
  .pem-medium { background: rgba(245, 158, 11, 0.2);  color: var(--accent-amber);   }
  .pem-low    { background: rgba(239, 68, 68, 0.2);   color: var(--accent-rose);    }

  .price-change          { font-weight: 500; }
  .price-change.positive { color: var(--accent-emerald); }
  .price-change.negative { color: var(--accent-rose); }

  .trend-bar { width: 60px; height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
  .trend-bar-fill { height: 100%; border-radius: 3px; background: var(--accent-emerald); }

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
  .ai-avatar { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple)); display: flex; align-items: center; justify-content: center; }
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
  .input-container input { flex: 1; background: none; border: none; outline: none; color: var(--text-primary); font-size: 0.85em; padding: 8px 0; font-family: inherit; }
  .input-container input::placeholder { color: var(--text-muted); }
  .input-actions { display: flex; gap: 8px; }
  .input-actions button { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
  .input-actions button:hover { color: var(--accent-cyan); }
  .send-btn { background: var(--accent-cyan) !important; color: var(--bg-primary) !important; border-radius: 8px !important; padding: 8px !important; }

  .alerts-list { max-height: 300px; overflow-y: auto; }
  .alert-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 8px; background: var(--bg-card); cursor: pointer; transition: all 0.2s; }
  .alert-item:hover { background: var(--bg-tertiary); }
  .alert-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .alert-icon.warning { background: rgba(245, 158, 11, 0.2); color: var(--accent-amber); }
  .alert-icon.danger  { background: rgba(239, 68, 68, 0.2);  color: var(--accent-rose);  }
  .alert-icon.success { background: rgba(6, 182, 212, 0.2); color: var(--accent-emerald); }
  .alert-icon.info    { background: rgba(59, 130, 246, 0.2); color: var(--accent-blue);  }
  .alert-content { flex: 1; }
  .alert-content h4 { font-size: 0.8em; font-weight: 500; margin-bottom: 4px; }
  .alert-content p { font-size: 0.7em; color: var(--text-muted); }
  .alert-time { font-size: 0.65em; color: var(--text-muted); }

  .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  .watchlist-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; border-radius: 8px; margin-bottom: 8px; background: var(--bg-tertiary); cursor: pointer; transition: all 0.2s; }
  .watchlist-item:hover { background: rgba(255, 255, 255, 0.1); }
  .watchlist-left { display: flex; align-items: center; gap: 12px; }
  .watchlist-price h4 { font-size: 0.85em; font-weight: 500; margin-bottom: 2px; }
  .watchlist-price span { font-size: 0.7em; color: var(--text-muted); }
  .watchlist-right { text-align: right; }
  .watchlist-right .price { font-size: 0.85em; font-weight: 500; margin-bottom: 2px; }
  .watchlist-right .change { font-size: 0.7em; }

  .quick-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .quick-action { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--bg-tertiary); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
  .quick-action:hover { background: rgba(255, 255, 255, 0.1); }
  .quick-action i { font-size: 1.2em; color: var(--accent-cyan); }
  .quick-action span { font-size: 0.8em; }

  .compare-select { padding: 10px 16px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 0.85em; min-width: 180px; cursor: pointer; font-family: inherit; }
  .compare-select:focus { outline: none; border-color: var(--accent-cyan); }

  .compare-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; position: relative; overflow: hidden; }
  .compare-card.winner { border-color: var(--accent-emerald); box-shadow: 0 0 20px rgba(6, 182, 212, 0.1); }
  .compare-card.winner::before { content: "TOP PICK"; position: absolute; top: 12px; right: -30px; background: var(--accent-emerald); color: white; font-size: 0.6em; font-weight: 700; padding: 4px 40px; transform: rotate(45deg); }
  .compare-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .compare-logo { width: 56px; height: 56px; border-radius: 12px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.2em; font-weight: 700; }
  .compare-stock-info h3 { font-size: 1.2em; margin-bottom: 4px; }
  .compare-stock-info span { font-size: 0.8em; color: var(--text-muted); }
  .compare-price { margin-left: auto; text-align: right; }
  .compare-price .price { font-size: 1.4em; font-weight: 700; }
  .compare-price .change { font-size: 0.85em; }
  .compare-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .compare-metric { background: var(--bg-tertiary); padding: 12px; border-radius: 8px; }
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
  .category-name { width: 100px; font-size: 0.75em; color: var(--text-muted); }
  .category-bars { flex: 1; display: flex; gap: 8px; }
  .category-bar-item { flex: 1; text-align: center; }
  .category-bar-track { height: 24px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; margin-bottom: 4px; }
  .category-bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; font-size: 0.7em; font-weight: 600; min-width: 30px; }
  .category-bar-item .stock-label { font-size: 0.65em; color: var(--text-muted); }
  .winner-trophy { color: var(--accent-amber); }

  .allocation-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .allocation-color { width: 12px; height: 12px; border-radius: 3px; }
  .allocation-info { flex: 1; }
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

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-secondary); }
  ::-webkit-scrollbar-thumb { background: var(--bg-tertiary); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

  .section { display: none; }
  .section.active { display: block; }

  .pem-detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px; }
  .pem-factor { background: var(--bg-tertiary); padding: 16px; border-radius: 10px; }
  .pem-factor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .pem-factor-header h4 { font-size: 0.75em; color: var(--text-muted); }
  .pem-factor-value { font-size: 1.4em; font-weight: 600; }
  .pem-factor-change { font-size: 0.7em; }
  .pem-factor-change.positive { color: var(--accent-emerald); }
  .pem-factor-change.negative { color: var(--accent-rose); }

  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: none; align-items: center; justify-content: center; z-index: 300; }
  .modal-overlay.active { display: flex; }
  .modal { background: var(--bg-secondary); border-radius: 16px; width: 90%; max-width: 900px; max-height: 90vh; overflow: hidden; border: 1px solid var(--border-color); }
  .modal-header { padding: 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
  .modal-header h2 { font-size: 1.3em; }
  .modal-close { width: 36px; height: 36px; border-radius: 8px; background: var(--bg-tertiary); border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .modal-close:hover { background: var(--accent-rose); color: white; }
  .modal-body { padding: 24px; max-height: calc(90vh - 100px); overflow-y: auto; }

  .stock-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
  .stock-header-logo { width: 64px; height: 64px; border-radius: 14px; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 1.4em; font-weight: 700; }
  .stock-header-info h2 { font-size: 1.4em; margin-bottom: 4px; }
  .stock-header-info p { font-size: 0.85em; color: var(--text-muted); }
  .stock-price-info { margin-left: auto; text-align: right; }
  .stock-price-info .price { font-size: 1.8em; font-weight: 700; }
  .stock-price-info .change { font-size: 0.9em; }

  .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .metric-card { background: var(--bg-card); padding: 16px; border-radius: 10px; }
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
  /* TRADING AGENTS SPECIFIC CSS (APPENDED)   */
  /* ========================================= */
  
  .ta-container { background: var(--bg-primary); min-height: 100vh; color: var(--text-primary); font-family: inherit; }

  /* Home View */
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

  /* Loading View */
  .ta-loading-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg-secondary); }
  .ta-loading-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 32px; width: 100%; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .ta-loading-title { font-size: 1.2em; font-weight: 600; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .ta-spinner { color: var(--accent-emerald); animation: ta-spin 1s linear infinite; display: inline-block; font-size: 1.2em; }
  @keyframes ta-spin { 100% { transform: rotate(360deg); } }
  .ta-agent-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
  .ta-agent-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.9em; }
  .ta-agent-name { color: var(--text-muted); }
  .ta-agent-name.active { color: var(--text-primary); }
  .ta-status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; border: 1px solid transparent; }
  .ta-status-badge.waiting { color: var(--text-muted); }
  .ta-status-badge.pending { color: var(--accent-amber); background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); animation: ta-pulse 1.5s infinite; }
  .ta-status-badge.done { color: var(--accent-emerald); background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
  @keyframes ta-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  .ta-progress-bg { height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; }
  .ta-progress-fill { height: 100%; background: var(--accent-emerald); transition: width 0.1s linear; }

  /* Dashboard Layout */
  .ta-dashboard { display: flex; height: 100vh; overflow: hidden; background: var(--bg-primary); }
  .ta-sidebar-left { width: 260px; background: var(--bg-secondary); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; flex-shrink: 0; }
  .ta-sidebar-right { width: 320px; background: var(--bg-secondary); border-left: 1px solid var(--border-color); display: flex; flex-direction: column; flex-shrink: 0; }
  .ta-main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* Header & General */
  .ta-header-bar { padding: 16px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); }
  .ta-header-title { font-size: 1.1em; font-weight: 600; }
  .ta-btn-outline { background: rgba(6, 182, 212, 0.1); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3); padding: 8px 16px; border-radius: 6px; font-size: 0.85em; cursor: pointer; font-family: inherit; transition: background 0.2s; }
  .ta-btn-outline:hover { background: rgba(6, 182, 212, 0.2); }
  .ta-sidebar-header { padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; font-size: 0.85em; font-weight: 700; letter-spacing: 0.1em; color: var(--text-primary); text-transform: uppercase;}
  .ta-sidebar-header svg { width: 20px; height: 20px; color: var(--accent-emerald); fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ta-sidebar-content { padding: 16px; overflow-y: auto; flex: 1; }
  .ta-section-title { font-size: 0.7em; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }

  /* Agent Menu */
  .ta-menu-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .ta-menu-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 6px; font-size: 0.85em; cursor: pointer; transition: background 0.2s; color: var(--text-secondary); }
  .ta-menu-item:hover { background: var(--bg-tertiary); color: var(--text-primary); }
  .ta-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-emerald); }

  /* Dashboard Content */
  .ta-content-scroll { flex: 1; overflow-y: auto; padding: 32px; }
  .ta-report-container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
  
  .ta-decision-box { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  .ta-decision-label { font-size: 0.8em; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 12px; font-weight: 600; }
  .ta-decision-value { display: flex; align-items: baseline; gap: 16px; }
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

  /* Right Sidebar Specs */
  .ta-btn-solid { width: 100%; background: var(--accent-emerald); color: var(--bg-primary); border: none; padding: 12px; border-radius: 6px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; font-family: inherit; margin-bottom: 24px; }
  .ta-btn-solid:hover { opacity: 0.9; }
  .ta-config-list { display: flex; flex-direction: column; gap: 12px; font-size: 0.85em; color: var(--text-secondary); }
  .ta-config-label { color: var(--text-muted); margin-right: 8px; }
  .ta-config-value { color: var(--text-primary); }
  .ta-config-code { background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: var(--text-primary); }
  .ta-log-box { background: var(--bg-card); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; font-size: 0.8em; color: var(--text-muted); font-style: italic; text-align: center; margin-top: 16px; }
`;
