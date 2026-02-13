import React, { useState } from "react";
import { Bell, Lock, Globe, Moon, Sun, Shield, Eye, EyeOff } from "lucide-react";

const SettingToggle = ({ title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-200 last:border-0">
    <div className="flex-1">
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{description}</p>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-14 h-8 rounded-full transition ${
        enabled ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });

  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Bell size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
              <p className="text-sm text-slate-600">Manage how you receive updates</p>
            </div>
          </div>

          <div className="space-y-2">
            <SettingToggle
              title="Email Notifications"
              description="Receive updates via email"
              enabled={notifications.email}
              onChange={(val) => setNotifications({...notifications, email: val})}
            />
            <SettingToggle
              title="Push Notifications"
              description="Get push notifications on your device"
              enabled={notifications.push}
              onChange={(val) => setNotifications({...notifications, push: val})}
            />
            <SettingToggle
              title="SMS Notifications"
              description="Receive important alerts via SMS"
              enabled={notifications.sms}
              onChange={(val) => setNotifications({...notifications, sms: val})}
            />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Security</h3>
              <p className="text-sm text-slate-600">Keep your account secure</p>
            </div>
          </div>

          <div className="space-y-2">
            <SettingToggle
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              enabled={twoFactor}
              onChange={setTwoFactor}
            />
            
            <div className="py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3">Change Password</h4>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Current password"
                    className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              {darkMode ? <Moon size={20} className="text-orange-600" /> : <Sun size={20} className="text-orange-600" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Appearance</h3>
              <p className="text-sm text-slate-600">Customize your interface</p>
            </div>
          </div>

          <div className="space-y-2">
            <SettingToggle
              title="Dark Mode"
              description="Switch to dark theme"
              enabled={darkMode}
              onChange={setDarkMode}
            />
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Globe size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Language & Region</h3>
              <p className="text-sm text-slate-600">Set your preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Language</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Timezone</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Pacific Time (PT)</option>
                <option>Eastern Time (ET)</option>
                <option>Central Time (CT)</option>
                <option>Mountain Time (MT)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
          Save All Changes
        </button>
      </div>
    </div>
  );
}