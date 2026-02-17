import React, { useState, useEffect } from "react";
import "./styles/topNavbar.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import {
  Bell, Moon, Sun, Users, Calendar, DollarSign,
  TrendingUp, BarChart2, Home, Settings, User,
  MessageSquare, LogOut, Search, ChevronDown,
  Zap, Shield, Activity
} from "lucide-react";

import Container from "react-bootstrap/Container";
import Form    from "react-bootstrap/Form";
import Nav     from "react-bootstrap/Nav";
import Navbar  from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

// ─── PAGE IMPORTS ──────────────────────────────────
import Login       from "./pages/auth/Login";
import Dashboard   from "./pages/hr/Dashboard";
import Profile     from "./pages/superadmin/Profile";
import SettingsPage from "./pages/superadmin/SettingsPage";
import Employees   from "./pages/hr/Employees";
import Attendance  from "./pages/hr/Attendance";
import Payroll     from "./pages/hr/Payroll";
import Analytics   from "./pages/hr/Analytics";

// ═══════════════════════════════════════════════════
// 🔐 PRIVATE ROUTE
// ═══════════════════════════════════════════════════
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// ═══════════════════════════════════════════════════
// TOP NAVBAR
// ═══════════════════════════════════════════════════
const TopNavbar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const [notifications]  = useState(3);
  const [searchFocused,  setSearchFocused]  = useState(false);
  const [searchValue,    setSearchValue]    = useState("");
  const [scrolled,       setScrolled]       = useState(false);
  const [lightMode,      setLightMode]      = useState(() => {
    return localStorage.getItem("lightMode") === "true";
  });

  // ── scroll depth ──────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── light / dark ──────────────────────────────────
  useEffect(() => {
    localStorage.setItem("lightMode", lightMode);
    if (lightMode) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [lightMode]);

  // ── helpers ──────────────────────────────────────
  const handleLogout   = () => { logout(); window.location.href = "/"; };
  const isActive       = (path) => location.pathname === path;
  const userInitials   = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "HR";

  return (
    <Navbar
      expand="lg"
      className={`premium-navbar${scrolled ? " scrolled" : ""}`}
    >
      <Container fluid className="px-4" style={{ height: "72px" }}>

        {/* ── BRAND ─────────────────────────────── */}
        <Navbar.Brand as={Link} to="/app" className="navbar-brand-custom">
          <div className="brand-icon">
            <BarChart2 size={18} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <span className="brand-title">HR Elite</span>
            <span className="brand-sub">Enterprise Suite</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">

          {/* ── LEFT NAV ────────────────────────── */}
          <Nav className="me-auto ms-lg-5 gap-1">

            <Nav.Link
              as={Link}
              to="/app"
              className={`nav-link-custom ${isActive("/app") ? "active" : ""}`}
            >
              <Home size={16} strokeWidth={2} />
              Dashboard
            </Nav.Link>

            <NavDropdown
              title={
                <span
                  className="d-flex align-items-center gap-2"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)"
                  }}
                >
                  <Users size={16} strokeWidth={2} style={{ color: "var(--gold-primary)" }} />
                  People
                  <ChevronDown size={13} strokeWidth={2.5} style={{ opacity: 0.6, marginLeft: "-2px" }} />
                </span>
              }
              id="people-dropdown"
              renderMenuOnMount
            >
              <NavDropdown.Header>People Management</NavDropdown.Header>
              <NavDropdown.Item as={Link} to="/app/employees">
                <Users size={15} />
                Employees
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/attendance">
                <Calendar size={15} />
                Attendance
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/payroll">
                <DollarSign size={15} />
                Payroll
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/app/analytics">
                <TrendingUp size={15} />
                Analytics
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/app/settings"
              className={`nav-link-custom ${isActive("/app/settings") ? "active" : ""}`}
            >
              <Settings size={16} strokeWidth={2} />
              Settings
            </Nav.Link>

          </Nav>

          {/* ── RIGHT SIDE ──────────────────────── */}
          <div className="d-flex align-items-center gap-2">

            {/* Search */}
            <div
              className={`search-container d-none d-lg-block ${searchFocused ? "focused" : ""}`}
            >
              <Search size={15} className="search-icon" />
              <Form.Control
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Search people, reports…"
                className="search-input-custom"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Light / Dark toggle */}
            <button
              className="theme-toggle-btn"
              onClick={() => setLightMode(m => !m)}
              title={lightMode ? "Dark mode" : "Light mode"}
            >
              {lightMode
                ? <Moon size={17} strokeWidth={2} />
                : <Sun  size={17} strokeWidth={2} />
              }
            </button>

            {/* Activity feed */}
            <button className="icon-btn-custom" title="Activity">
              <Activity size={17} strokeWidth={2} />
            </button>

            {/* Messages */}
            <button className="icon-btn-custom" title="Messages">
              <MessageSquare size={17} strokeWidth={2} />
            </button>

            {/* Notifications dropdown */}
            <NavDropdown
              align="end"
              title={
                <div
                  className="icon-btn-custom"
                  role="button"
                  aria-label="Notifications"
                >
                  <Bell size={17} strokeWidth={2} />
                  {notifications > 0 && (
                    <span className="notification-badge">{notifications}</span>
                  )}
                </div>
              }
              id="notifications-dropdown"
              className="p-0"
            >
              <NavDropdown.Header>Notifications</NavDropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Zap size={14} style={{ color: "var(--gold-primary)" }} />
                New employee joined the team
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Calendar size={14} style={{ color: "var(--accent-teal)" }} />
                Leave request approved
              </NavDropdown.Item>
              <NavDropdown.Item>
                <DollarSign size={14} style={{ color: "#6ee7b7" }} />
                Q4 payroll processed
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item style={{ justifyContent: "center", fontSize: "0.8rem", fontFamily: "'Syne',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                View All
              </NavDropdown.Item>
            </NavDropdown>

            {/* Divider dot */}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "var(--navy-border)",
                flexShrink: 0,
                display: "block"
              }}
            />

            {/* User avatar dropdown */}
            <NavDropdown
              align="end"
              title={
                <div className="user-avatar" aria-label="User menu">
                  {userInitials}
                </div>
              }
              id="user-dropdown"
              className="p-0"
            >
              <NavDropdown.Header>
                {user?.name || "Administrator"}
              </NavDropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/app/profile">
                <User size={14} />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/app/settings">
                <Settings size={14} />
                Settings
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <Shield size={14} />
                Security
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                <LogOut size={14} />
                Sign out
              </NavDropdown.Item>
            </NavDropdown>

          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// ═══════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════
const Layout = () => (
  <div className="content-shell">
    <TopNavbar />
    <main style={{ padding: "2rem", paddingTop: "calc(5px + 2rem)" }}>
      <div className="content-card">
        <Outlet />
      </div>
    </main>
  </div>
);

// ═══════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index           element={<Dashboard />} />
          <Route path="profile"  element={<Profile />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payroll"  element={<Payroll />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}