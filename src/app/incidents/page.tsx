"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Plus, Search, Filter, Eye, Edit2,
  Clock, User, Tag, TrendingDown,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_INCIDENTS } from "@/data/mock";
import { getStatusColor, getStatusBg, cn } from "@/lib/utils";
import type { IncidentSeverity, IncidentStatus } from "@/types";

const severityOrder: Record<IncidentSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default function IncidentsPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");

  const filtered = MOCK_INCIDENTS
    .filter((inc) => {
      const matchesSearch =
        inc.title.toLowerCase().includes(search.toLowerCase()) ||
        inc.id.toLowerCase().includes(search.toLowerCase()) ||
        inc.department.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === "all" || inc.severity === severityFilter;
      const matchesStatus = statusFilter === "all" || inc.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    })
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const counts = {
    total: MOCK_INCIDENTS.length,
    critical: MOCK_INCIDENTS.filter(i => i.severity === "critical").length,
    high: MOCK_INCIDENTS.filter(i => i.severity === "high").length,
    open: MOCK_INCIDENTS.filter(i => i.status === "open").length,
    inProgress: MOCK_INCIDENTS.filter(i => i.status === "in-progress").length,
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Incident Management</h1>
            <p className="text-sm text-gray-500">Track and manage data center incidents</p>
          </div>
          <Button size="sm" className="gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            New Incident
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total", value: counts.total, color: "text-white" },
            { label: "Critical", value: counts.critical, color: "text-red-400" },
            { label: "High", value: counts.high, color: "text-orange-400" },
            { label: "Open", value: counts.open, color: "text-yellow-400" },
            { label: "In Progress", value: counts.inProgress, color: "text-blue-400" },
          ].map((item) => (
            <Card key={item.label} className="text-center py-3">
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center text-xs text-gray-500 gap-1">
              <Filter className="w-3.5 h-3.5" /> Severity:
            </span>
            {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium capitalize border transition-colors",
                  severityFilter === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-900/60 text-gray-400 border-white/10 hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center text-xs text-gray-500 gap-1">Status:</span>
            {(["all", "open", "in-progress", "resolved"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as IncidentStatus | "all")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium capitalize border transition-colors",
                  statusFilter === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-900/60 text-gray-400 border-white/10 hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Incidents Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Incidents ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["ID", "Title", "Severity", "Status", "Department", "Assigned To", "Created", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((inc, i) => (
                    <motion.tr
                      key={inc.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-blue-400">{inc.id}</span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm text-white font-medium truncate">{inc.title}</p>
                        <p className="text-xs text-gray-500 truncate">{inc.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={inc.severity as "critical" | "high" | "medium" | "low"}>
                          {inc.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-medium capitalize", getStatusColor(inc.status))}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-400">{inc.department}</span>
                      </td>
                      <td className="px-4 py-3">
                        {inc.assigned_to ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center">
                              <User className="w-3 h-3 text-blue-400" />
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{inc.assigned_to}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(inc.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <TrendingDown className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No incidents found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
