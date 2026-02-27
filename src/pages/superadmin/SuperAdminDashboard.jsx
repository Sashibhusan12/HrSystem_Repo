import React from "react";
import { TrendingUp, Users, DollarSign, Calendar, ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-lg">
        <Icon size={24} className="text-white" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
            {activity.icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900">{activity.title}</p>
            <p className="text-sm text-slate-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function SuperAdminDashboard() {
  const stats = [
    { title: "Total Employees", value: "1,245", change: "+12%", icon: Users, trend: "up" },
    { title: "Active Projects", value: "32", change: "+5%", icon: TrendingUp, trend: "up" },
    { title: "Monthly Revenue", value: "$45.2K", change: "-3%", icon: DollarSign, trend: "down" },
    { title: "Pending Leaves", value: "18", change: "+8%", icon: Calendar, trend: "up" },
  ];

  const activities = [
    {
      title: "New employee onboarded",
      time: "2 hours ago",
      icon: <Users size={20} className="text-indigo-600" />,
      color: "bg-indigo-100"
    },
    {
      title: "Leave request approved",
      time: "5 hours ago",
      icon: <Calendar size={20} className="text-green-600" />,
      color: "bg-green-100"
    },
    {
      title: "Payroll processed",
      time: "1 day ago",
      icon: <DollarSign size={20} className="text-purple-600" />,
      color: "bg-purple-100"
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Overview</h3>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
              <p className="text-slate-500">Chart will be displayed here</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}