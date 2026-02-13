import React from "react";
import { Users, Search, Filter, Plus } from "lucide-react";

export default function Employees() {
  const employees = [
    { id: 1, name: "Alice Johnson", position: "Software Engineer", department: "Engineering", status: "Active" },
    { id: 2, name: "Bob Smith", position: "Product Manager", department: "Product", status: "Active" },
    { id: 3, name: "Carol White", position: "Designer", department: "Design", status: "On Leave" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Employees</h1>
          <p className="text-slate-600">Manage your team members</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Position</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Department</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="py-3 px-4 font-medium">{emp.name}</td>
                <td className="py-3 px-4 text-slate-600">{emp.position}</td>
                <td className="py-3 px-4 text-slate-600">{emp.department}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}