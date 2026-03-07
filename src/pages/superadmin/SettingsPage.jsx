import React, { useState } from "react";
import { Eye, EyeOff, Check, Key } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { user, changePassword } = useAuth();

  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: ""
  });

  const strength = () => {
    const p = passwords.newPass;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-emerald-400"];
  const strengthText  = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-emerald-500"];

  const handleSave = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) return;
    if (passwords.newPass !== passwords.confirm) return;

    setSaving(true);

    const res = await changePassword(
      user?.userId,
      passwords.current,
      passwords.newPass
    );

    if (res.success) {
      setSaved(true);
      setPasswords({ current: "", newPass: "", confirm: "" });
      toast.success(res.message || "Password updated successfully!");
      setTimeout(() => setSaved(false), 3000);
    } else {
      toast.error(res.message || "Failed to change password.");
    }

    setSaving(false);
  };

  const s = strength();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account preferences and security</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-lg">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
            <Key size={18} className="text-violet-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">Use a strong, unique password</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Current Password */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-slate-50"
              />
              <button onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-slate-50"
              />
              <button onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength Bar */}
            {passwords.newPass && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= s ? strengthColor[s] : "bg-slate-200"}`} />
                  ))}
                </div>
                <p className={`text-xs font-semibold ${strengthText[s]}`}>{strengthLabel[s]}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Confirm new password"
                className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-slate-50 ${
                  passwords.confirm && passwords.newPass !== passwords.confirm
                    ? "border-red-300 focus:ring-red-300"
                    : "border-slate-200"
                }`}
              />
              <button onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwords.confirm && passwords.newPass !== passwords.confirm && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Update Button */}
          <button
            onClick={handleSave}
            disabled={
              saving ||
              !passwords.current ||
              !passwords.newPass ||
              passwords.newPass !== passwords.confirm
            }
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            }`}
          >
            {saved ? (
              <><Check size={16} /> Password Updated</>
            ) : saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</>
            ) : (
              "Update Password"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}