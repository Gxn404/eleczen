import { Activity, Cpu, FileText, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/users" className="glass-panel p-6 rounded-xl border border-white/10 hover:border-neon-blue/50 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium group-hover:text-white transition-colors">Total Users</h3>
            <Users className="text-neon-blue w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white">1,234</p>
          <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> +12% this month
          </p>
        </Link>

        <Link href="/admin/blog" className="glass-panel p-6 rounded-xl border border-white/10 hover:border-neon-purple/50 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium group-hover:text-white transition-colors">Blog Posts</h3>
            <FileText className="text-neon-purple w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white">45</p>
          <p className="text-sm text-gray-500 mt-2">5 drafts pending</p>
        </Link>

        <div className="glass-panel p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Components</h3>
            <Cpu className="text-neon-green w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white">892</p>
          <p className="text-sm text-green-400 mt-2">+24 new added</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">System Status</h3>
            <Activity className="text-red-400 w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white">99.9%</p>
          <p className="text-sm text-gray-500 mt-2">All systems operational</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                  U{i}
                </div>
                <div>
                  <p className="text-white font-medium">User {i} registered</p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                New User
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
