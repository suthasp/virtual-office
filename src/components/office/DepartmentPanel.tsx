"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, AlertTriangle, CheckCircle, TrendingUp, Activity, Wrench } from "lucide-react";
import type { Department } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChartComponent } from "@/components/dashboard/Charts";
import { MOCK_INCIDENTS, MOCK_MAINTENANCE } from "@/data/mock";
import { getStatusColor, getStatusBg } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DepartmentPanelProps {
  department: Department | null;
  onClose: () => void;
}

const deptKpiMap: Record<string, { label: string; value: string | number; unit?: string; color?: string }[]> = {
  noc: [
    { label: "MTTR", value: "14", unit: "min", color: "text-blue-400" },
    { label: "SLA Compliance", value: "99.2", unit: "%", color: "text-emerald-400" },
    { label: "Active Alarms", value: 12, color: "text-red-400" },
    { label: "Events/Hour", value: 847, color: "text-purple-400" },
    { label: "Availability", value: "99.97", unit: "%", color: "text-emerald-400" },
    { label: "Open Tickets", value: 23, color: "text-yellow-400" },
  ],
  dco: [
    { label: "PUE", value: "1.42", color: "text-teal-400" },
    { label: "Power Load", value: "68", unit: "%", color: "text-blue-400" },
    { label: "Temp (Avg)", value: "22.4", unit: "°C", color: "text-emerald-400" },
    { label: "Humidity", value: "48", unit: "%", color: "text-blue-400" },
    { label: "Rack Utilization", value: "73", unit: "%", color: "text-purple-400" },
    { label: "UPS Redundancy", value: "N+1", color: "text-emerald-400" },
  ],
  pm: [
    { label: "PM Completion", value: "87", unit: "%", color: "text-emerald-400" },
    { label: "Scheduled This Month", value: 24, color: "text-blue-400" },
    { label: "Completed", value: 21, color: "text-emerald-400" },
    { label: "Overdue", value: 2, color: "text-red-400" },
    { label: "MTBF Improvement", value: "+12", unit: "%", color: "text-emerald-400" },
    { label: "Work Orders Open", value: 6, color: "text-yellow-400" },
  ],
  cm: [
    { label: "CM Completion", value: "92", unit: "%", color: "text-emerald-400" },
    { label: "Active Repairs", value: 3, color: "text-red-400" },
    { label: "Avg Resolution", value: "4.2", unit: "hr", color: "text-blue-400" },
    { label: "Spare Parts Used", value: 14, color: "text-purple-400" },
    { label: "Escalated", value: 1, color: "text-orange-400" },
    { label: "Cost This Month", value: "$12.4K", color: "text-yellow-400" },
  ],
  eng: [
    { label: "Capacity Utilization", value: "73", unit: "%", color: "text-blue-400" },
    { label: "Projects Active", value: 7, color: "text-purple-400" },
    { label: "Design Reviews", value: 3, color: "text-blue-400" },
    { label: "Change Requests", value: 12, color: "text-yellow-400" },
    { label: "RFCs Approved", value: 5, color: "text-emerald-400" },
    { label: "Tech Debt Score", value: 78, color: "text-orange-400" },
  ],
  inv: [
    { label: "SKUs Total", value: 1247, color: "text-blue-400" },
    { label: "Low Stock Items", value: 8, color: "text-yellow-400" },
    { label: "Out of Stock", value: 2, color: "text-red-400" },
    { label: "Orders Pending", value: 5, color: "text-purple-400" },
    { label: "Inventory Value", value: "$2.1M", color: "text-emerald-400" },
    { label: "Turnover Rate", value: "94", unit: "%", color: "text-teal-400" },
  ],
  exec: [
    { label: "Monthly KPI", value: "94.5", unit: "%", color: "text-emerald-400" },
    { label: "Cost vs Budget", value: "-3.2", unit: "%", color: "text-emerald-400" },
    { label: "Open Escalations", value: 2, color: "text-red-400" },
    { label: "SLA Breaches", value: 0, color: "text-emerald-400" },
    { label: "YTD Availability", value: "99.94", unit: "%", color: "text-emerald-400" },
    { label: "Customer Sat.", value: "4.7/5", color: "text-blue-400" },
  ],
  ai: [
    { label: "Agents Online", value: 8, color: "text-emerald-400" },
    { label: "Tasks Today", value: 247, color: "text-blue-400" },
    { label: "Avg Accuracy", value: "97.4", unit: "%", color: "text-emerald-400" },
    { label: "Automations", value: 1842, color: "text-purple-400" },
    { label: "Avg Response", value: "1.8", unit: "s", color: "text-teal-400" },
    { label: "Cost Savings", value: "$48K", color: "text-emerald-400" },
  ],
};

