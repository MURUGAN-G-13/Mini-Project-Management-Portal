import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Navbar component with navigation links, dark mode toggle, and logout.
 *
 * Props:
 *   - user: { name, email, avatar }
 *   - onLogout: () => void
 */
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar" id="main-navbar">
      <NavLink to="/" className="navbar__brand">
        <div className="navbar__brand-icon">📋</div>
        <span className="navbar__brand-text">TaskFlow</span>
      </NavLink>

      <div className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `navbar__link ${isActive ? "navbar__link--active" : ""}`
          }
          id="nav-dashboard"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/add-task"
          className={({ isActive }) =>
            `navbar__link ${isActive ? "navbar__link--active" : ""}`
          }
          id="nav-add-task"
        >
          + Add Task
        </NavLink>
      </div>

      <div className="navbar__actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          id="theme-toggle-btn"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* User avatar & logout */}
        <div className="navbar__user" id="navbar-user">
          <div className="navbar__avatar" title={user?.name || "User"}>
            {user?.avatar || "U"}
          </div>
          <button
            className="btn btn--ghost navbar__logout-btn"
            onClick={handleLogout}
            title="Sign out"
            id="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
