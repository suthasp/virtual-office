"use client";

import { useState, useEffect } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Shield, Database, Palette, Globe,
  Save, Key, Mail, Building2, ChevronRight,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Database },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "organization", label: "Organization", icon: Building2 },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null; role: string; department: string | null } | null>(null);

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) return;
        setUser(data.user);
        supabase
          .from("profiles")
          .select("full_name, role, department")
          .eq("id", data.user.id)
          .single()
          .then(({ data: p }) => { if (p) setProfile(p); });
      });
    });
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account and application preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-56 shrink-0">
            <nav className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                    activeSection === s.id
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <s.icon className="w-4 h-4" />
                    {s.label}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" /> Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Change Avatar</Button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Full Name</label>
                        <Input defaultValue={profile?.full_name || user?.email?.split("@")[0] || ""} key={profile?.full_name} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Email</label>
                        <Input defaultValue={user?.email || ""} type="email" disabled />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Department</label>
                        <Input defaultValue={profile?.department || ""} key={profile?.department} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1.5">Role</label>
                        <Input defaultValue={profile?.role || "viewer"} disabled className="capitalize" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-400" /> Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">Current Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">New Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">Confirm New Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-yellow-400" /> Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Critical Incidents", desc: "Immediate alerts for critical incidents", enabled: true },
                      { label: "High Severity Alarms", desc: "Alerts for high severity alarms", enabled: true },
                      { label: "Maintenance Reminders", desc: "Upcoming scheduled maintenance", enabled: true },
                      { label: "Daily Summary Report", desc: "End-of-day operational summary", enabled: false },
                      { label: "SLA Breach Warnings", desc: "Alerts when SLA is at risk", enabled: true },
                      { label: "Agent Task Completions", desc: "When AI agents complete major tasks", enabled: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm text-white">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <button
                          className={cn(
                            "relative w-10 h-5.5 rounded-full transition-colors",
                            item.enabled ? "bg-blue-600" : "bg-gray-700"
                          )}
                        >
                          <span className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                            item.enabled ? "translate-x-5" : "translate-x-0.5"
                          )} />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === "integrations" && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Database className="w-4 h-4 text-teal-400" /> Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Supabase", desc: "Database & authentication", status: "Connected", color: "text-emerald-400" },
                      { name: "Nagios", desc: "Network monitoring", status: "Connected", color: "text-emerald-400" },
                      { name: "Zabbix", desc: "Infrastructure monitoring", status: "Connected", color: "text-emerald-400" },
                      { name: "ServiceNow", desc: "IT service management", status: "Disconnected", color: "text-gray-500" },
                      { name: "PagerDuty", desc: "On-call alerting", status: "Connected", color: "text-emerald-400" },
                      { name: "Slack", desc: "Team notifications", status: "Disconnected", color: "text-gray-500" },
                    ].map((integration) => (
                      <div key={integration.name} className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-white/5">
                        <div>
                          <p className="text-sm text-white font-medium">{integration.name}</p>
                          <p className="text-xs text-gray-500">{integration.desc}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium ${integration.color}`}>{integration.status}</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            {integration.status === "Connected" ? "Configure" : "Connect"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!["profile", "notifications", "integrations"].includes(activeSection) && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardContent className="py-16 text-center">
                    <Settings className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm capitalize">{activeSection} settings</p>
                    <p className="text-gray-600 text-xs mt-1">Configuration options coming soon</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSave} className="gap-2 min-w-24">
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
