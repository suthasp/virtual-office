"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle, Ticket, Zap, Gauge, Activity, Server,
  Battery, Cpu, TrendingUp, ShieldCheck, Wrench, CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AreaChartComponent, BarChartComponent } from "@/components/dashboard/Charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store";
import { MOCK_INCIDENTS, MOCK_MAINTENANCE, KPI_CHART_DATA } from "@/data/mock";
import { getStatusColor, getStatusBg, cn } from "@/lib/utils";

export default function DashboardPage() {
  const { kpis } = useAppStore();

  const kpiCards = [
    {
      title: "Active Alarms",
      value: kpis.activeAlarms,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "red" as const,
      trend: -25,
      trendLabel: "vs last week",
      alert: kpis.activeAlarms > 10,
    },
    {
      title: "Open Tickets",
      value: kpis.openTickets,
      icon: <Ticket className="w-5 h-5" />,
      color: "yellow" as const,
      trend: -8,
      trendLabel: "vs last week",
    },
    {
      title: "Critical Incidents",
      value: kpis.criticalIncidents,
      icon: <Activity className="w-5 h-5" />,
      color: "red" as const,
      alert: kpis.criticalIncidents > 0,
    },
    {
      title: "PM Completion",
      value: `${kpis.pmCompletion}`,
      unit: "%",
      icon: <Wrench className="w-5 h-5" />,
      color: "green" as const,
      trend: 4,
    },
    {
      title: "CM Completion",
      value: `${kpis.cmCompletion}`,
      unit: "%",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "green" as const,
      trend: 2,
    },
    {
      title: "Monthly KPI",
      value: `${kpis.monthlyKpi}`,
      unit: "%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "blue" as const,
      trend: 1.2,
    },
    {
      title: "UPS Load",
      value: `${kpis.upsLoad}`,
      unit: "%",
      icon: <Battery className="w-5 h-5" />,
      color: "purple" as const,
    },
    {
      title: "PUE",
      value: kpis.pue,
      icon: <Zap className="w-5 h-5" />,
      color: "teal" as const,
      trend: -3,
      trendLabel: "improvement",
    },
    {
      title: "Energy (kWh)",
      value: kpis.energyConsumption.toLocaleString(),
      icon: <Gauge className="w-5 h-5" />,
      color: "yellow" as const,
      trend: -2,
    },
    {
      title: "Capacity Used",
      value: `${kpis.capacityUtilization}`,
      unit: "%",
      icon: <Server className="w-5 h-5" />,
      color: "blue" as const,
    },
    {
      title: "Asset Health",
      value: `${kpis.assetHealthScore}`,
      unit: "%",
      icon: <Cpu className="w-5 h-5" />,
      color: "green" as const,
      trend: 1,
    },
    {
      title: "SLA Compliance",
      value: `${kpis.slaCompliance}`,
      unit: "%",
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "green" as const,
      trend: 0.2,
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Operations Dashboard</h1>
            <p className="text-sm text-gray-500">Real-time data center operations overview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <RefreshCw className="w-3.5 h-3.5" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
        >
          {kpiCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <KpiCard {...card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="xl:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Energy Consumption (kWh)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChartComponent data={KPI_CHART_DATA.energy} color="#f59e0b" height={180} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4 text-teal-400" />
                PUE Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChartComponent data={KPI_CHART_DATA.pue} color="#14b8a6" height={180} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                SLA Compliance (%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChartComponent data={KPI_CHART_DATA.sla} color="#10b981" height={180} />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Incidents */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Active Incidents
                </CardTitle>
                <Badge variant="destructive" className="text-xs">{MOCK_INCIDENTS.filter(i => i.status !== "closed" && i.status !== "resolved").length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_INCIDENTS.slice(0, 5).map((inc) => (
                <motion.div
                  key={inc.id}
                  whileHover={{ x: 2 }}
                  className={cn("border rounded-lg p-2.5 cursor-pointer transition-colors hover:border-white/20", getStatusBg(inc.severity))}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs text-white font-medium leading-tight line-clamp-1">{inc.title}</p>
                    <Badge
                      variant={inc.severity as "critical" | "high" | "medium" | "low"}
                      className="text-xs shrink-0"
                    >
                      {inc.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{inc.id} • {inc.department}</span>
                    <span className={cn("text-xs font-medium", getStatusColor(inc.status))}>{inc.status}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Maintenance Tasks */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  Maintenance Tasks
                </CardTitle>
                <Badge variant="default" className="text-xs">
                  {MOCK_MAINTENANCE.filter(m => m.status !== "completed").length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_MAINTENANCE.map((task) => (
                <div key={task.id} className="border border-white/5 bg-gray-800/30 rounded-lg p-2.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs text-white font-medium leading-tight line-clamp-1">{task.title}</p>
                    <Badge
                      variant={task.type === "preventive" ? "default" : "warning"}
                      className="text-xs shrink-0"
                    >
                      {task.type === "preventive" ? "PM" : "CM"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs font-medium", getStatusColor(task.status))}>{task.status}</span>
                    {task.assigned_to && (
                      <span className="text-xs text-gray-600 truncate max-w-[100px]">{task.assigned_to}</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Department Health */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Department Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "NOC", score: 82, color: "bg-blue-500" },
                { name: "DC Operations", score: 91, color: "bg-purple-500" },
                { name: "PM Team", score: 87, color: "bg-emerald-500" },
                { name: "CM Team", score: 74, color: "bg-yellow-500" },
                { name: "Engineering", score: 94, color: "bg-indigo-500" },
                { name: "Inventory", score: 96, color: "bg-teal-500" },
                { name: "War Room", score: 98, color: "bg-red-500" },
                { name: "AI Center", score: 99, color: "bg-green-500" },
              ].map((dept) => (
                <div key={dept.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-28 shrink-0">{dept.name}</span>
                  <Progress
                    value={dept.score}
                    className="flex-1 h-1.5"
                    indicatorClassName={dept.color}
                  />
                  <span className={cn(
                    "text-xs font-medium w-8 text-right",
                    dept.score >= 90 ? "text-emerald-400" :
                    dept.score >= 75 ? "text-yellow-400" : "text-red-400"
                  )}>
                    {dept.score}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Incident Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Monthly Incident Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent data={KPI_CHART_DATA.incidents} color="#f97316" height={160} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
