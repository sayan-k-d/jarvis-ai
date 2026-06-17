export default function Sidebar({ activeSection, onNavClick }) {
  const navGroups = [
    {
      title: "Overview",
      items: [
        { section: "dashboard", icon: "fa-chart-pie", label: "Dashboard" },
        { section: "stocks", icon: "fa-chart-line", label: "All Stocks" },
        { section: "compare", icon: "fa-balance-scale", label: "Compare" },
        { section: "screener", icon: "fa-filter", label: "Screener" },
        { section: "stockAnalysis", icon: "fa-filter", label: "Stock Analysis" },
      ],
    },
    {
      title: "AI Engines",
      items: [
        { section: "market", icon: "fa-globe", label: "Market Intelligence" },
        {
          section: "opportunities",
          icon: "fa-lightbulb",
          label: "Opportunity Engine",
          badge: "8",
        },
        {
          section: "risk",
          icon: "fa-shield-alt",
          label: "Risk Engine",
          badge: "3",
        },
        {
          section: "portfolio-intel",
          icon: "fa-brain",
          label: "Portfolio Intelligence",
        },
      ],
    },
  ];

  return (
    <nav className="sidebar">
      <div className="logo">
        <h1>
          <i className="fas fa-robot"></i> Jarvis
        </h1>
        <span>Investment Intelligence</span>
      </div>

      {navGroups.map((group) => (
        <div key={group.title} className="nav-section">
          <div className="nav-section-title">{group.title}</div>
          {group.items.map((item) => (
            <div
              key={item.section}
              className={`nav-item${activeSection === item.section ? " active" : ""}`}
              data-section={item.section}
              onClick={() => onNavClick(item.section)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </div>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">NL</div>
          <div className="user-details">
            <h4>Noland Langford</h4>
            <span>Portfolio Manager</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
