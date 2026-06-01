"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Plus, Search, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MOCK_MAINTENANCE } from "@/data/mock";
import { getStatusColor, cn } from "@/lib/utils";

export default function MaintenancePage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "preventive" | "corrective">("all");

  const filtered = MOCK_MAINTENANCE.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const pmTotal = MOCK_MAINTENANCE.filter(t => t.type === "preventive").length;
  const pmDone = MOCK_MAINTENANCE.filter(t => t.type === "preventive" && t.status === "completed").length;
  const cmTotal = MOCK_MAINTENANCE.filter(t => t.type === "corrective").length;
  const cmDone = MOCK_MAINTENANCE.filter(t => t.type === "corrective" && t.status === "completed").length;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Maintenance Management</h1>
            <p className="text-sm text-gray-500">Preventive and corrective maintenance scheduling</p>
          </div>
          <Button size="sm" className="gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Preventive Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-white">{pmDone}/{pmTotal}</span>
                <span className="text-lg font-semibold text-emerald-400">
                  {pmTotal > 0 ? Math.round((pmDone / pmTotal) * 100) : 0}%
                </span>
              </div>
              <Progress
                value={pmTotal > 0 ? (pmDone / pmTotal) * 100 : 0}
                className="h-2"
                indicatorClassName="bg-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-2">Tasks completed this period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Corrective Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-white">{cmDone}/{cmTotal}</span>
                <span className="text-lg font-semibold text-orange-400">
                  {cmTotal > 0 ? Math.round((cmDone / cmTotal) * 100) : 0}%
                </span>
              </div>
              <Progress
                value={cmTotal > 0 ? (cmDone / cmTotal) * 100 : 0}
                className="h-2"
                indicatorClassName="bg-orange-500"
              />
              <p className="text-xs text-gray-500 mt-2">Emergency repairs completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "preventive", "corrective"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium capitalize border transition-colors",
                  typeFilter === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-900/60 text-gray-400 border-white/10 hover:text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["scheduled", "in-progress", "completed", "cancelled"] as const).map((status) => {
            const tasks = filtered.filter((t) => t.status === status);
            const statusLabels = {
              scheduled: { label: "Scheduled", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              "in-progress": { label: "In Progress", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
              completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              cancelled: { label: "Cancelled", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" },
            };
            const s = statusLabels[status];

            return (
              <div key={status} className={cn("rounded-xl border p-3", s.bg, s.border)}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={cn("text-xs font-semibold uppercase tracking-wider", s.color)}>{s.label}</h3>
                  <span className={cn("text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center", s.color, "bg-gray-900/60")}>
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-gray-900/60 border border-white/8 rounded-lg p-3 cursor-pointer hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs text-white font-medium leading-tight">{task.title}</p>
                        <Badge
                          variant={task.type === "preventive" ? "success" : "warning"}
                          className="text-xs shrink-0"
                        >
                          {task.type === "preventive" ? "PM" : "CM"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
                      {task.assigned_to && (
                        <p className="text-xs text-gray-600 truncate">{task.assigned_to}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.scheduled_date).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-xs text-gray-600 text-center py-4">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
