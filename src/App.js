import React, { useState, useEffect, useRef } from "react";
import "./styles/topNavbar.css";
import "./styles/sidebar.css";
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
import { useMenus } from "./hooks/useMenus";

import {
  Bell, Moon, Sun, BarChart2,
  Settings, User, MessageSquare,
  LogOut, Search, ChevronDown,
  Zap, Calendar, DollarSign,
  Shield, Activity,
  Home, Users, TrendingUp, FileText, Briefcase,
  Clock, Award, Database, Globe,
  Layers, PieChart, Clipboard, BookOpen, CreditCard,
  ChevronRight, Menu, X, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

import Container   from "react-bootstrap/Container";
import Nav         from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form        from "react-bootstrap/Form";

import Login         from "./pages/auth/Login";
import Dashboard     from "./pages/hr/Dashboard";
import Profile       from "./pages/superadmin/Profile";
import SettingsPage  from "./pages/superadmin/SettingsPage";
import Employees     from "./pages/hr/Employees";
import Attendance    from "./pages/hr/Attendance";
import Payroll       from "./pages/hr/Payroll";
import Analytics     from "./pages/hr/Analytics";
import ResetPassword from "./pages/auth/ResetPassword";

// ═══════════════════════════════════════════════════
// ICON MAP
// ═══════════════════════════════════════════════════
const ICON_MAP = {
  Home, Users, Calendar, DollarSign, TrendingUp,
  BarChart2, Settings, User, FileText, Briefcase,
  Clock, Award, Bell, Shield, Database, Globe,
  Layers, PieChart, Clipboard, BookOpen, CreditCard,
  Activity, Search,
  home: Home, users: Users, calendar: Calendar,
  dollar: DollarSign, trending: TrendingUp,
  chart: BarChart2, settings: Settings, profile: User,
  file: FileText, briefcase: Briefcase, clock: Clock,
  award: Award, bell: Bell, shield: Shield,
  database: Database, globe: Globe, layers: Layers,
  piechart: PieChart, clipboard: Clipboard,
  book: BookOpen, credit: CreditCard,
};

const MenuIcon = ({ name, size = 18, ...props }) => {
  const Icon = (name && ICON_MAP[name]) || ChevronRight;
  return <Icon size={size} strokeWidth={1.8} {...props} />;
};

// ═══════════════════════════════════════════════════
// PRIVATE ROUTE
// ═══════════════════════════════════════════════════
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// ═══════════════════════════════════════════════════
// SIDEBAR NAV ITEM
// ═══════════════════════════════════════════════════
const SidebarNavItem = ({ menu, isActive, collapsed }) => {
  const [open, setOpen]       = useState(false);
  const [flyout, setFlyout]   = useState(false);
  const [flyoutY, setFlyoutY] = useState(0);
  const itemRef               = useRef(null);
  const flyoutRef             = useRef(null);
  const hasChildren = menu.children && menu.children.length > 0;
  const active = isActive(menu.path);

  // Close flyout on outside click
  useEffect(() => {
    if (!flyout) return;
    const handler = (e) => {
      if (
        flyoutRef.current && !flyoutRef.current.contains(e.target) &&
        itemRef.current  && !itemRef.current.contains(e.target)
      ) setFlyout(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [flyout]);

  // Close flyout when sidebar expands
  useEffect(() => { if (!collapsed) setFlyout(false); }, [collapsed]);

  const handleCollapsedClick = (e) => {
    e.preventDefault();
    const rect = itemRef.current?.getBoundingClientRect();
    if (rect) setFlyoutY(rect.top);
    setFlyout((f) => !f);
  };

  if (hasChildren) {
    return (
      <div className="sidebar-group" style={{ position: "relative" }}>
        <button
          ref={itemRef}
          className={`sidebar-item sidebar-group-toggle ${!collapsed && open ? "open" : ""}`}
          onClick={collapsed ? handleCollapsedClick : () => setOpen((o) => !o)}
          title={collapsed ? menu.menuName : undefined}
        >
          <span className="sidebar-item-icon">
            <MenuIcon name={menu.icon} size={18} />
          </span>
          {!collapsed && (
            <>
              <span className="sidebar-item-label">{menu.menuName}</span>
              <ChevronDown size={13} className="sidebar-chevron" />
            </>
          )}
          {collapsed && <ChevronRight size={10} className="collapsed-hint" />}
        </button>

        {/* Expanded inline sub-menu */}
        {!collapsed && open && (
          <div className="sidebar-sub">
            {menu.children.map((child) => (
              <Link
                key={child.menuId}
                to={child.path}
                className={`sidebar-sub-item ${isActive(child.path) ? "active" : ""}`}
              >
                <span className="sidebar-sub-dot" />
                <MenuIcon name={child.icon} size={14} />
                <span>{child.menuName}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Collapsed flyout popout */}
        {collapsed && flyout && (
          <div ref={flyoutRef} className="sidebar-flyout" style={{ top: flyoutY }}>
            <div className="sidebar-flyout-title">{menu.menuName}</div>
            {menu.children.map((child) => (
              <Link
                key={child.menuId}
                to={child.path}
                className={`sidebar-flyout-item ${isActive(child.path) ? "active" : ""}`}
                onClick={() => setFlyout(false)}
              >
                <MenuIcon name={child.icon} size={14} />
                <span>{child.menuName}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={menu.path}
      className={`sidebar-item ${active ? "active" : ""}`}
      title={collapsed ? menu.menuName : undefined}
    >
      <span className="sidebar-item-icon">
        <MenuIcon name={menu.icon} size={18} />
      </span>
      {!collapsed && <span className="sidebar-item-label">{menu.menuName}</span>}
      {active && <span className="sidebar-active-bar" />}
    </Link>
  );
};

// ═══════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════
const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { menus, loading } = useMenus();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "HR";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>

        {/* ── Sidebar Header ── */}
        <div className="sidebar-header">
          <Link to="/app" className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <BarChart2 size={17} strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-title">HR Elite</span>
                <span className="sidebar-brand-sub">Enterprise Suite</span>
              </div>
            )}
          </Link>

          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* ── Gold rule ── */}
        <div className="sidebar-rule" />

        {/* ── Nav Menu ── */}
        <nav className="sidebar-nav">
          {!collapsed && (
            <span className="sidebar-section-label">Main Menu</span>
          )}

          {loading ? (
            <div className="sidebar-skeleton">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="sidebar-skeleton-item" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : (
            menus.filter((m) => m.isActive).map((menu) => (
              <SidebarNavItem
                key={menu.menuId}
                menu={menu}
                isActive={isActive}
                collapsed={collapsed}
              />
            ))
          )}
        </nav>

        {/* ── Sidebar Footer ── */}
        <div className="sidebar-footer">
          <div className="sidebar-rule" />
          <Link to="/app/settings" className="sidebar-item" title={collapsed ? "Settings" : undefined}>
            <span className="sidebar-item-icon"><Settings size={18} strokeWidth={1.8} /></span>
            {!collapsed && <span className="sidebar-item-label">Settings</span>}
          </Link>

          <div className={`sidebar-user ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-user-avatar">{userInitials}</div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.name || "Administrator"}</span>
                <span className="sidebar-user-role">Super Admin</span>
              </div>
            )}
            {!collapsed && (
              <button
                className="sidebar-logout-btn"
                onClick={() => { logout(); window.location.href = "/"; }}
                title="Sign out"
              >
                <LogOut size={15} strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// ═══════════════════════════════════════════════════
// TOP NAVBAR — utility bar only (no menu items)
// ═══════════════════════════════════════════════════
const TopNavbar = ({ onMobileMenuToggle }) => {
  const { user } = useAuth();
  const [notifications] = useState(3);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue,   setSearchValue]   = useState("");
  const [scrolled,      setScrolled]      = useState(false);
  const [lightMode,     setLightMode]     = useState(
    () => localStorage.getItem("lightMode") === "true"
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem("lightMode", lightMode);
    document.body.classList.toggle("light-mode", lightMode);
  }, [lightMode]);

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "HR";

  return (
    <header className={`top-navbar ${scrolled ? "scrolled" : ""}`}>
      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" onClick={onMobileMenuToggle}>
        <Menu size={20} strokeWidth={2} />
      </button>

      {/* Search */}
      <div className={`topbar-search ${searchFocused ? "focused" : ""}`}>
        <Search size={15} className="topbar-search-icon" />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search people, reports…"
          className="topbar-search-input"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      <div className="topbar-spacer" />

      {/* Right utilities */}
      <div className="topbar-actions">

        {/* Theme toggle */}
        <button className="topbar-icon-btn" onClick={() => setLightMode((m) => !m)} title={lightMode ? "Dark mode" : "Light mode"}>
          {lightMode ? <Moon size={17} strokeWidth={2} /> : <Sun size={17} strokeWidth={2} />}
        </button>

        {/* Activity */}
        <button className="topbar-icon-btn" title="Activity">
          <Activity size={17} strokeWidth={2} />
        </button>

        {/* Messages */}
        <button className="topbar-icon-btn" title="Messages">
          <MessageSquare size={17} strokeWidth={2} />
        </button>

        {/* Notifications */}
        <NavDropdown
          align="end"
          title={
            <div className="topbar-icon-btn">
              <Bell size={17} strokeWidth={2} />
              {notifications > 0 && <span className="topbar-badge">{notifications}</span>}
            </div>
          }
          id="notifications-dropdown"
          className="topbar-dropdown"
        >
          <NavDropdown.Header>Notifications</NavDropdown.Header>
          <NavDropdown.Divider />
          <NavDropdown.Item>
            <Zap size={14} style={{ color: "var(--gold-primary)" }} /> New employee joined
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Calendar size={14} style={{ color: "var(--accent-teal)" }} /> Leave request approved
          </NavDropdown.Item>
          <NavDropdown.Item>
            <DollarSign size={14} style={{ color: "#6ee7b7" }} /> Q4 payroll processed
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item className="text-center" style={{ fontSize: "0.78rem", fontFamily: "'Syne',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            View All
          </NavDropdown.Item>
        </NavDropdown>

        {/* Separator */}
        <span className="topbar-sep" />

        {/* User menu */}
        <NavDropdown
          align="end"
          title={<div className="topbar-avatar">{userInitials}</div>}
          id="user-dropdown"
          className="topbar-dropdown"
        >
          <NavDropdown.Header>{user?.name || "Administrator"}</NavDropdown.Header>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/app/profile"><User size={14} /> Profile</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/app/settings"><Settings size={14} /> Settings</NavDropdown.Item>
          <NavDropdown.Item><Shield size={14} /> Security</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            className="text-danger"
            onClick={() => { window.location.href = "/"; }}
          >
            <LogOut size={14} /> Sign out
          </NavDropdown.Item>
        </NavDropdown>

      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════
// LAYOUT — sidebar + topbar + content
// ═══════════════════════════════════════════════════
const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="app-body">
        <TopNavbar onMobileMenuToggle={() => setMobileOpen((o) => !o)} />
        <main className="app-main">
          <div className="content-card">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index             element={<Dashboard />} />
          <Route path="profile"    element={<Profile />} />
          <Route path="employees"  element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payroll"    element={<Payroll />} />
          <Route path="analytics"  element={<Analytics />} />
          <Route path="settings"   element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}