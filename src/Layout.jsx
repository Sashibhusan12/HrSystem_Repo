import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-base ${
    isActive
      ? "bg-white/20 text-white"
      : "text-white/80 hover:bg-white/10 hover:text-white"
  }`;

export default function Sidebar({ isMobileOpen, setIsMobileOpen, isSidebarOpen }) {
  const [employeesOpen, setEmployeesOpen] = useState(false);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 
        bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700
        shadow-2xl p-6 z-50 transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${!isSidebarOpen && "lg:-translate-x-full"}`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white"
        >
          <X />
        </button>

        <h1 className="text-2xl font-bold text-white mb-10">HR Elite</h1>

        <nav className="space-y-2">
          <NavLink to="/" end className={linkClass}>
            <Home size={20} /> Dashboard
          </NavLink>

          <div>
            <button
              onClick={() => setEmployeesOpen(!employeesOpen)}
              className="w-full flex justify-between px-4 py-3 text-white/80"
            >
              <div className="flex gap-3">
                <Users /> Employees
              </div>
              {employeesOpen ? <ChevronDown /> : <ChevronRight />}
            </button>

            {employeesOpen && (
              <div className="ml-4 space-y-1">
                <NavLink to="/employees" className={linkClass}>
                  Employees
                </NavLink>
                <NavLink to="/attendance" className={linkClass}>
                  Attendance
                </NavLink>
                <NavLink to="/payroll" className={linkClass}>
                  Payroll
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/analytics" className={linkClass}>
            <TrendingUp size={20} /> Analytics
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
