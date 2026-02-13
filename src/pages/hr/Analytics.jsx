import React from "react";
import { TrendingUp, BarChart2 } from "lucide-react";

export default function Analytics() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-600">View insights and reports</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
        <TrendingUp size={64} className="mx-auto text-purple-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Analytics Dashboard</h3>
        <p className="text-slate-600">Advanced analytics and reporting will be displayed here</p>
      </div>
    </div>
  );
}