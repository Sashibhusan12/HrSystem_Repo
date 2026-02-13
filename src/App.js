import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import {
  Home, Users, Calendar, TrendingUp, DollarSign,
  ChevronDown, ChevronRight, Menu, X, Bell, Search,
  Moon, Sun, MessageSquare,
} from "lucide-react";

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
// ACTIVE LINK STYLE
//////////////////////////////////////////////////////
const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-base ${
    isActive ? "bg-white/20 text-white"
             : "text-white/80 hover:bg-white/10 hover:text-white"
  }`;

//////////////////////////////////////////////////////
// SIDEBAR
//////////////////////////////////////////////////////
const Sidebar = ({ isMobileOpen, setIsMobileOpen, isSidebarOpen }) => {
  const [employeesOpen, setEmployeesOpen] = useState(false);

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-64 
        bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700
        shadow-2xl p-6 z-50 transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${!isSidebarOpen && "lg:-translate-x-full"}`}>

        <h1 className="text-2xl font-bold text-white mb-10">HR Elite</h1>

        <nav className="space-y-2">
          <NavLink to="/app" end className={linkClass}>
            <Home size={20}/> Dashboard
          </NavLink>

          <div>
            <button onClick={()=>setEmployeesOpen(!employeesOpen)}
              className="w-full flex justify-between px-4 py-3 text-white/80">
              <div className="flex gap-3"><Users/>Employees</div>
              {employeesOpen ? <ChevronDown/> : <ChevronRight/>}
            </button>

            {employeesOpen && (
              <div className="ml-4 space-y-1">
                <NavLink to="/app/employees" className={linkClass}>Employees</NavLink>
                <NavLink to="/app/attendance" className={linkClass}>Attendance</NavLink>
                <NavLink to="/app/payroll" className={linkClass}>Payroll</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/app/analytics" className={linkClass}>
            <TrendingUp size={20}/> Analytics
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

//////////////////////////////////////////////////////
// HEADER WITH LOGOUT
//////////////////////////////////////////////////////
const Header = ({ onMenuClick }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="h-16 bg-white flex justify-between px-6 items-center shadow">
      <button onClick={onMenuClick}><Menu/></button>
      <button onClick={handleLogout} className="text-red-500 font-bold">
        Logout
      </button>
    </header>
  );
};

//////////////////////////////////////////////////////
// LAYOUT
//////////////////////////////////////////////////////
const Layout = () => {
  const [isMobileOpen,setIsMobileOpen]=useState(false);
  const [isSidebarOpen,setIsSidebarOpen]=useState(true);

  return (
    <div className="bg-slate-100 min-h-screen">
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isSidebarOpen={isSidebarOpen}
      />

      <div className={`${isSidebarOpen ? "lg:ml-64":"lg:ml-0"} transition-all`}>
        <Header onMenuClick={()=>setIsMobileOpen(!isMobileOpen)} />

        <main className="p-6">
          <div className="bg-white rounded-2xl shadow p-8 min-h-[80vh]">
            <Outlet/>
          </div>
        </main>
      </div>
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
