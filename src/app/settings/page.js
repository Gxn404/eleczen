"use client";

import { Bell, Monitor, Moon, Shield, Sun, User } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="glass-panel rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Monitor className="text-neon-blue" /> Appearance
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                theme === "light"
                  ? "bg-neon-blue/10 border-neon-blue text-neon-blue"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Sun className="w-6 h-6" />
              <span className="font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                theme === "dark"
                  ? "bg-neon-blue/10 border-neon-blue text-neon-blue"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Moon className="w-6 h-6" />
              <span className="font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                theme === "system"
                  ? "bg-neon-blue/10 border-neon-blue text-neon-blue"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Monitor className="w-6 h-6" />
              <span className="font-medium">System</span>
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="glass-panel rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="text-neon-purple" /> Notifications
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <h3 className="font-medium text-white">Email Notifications</h3>
              <p className="text-sm text-gray-400">
                Receive updates about your circuits and community activity.
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications ? "bg-neon-green" : "bg-gray-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  notifications ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Account */}
        <section className="glass-panel rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="text-red-400" /> Security
          </h2>

          <div className="space-y-4">
            <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-white flex justify-between items-center">
              <span>Change Password</span>
              <span className="text-gray-500">Last changed 3 months ago</span>
            </button>
            <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-red-400 hover:text-red-300 hover:border-red-500/30">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
