import { useEffect, useState } from "react";

export default function Sidebar({ activeSection, onNavClick }) {
  const [open, setOpen] = useState(false);

  const navGroups = [
    {
      title: "Overview",
      items: [
        { section: "dashboard", icon: "fa-chart-pie", label: "Dashboard" },
        { section: "stocks", icon: "fa-chart-line", label: "All Stocks" },
        { section: "compare", icon: "fa-balance-scale", label: "Compare" },
        { section: "screener", icon: "fa-filter", label: "Screener" },
        {
          section: "stockAnalysis",
          icon: "fa-magnifying-glass-chart",
          label: "Stock Analysis",
        },
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

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNav = (section) => {
    onNavClick(section);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button
          className="hamburger"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="mobile-logo">
          <i className="fas fa-robot"></i>
          <span>Jarvis</span>
        </div>
        <div className="mobile-avatar">NL</div>
      </div>

      {/* Backdrop */}
      <div
        className={`sidebar-backdrop${open ? " show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <nav className={`sidebar${open ? " open" : ""}`}>
        <div className="logo">
          <h1>
            <i className="fas fa-robot"></i> Jarvis
          </h1>
          <span>Investment Intelligence</span>
          <button
            className="sidebar-close"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="sidebar-scroll">
          {navGroups.map((group) => (
            <div key={group.title} className="nav-section">
              <div className="nav-section-title">{group.title}</div>
              {group.items.map((item) => (
                <div
                  key={item.section}
                  className={`nav-item${activeSection === item.section ? " active" : ""}`}
                  data-section={item.section}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNav(item.section)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleNav(item.section)
                  }
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                  {item.badge && <span className="badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

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
    </>
  );
}
