"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function TopBar() {
  const { kpis } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null; role: string } | null>(null);

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) return;
        setUser(data.user);
        supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", data.user.id)
          .single()
          .then(({ data: p }) => { if (p) setProfile(p); });
      });
    });
  }, []);

  const notifications = [
    { id: 1, title: "Critical: UPS Failure Zone A", time: "2m ago", type: "critical" },
    { id: 2, title: "High: Network latency spike", time: "15m ago", type: "high" },
    { id: 3, title: "PM Schedule: CRAC Service due", time: "1h ago", type: "medium" },
  ];

  return (
    <header className="h-16 bg-gray-950/80 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 z-20 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search incidents, assets, agents..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/60 border border-white/10 rounded-lg text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors"
          />
        </div>
      </div>

      {/* Center Status Pills */}
      <div className="hidden lg:flex items-center gap-3 mx-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-xs text-red-400 font-medium">{kpis.activeAlarms} Alarms</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="text-xs text-yellow-400 font-medium">{kpis.openTickets} Tickets</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">PUE {kpis.pue}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                </div>
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-white/5 cursor-pointer transition-colors">
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                          n.type === "critical" ? "bg-red-400" :
                          n.type === "high" ? "bg-orange-400" : "bg-yellow-400"
                        }`} />
                        <div>
                          <p className="text-xs text-gray-200">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-white/10">
                  <button className="w-full text-xs text-blue-400 hover:text-blue-300 py-1 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-white leading-tight">{profile?.full_name || user?.email?.split("@")[0] || "User"}</p>
              <p className="text-xs text-gray-500 capitalize">{profile?.role || "viewer"}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{profile?.full_name || user?.email?.split("@")[0] || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  <Badge variant="default" className="mt-1.5 text-xs capitalize">{profile?.role || "viewer"}</Badge>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={async () => {
                      const { createClient } = await import("@/lib/supabase/client");
                      await createClient().auth.signOut();
                      window.location.href = "/auth/login";
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
