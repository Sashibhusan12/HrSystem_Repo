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
  TrendingUp, BarChart2, Home, Settings, User, MessageSquare,
  LogOut, Search
} from "lucide-react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

// PAGES
import Login from "./pages/auth/Login";
import Dashboard from "./pages/hr/Dashboard";
import Profile from "./pages/superadmin/Profile";
import SettingsPage from "./pages/superadmin/SettingsPage";
import Employees from "./pages/hr/Employees";
import Attendance from "./pages/hr/Attendance";
import Payroll from "./pages/hr/Payroll";
import Analytics from "./pages/hr/Analytics";

//////////////////////////////////////////////////////
// 🔐 PRIVATE ROUTE
//////////////////////////////////////////////////////
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

//////////////////////////////////////////////////////
// TOP NAVBAR
//////////////////////////////////////////////////////
const TopNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [notifications] = useState(3);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      
      <Navbar expand="lg" className="premium-navbar">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/app" className="navbar-brand-custom">
            <BarChart2 size={28} />
            HR Elite
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            {/* LEFT MENU */}
            <Nav className="me-auto ms-lg-4">
              <Nav.Link 
                as={Link} 
                to="/app" 
                className={`nav-link-custom ${isActive('/app') ? 'active' : ''}`}
              >
                <Home size={18} />
                Dashboard
              </Nav.Link>

              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-2">
                    <Users size={18} />
                    Employees
                  </span>
                }
                id="employees-dropdown"
              >
                <NavDropdown.Item as={Link} to="/app/employees">
                  <Users size={16} />
                  Employees
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/attendance">
                  <Calendar size={16} />
                  Attendance
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/payroll">
                  <DollarSign size={16} />
                  Payroll
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/analytics">
                  <TrendingUp size={16} />
                  Analytics
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link 
                as={Link} 
                to="/app/settings" 
                className={`nav-link-custom ${isActive('/app/settings') ? 'active' : ''}`}
              >
                <Settings size={18} />
                Settings
              </Nav.Link>
            </Nav>

            {/* RIGHT SIDE */}
            <div className="d-flex align-items-center gap-3">
              <div 
                className={`search-container d-none d-lg-block ${searchFocused ? 'focused' : ''}`}
              >
                <Search size={18} className="search-icon" />
                <Form.Control
                  placeholder="Search..."
                  className="search-input-custom"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>

              {/* Dark/Light Mode Toggle */}
              <button 
                className="theme-toggle-btn" 
                onClick={toggleDarkMode}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="icon-btn-custom">
                <MessageSquare size={20} />
              </button>

              <NavDropdown
                align="end"
                title={
                  <button className="icon-btn-custom">
                    <Bell size={20} />
                    {notifications > 0 && (
                      <span className="notification-badge">{notifications}</span>
                    )}
                  </button>
                }
                id="notifications-dropdown"
                className="p-0"
              >
                <NavDropdown.Header>
                  Notifications
                </NavDropdown.Header>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Bell size={16} />
                  New employee joined
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Calendar size={16} />
                  Leave approved
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <DollarSign size={16} />
                  Payroll processed
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                align="end"
                title={
                  <div className="user-avatar">
                    <User size={20} />
                  </div>
                }
                id="user-dropdown"
                className="p-0"
              >
                <NavDropdown.Header>
                  My Account
                </NavDropdown.Header>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/app/profile">
                  <User size={16} />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/settings">
                  <Settings size={16} />
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <LogOut size={16} />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

//////////////////////////////////////////////////////
// LAYOUT
//////////////////////////////////////////////////////
const Layout = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <TopNavbar />

      {/* Add padding-top to prevent content from being hidden under fixed navbar */}
      <main className="p-6" style={{ paddingTop: '100px' }}>
        <div className="bg-white rounded-2xl shadow p-8 min-h-[80vh]">
          <Outlet/>
        </div>
      </main>
    </div>
  );
};

//////////////////////////////////////////////////////
// ROUTER
//////////////////////////////////////////////////////
export default function App(){
  return (
    <Router>
      <Routes>

        {/* LOGIN PAGE AT ROOT */}
        <Route path="/" element={<Login/>} />

        {/* PROTECTED APP */}
        <Route path="/app" element={
          <PrivateRoute>
            <Layout/>
          </PrivateRoute>
        }>
          <Route index element={<Dashboard/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="employees" element={<Employees/>}/>
          <Route path="attendance" element={<Attendance/>}/>
          <Route path="payroll" element={<Payroll/>}/>
          <Route path="analytics" element={<Analytics/>}/>
          <Route path="settings" element={<SettingsPage/>}/>
        </Route>

      </Routes>
    </Router>
  );
}