import React from "react";
import { DollarSign } from "lucide-react";

export default function Payroll() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payroll</h1>
        <p className="text-slate-600">Manage employee compensation</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
        <DollarSign size={64} className="mx-auto text-green-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Payroll System</h3>
        <p className="text-slate-600">Payroll management features will be displayed here</p>
      </div>
    </div>
  );
}