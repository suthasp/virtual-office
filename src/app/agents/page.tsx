"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Cpu, Target, Zap, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentChat } from "@/components/agents/AgentChat";
import { AI_AGENTS } from "@/data/mock";
import type { AiAgent } from "@/types";
import { Input } from "@/components/ui/input";

export default function AgentsPage() {
  const [activeChat, setActiveChat] = useState<AiAgent | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "online" | "busy" | "idle">("all");

  const filtered = AI_AGENTS.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: AI_AGENTS.length,
    online: AI_AGENTS.filter(a => a.status === "online").length,
    busy: AI_AGENTS.filter(a => a.status === "busy").length,
    tasksToday: AI_AGENTS.reduce((sum, a) => sum + Math.floor(a.tasks_completed * 0.01), 0),
    avgAccuracy: (AI_AGENTS.reduce((sum, a) => sum + a.accuracy_rate, 0) / AI_AGENTS.length).toFixed(1),
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">AI Agent Center</h1>
            <p className="text-sm text-gray-500">Intelligent agents powering data center operations</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: "Total Agents", value: stats.total, icon: Bot, color: "text-blue-400" },
              { label: "Online", value: stats.online, icon: Cpu, color: "text-emerald-400" },
              { label: "Avg Accuracy", value: `${stats.avgAccuracy}%`, icon: Target, color: "text-purple-400" },
              { label: "Tasks Today", value: stats.tasksToday, icon: Zap, color: "text-yellow-400" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/60 border border-white/10 rounded-lg">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm font-bold text-white">{stat.value}</span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "online", "busy", "idle"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors border ${
                  filter === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-900/60 text-gray-400 border-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filtered.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <AgentCard
                agent={agent}
                onChat={(a) => setActiveChat(activeChat?.id === a.id ? null : a)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bot className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No agents found matching your search</p>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {activeChat && (
          <AgentChat
            agent={activeChat}
            onClose={() => setActiveChat(null)}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
