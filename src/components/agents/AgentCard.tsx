"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, Zap, Target } from "lucide-react";
import type { AiAgent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: AiAgent;
  onChat: (agent: AiAgent) => void;
}

const statusConfig = {
  online: { color: "text-emerald-400", bg: "bg-emerald-400", label: "Online", badgeVariant: "success" as const },
  busy: { color: "text-blue-400", bg: "bg-blue-400", label: "Busy", badgeVariant: "default" as const },
  idle: { color: "text-yellow-400", bg: "bg-yellow-400", label: "Idle", badgeVariant: "warning" as const },
  offline: { color: "text-gray-400", bg: "bg-gray-400", label: "Offline", badgeVariant: "secondary" as const },
};

export function AgentCard({ agent, onChat }: AgentCardProps) {
  const status = statusConfig[agent.status] || statusConfig.offline;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-900/60 border border-white/10 rounded-xl p-4 flex flex-col gap-4 hover:border-white/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 flex items-center justify-center text-2xl">
              {agent.avatar}
            </div>
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900",
                status.bg
              )}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
            <p className="text-xs text-gray-500">{agent.department}</p>
          </div>
        </div>
        <Badge variant={status.badgeVariant} className="text-xs">
          {status.label}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{agent.description}</p>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-800/40 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
            <Cpu className="w-3 h-3" />
          </div>
          <p className="text-xs font-bold text-white">{agent.tasks_completed.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Tasks</p>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
            <Target className="w-3 h-3" />
          </div>
          <p className="text-xs font-bold text-white">{agent.accuracy_rate}%</p>
          <p className="text-xs text-gray-600">Accuracy</p>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
            <Zap className="w-3 h-3" />
          </div>
          <p className="text-xs font-bold text-white">{agent.response_time}s</p>
          <p className="text-xs text-gray-600">Response</p>
        </div>
      </div>

      {/* Accuracy Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Accuracy Rate</span>
          <span className="text-xs font-medium text-emerald-400">{agent.accuracy_rate}%</span>
        </div>
        <Progress
          value={agent.accuracy_rate}
          className="h-1.5"
          indicatorClassName={
            agent.accuracy_rate >= 95 ? "bg-emerald-500" :
            agent.accuracy_rate >= 85 ? "bg-blue-500" : "bg-yellow-500"
          }
        />
      </div>

      {/* Chat Button */}
      <Button
        onClick={() => onChat(agent)}
        size="sm"
        variant={agent.status === "offline" ? "secondary" : "default"}
        disabled={agent.status === "offline"}
        className="w-full"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        {agent.status === "offline" ? "Offline" : "Chat with Agent"}
      </Button>
    </motion.div>
  );
}
