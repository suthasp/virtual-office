"use client";

import { motion } from "framer-motion";
import { BarChart3, Download, TrendingUp, Zap, ShieldCheck, Activity, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChartComponent, BarChartComponent } from "@/components/dashboard/Charts";
import { KPI_CHART_DATA } from "@/data/mock";
import { Progress } from "@/components/ui/progress";

const reports = [
  {
    title: "Monthly Operations Report",
    description: "Comprehensive overview of all operational KPIs for the current month",
    date: "June 2024",
    status: "Ready",
    type: "Operations",
  },
  {
    title: "Energy Efficiency Analysis",
    description: "PUE trends, energy consumption patterns, and optimization recommendations",
    date: "June 2024",
    status: "Ready",
    type: "Energy",
  },
  {
    title: "Incident RCA Summary",
    description: "Root cause analysis for critical incidents in the current month",
    date: "June 2024",
    status: "Ready",
    type: "Incidents",
  },
  {
    title: "PM/CM Completion Report",
    description: "Preventive and corrective maintenance completion rates and trends",
    date: "June 2024",
    status: "Generating",
    type: "Maintenance",
  },
  {
    title: "Asset Health Dashboard",
    description: "Comprehensive asset health scores, lifecycle status, and risk assessment",
    date: "June 2024",
    status: "Ready",
    type: "Assets",
  },
  {
    title: "SLA Compliance Report",
    description: "Detailed SLA performance metrics against agreed service levels",
    date: "June 2024",
    status: "Ready",
    type: "SLA",
  },
];

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-sm text-gray-500">Data-driven insights for data center operations</p>
          </div>
          <Button size="sm" className="gap-2 self-start sm:self-auto">
            <BarChart3 className="w-4 h-4" />
            Custom Report
          </Button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Energy Consumption (6 Months)
                </CardTitle>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                  <Download className="w-3.5 h-3.5" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChartComponent data={KPI_CHART_DATA.energy} color="#f59e0b" height={200} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  SLA Compliance (%)
                </CardTitle>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                  <Download className="w-3.5 h-3.5" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChartComponent data={KPI_CHART_DATA.sla} color="#10b981" height={200} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-400" />
                  Monthly Incidents
                </CardTitle>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                  <Download className="w-3.5 h-3.5" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BarChartComponent data={KPI_CHART_DATA.incidents} color="#f97316" height={200} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  PUE Trend
                </CardTitle>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                  <Download className="w-3.5 h-3.5" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChartComponent data={KPI_CHART_DATA.pue} color="#14b8a6" height={200} />
            </CardContent>
          </Card>
        </div>

        {/* KPI Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly KPI Summary — June 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Availability", target: 99.9, actual: 99.97, unit: "%" },
                { label: "PUE", target: 1.4, actual: 1.42, unit: "", inverse: true },
                { label: "PM Completion", target: 90, actual: 87, unit: "%" },
                { label: "SLA Compliance", target: 99, actual: 99.2, unit: "%" },
                { label: "MTTR (Critical)", target: 4, actual: 2.1, unit: "hr", inverse: true },
                { label: "Asset Health", target: 85, actual: 91, unit: "%" },
                { label: "Energy vs Budget", target: 100, actual: 96.8, unit: "%" },
                { label: "Incident Rate", target: 15, actual: 12, unit: "/mo", inverse: true },
              ].map((kpi) => {
                const pct = kpi.inverse
                  ? Math.min(100, (kpi.target / kpi.actual) * 100)
                  : Math.min(100, (kpi.actual / kpi.target) * 100);
                const onTarget = kpi.inverse ? kpi.actual <= kpi.target : kpi.actual >= kpi.target;
                return (
                  <div key={kpi.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{kpi.label}</span>
                      <span className={`text-xs font-bold ${onTarget ? "text-emerald-400" : "text-yellow-400"}`}>
                        {kpi.actual}{kpi.unit}
                      </span>
                    </div>
                    <Progress
                      value={pct}
                      className="h-1.5"
                      indicatorClassName={onTarget ? "bg-emerald-500" : "bg-yellow-500"}
                    />
                    <p className="text-xs text-gray-600">Target: {kpi.target}{kpi.unit}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Available Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reports.map((report, i) => (
              <motion.div
                key={report.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-gray-900/60 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{report.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{report.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    report.status === "Ready"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-blue-500/15 text-blue-400"
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5" />
                    {report.date}
                  </div>
                  <Button
                    size="sm"
                    variant={report.status === "Ready" ? "outline" : "secondary"}
                    className="h-7 text-xs gap-1"
                    disabled={report.status !== "Ready"}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
