import React from "react";
import { Calendar, Clock } from "lucide-react";

export default function Attendance() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance</h1>
        <p className="text-slate-600">Track employee attendance and time</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
        <Calendar size={64} className="mx-auto text-indigo-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Attendance Management</h3>
        <p className="text-slate-600">Attendance tracking features will be displayed here</p>
      </div>
    </div>
  );
}