"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Loader2, Bot, User, Sparkles } from "lucide-react";
import type { AiAgent } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  agent: AiAgent;
  onClose: () => void;
}

const agentResponses: Record<string, string[]> = {
  noc: [
    "I've analyzed the current network state. There are 12 active alarms — 3 critical, 5 high, 4 medium. The critical ones are on UPS-A-03, Core Switch SW-CORE-01, and CRAC-B-02. Shall I initiate auto-remediation?",
    "Network latency on VLAN-20 has increased by 40ms in the last 15 minutes. Root cause analysis points to SW-CORE-01 experiencing high CPU utilization (94%). I recommend scheduling a maintenance window.",
    "SLA compliance is currently at 99.2%, which is above our target of 99.0%. All major circuits are operational. The NOC team has 23 open tickets, with 5 requiring escalation.",
  ],
  incident: [
    "I've triaged 3 new incidents in the last hour. INC-001 (UPS Failure) has been escalated to Critical and assigned to the CM Team. INC-002 (Network Latency) is under investigation by NOC. Would you like a detailed report?",
    "Based on historical patterns, the current CRAC fault (INC-003) has a 78% probability of being resolved within 6 hours with part replacement. I've already checked inventory — the required part (Refrigerant Valve 4-way) is in stock.",
    "Mean Time to Resolution for this week is 4.2 hours, which is 15% better than last week. Critical incidents are being resolved in an average of 2.1 hours.",
  ],
  energy: [
    "Current PUE is 1.42 — excellent performance. I've identified 3 optimization opportunities: (1) Increase hot aisle containment coverage by 8%, (2) Adjust CRAC set points during low-load periods, (3) Enable server power capping during off-peak. Estimated savings: $8,400/month.",
    "Energy consumption this month is 2,847 kWh, trending 2.3% below last month. The cooling optimization I implemented last Tuesday saved approximately 127 kWh. Renewable energy coverage is at 34%.",
    "UPS efficiency across all zones averages 96.2%. Zone A has the highest load at 73%. I recommend load balancing to Zone C which is only at 52% capacity.",
  ],
  default: [
    "I've processed your request and analyzed the relevant data. Here are my findings: all systems are operating within normal parameters. I'll continue monitoring and alert you to any anomalies.",
    "Based on the current operational data, I recommend reviewing the maintenance schedule for next week. There are 3 high-priority PM tasks due that could impact system availability.",
    "I've completed the analysis. The data shows positive trends in most KPIs. Monthly SLA compliance is at 99.2%, above the 99.0% target. Shall I generate a detailed report?",
  ],
};

function getAgentResponse(agentType: string): string {
  const responses = agentResponses[agentType] || agentResponses.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

const quickPrompts = [
  "Current system status?",
  "Show critical alarms",
  "Generate daily report",
  "Optimize performance",
];

export function AgentChat({ agent, onClose }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm the ${agent.name}. I'm currently ${agent.status} and ready to assist you with ${agent.department} operations. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    const response = getAgentResponse(agent.type);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-6 right-6 w-96 h-[580px] bg-gray-950 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 flex items-center justify-center text-xl">
                {agent.avatar}
              </div>
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-950",
                agent.status === "online" ? "bg-emerald-400" :
                agent.status === "busy" ? "bg-blue-400" : "bg-yellow-400"
              )} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-sm">{agent.name}</span>
                <Sparkles className="w-3 h-3 text-blue-400" />
              </div>
              <p className="text-xs text-gray-500">{agent.department} • {agent.accuracy_rate}% accuracy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-2.5",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                message.role === "assistant"
                  ? "bg-gradient-to-br from-blue-600/40 to-purple-600/40 border border-white/10 text-base"
                  : "bg-blue-600 border border-blue-500"
              )}>
                {message.role === "assistant" ? agent.avatar : <User className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-xl px-3 py-2.5 text-xs leading-relaxed",
                message.role === "assistant"
                  ? "bg-gray-800/60 text-gray-200 border border-white/5"
                  : "bg-blue-600 text-white"
              )}>
                {message.content}
                <p className="text-xs opacity-40 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2.5"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600/40 to-purple-600/40 border border-white/10 flex items-center justify-center text-base shrink-0">
                {agent.avatar}
              </div>
              <div className="bg-gray-800/60 border border-white/5 rounded-xl px-3 py-2.5 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400"
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            className="text-xs px-2.5 py-1 rounded-full bg-gray-800/60 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/10 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 flex gap-2 shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder={`Ask ${agent.name}...`}
          className="flex-1 h-9 text-xs"
          disabled={isTyping || agent.status === "offline"}
        />
        <Button
          onClick={() => sendMessage(input)}
          size="icon-sm"
          disabled={!input.trim() || isTyping || agent.status === "offline"}
          className="h-9 w-9"
        >
          {isTyping ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}