const deptChartData: Record<string, { name: string; value: number }[]> = {
  noc: [
    { name: "Mon", value: 18 }, { name: "Tue", value: 24 }, { name: "Wed", value: 14 },
    { name: "Thu", value: 32 }, { name: "Fri", value: 19 }, { name: "Sat", value: 8 }, { name: "Sun", value: 12 },
  ],
  dco: [
    { name: "Mon", value: 1.44 }, { name: "Tue", value: 1.43 }, { name: "Wed", value: 1.45 },
    { name: "Thu", value: 1.42 }, { name: "Fri", value: 1.41 }, { name: "Sat", value: 1.43 }, { name: "Sun", value: 1.42 },
  ],
  default: [
    { name: "Mon", value: 75 }, { name: "Tue", value: 82 }, { name: "Wed", value: 88 },
    { name: "Thu", value: 79 }, { name: "Fri", value: 91 }, { name: "Sat", value: 85 }, { name: "Sun", value: 87 },
  ],
};

export function DepartmentPanel({ department, onClose }: DepartmentPanelProps) {
  if (!department) return null;

  const kpis = deptKpiMap[department.id] || deptKpiMap.noc;
  const chartData = deptChartData[department.id] || deptChartData.default;

  const relatedIncidents = MOCK_INCIDENTS.filter(
    (i) => i.department === department.shortName || i.department === department.name
  ).slice(0, 3);

  const relatedMaintenance = MOCK_MAINTENANCE.filter(
    (m) => m.department === department.shortName || m.department === department.name
  ).slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div
        key={department.id}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 bottom-0 w-96 bg-gray-950/95 backdrop-blur-xl border-l border-white/10 z-40 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div
          className="p-4 border-b border-white/10 shrink-0"
          style={{ borderTopColor: department.color + "40" }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: department.color + "20", border: `1px solid ${department.color}30` }}
              >
                {department.icon}
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">{department.name}</h2>
                <p className="text-xs text-gray-500">{department.headcount > 0 ? `${department.headcount} personnel` : "AI-Powered"}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400">{department.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border",
                department.status === "normal" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                department.status === "warning" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                "bg-red-500/10 border-red-500/30 text-red-400"
              )}
            >
              <Activity className="w-3 h-3" />
              {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* KPI Grid */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-2">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-900/60 border border-white/5 rounded-lg p-2.5"
                >
                  <p className="text-xs text-gray-500 mb-0.5">{kpi.label}</p>
                  <p className={cn("text-base font-bold", kpi.color || "text-white")}>
                    {kpi.value}
                    {kpi.unit && <span className="text-xs text-gray-500 ml-0.5 font-normal">{kpi.unit}</span>}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              7-Day Performance
            </h3>
            <div className="bg-gray-900/60 border border-white/5 rounded-lg p-3">
              <AreaChartComponent
                data={chartData}
                color={department.color}
                height={120}
              />
            </div>
          </div>

          {/* Team Status */}
          {department.headcount > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Team Status
              </h3>
              <div className="bg-gray-900/60 border border-white/5 rounded-lg p-3 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">On Duty</span>
                  <div className="flex items-center gap-2">
                    <Progress value={75} className="w-20 h-1" indicatorClassName="bg-emerald-500" />
                    <span className="text-white font-medium">{Math.floor(department.headcount * 0.75)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">On Field</span>
                  <div className="flex items-center gap-2">
                    <Progress value={20} className="w-20 h-1" indicatorClassName="bg-blue-500" />
                    <span className="text-white font-medium">{Math.floor(department.headcount * 0.2)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Off Duty</span>
                  <div className="flex items-center gap-2">
                    <Progress value={5} className="w-20 h-1" indicatorClassName="bg-gray-500" />
                    <span className="text-white font-medium">{Math.floor(department.headcount * 0.05)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Incidents */}
          {relatedIncidents.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Active Incidents
              </h3>
              <div className="space-y-2">
                {relatedIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={cn("border rounded-lg p-2.5", getStatusBg(inc.severity))}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-white font-medium leading-tight">{inc.title}</p>
                      <Badge
                        variant={inc.severity as "critical" | "high" | "medium" | "low"}
                        className="text-xs shrink-0"
                      >
                        {inc.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{inc.id} • {inc.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance */}
          {relatedMaintenance.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Maintenance Tasks
              </h3>
              <div className="space-y-2">
                {relatedMaintenance.map((task) => (
                  <div
                    key={task.id}
                    className="border border-white/5 bg-gray-900/40 rounded-lg p-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-white font-medium leading-tight">{task.title}</p>
                      <Badge
                        variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "default" : "secondary"}
                        className="text-xs shrink-0"
                      >
                        {task.type}
                      </Badge>
                    </div>
                    <p className={cn("text-xs mt-0.5", getStatusColor(task.status))}>
                      {task.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
