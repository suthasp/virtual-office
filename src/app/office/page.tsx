"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { IsometricOffice } from "@/components/office/IsometricOffice";
import { DepartmentPanel } from "@/components/office/DepartmentPanel";
import { DEPARTMENTS } from "@/data/mock";
import type { Department } from "@/types";
import { Building2, Users, AlertTriangle, Activity } from "lucide-react";

export default function OfficePage() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const handleDeptClick = (dept: Department) => {
    setSelectedDept(dept.id === selectedDept?.id ? null : dept);
  };

  const stats = [
    { label: "Departments", value: DEPARTMENTS.length, icon: Building2, color: "text-blue-400" },
    { label: "Personnel", value: DEPARTMENTS.reduce((sum, d) => sum + d.headcount, 0), icon: Users, color: "text-purple-400" },
    { label: "Warnings", value: DEPARTMENTS.filter(d => d.status === "warning").length, icon: AlertTriangle, color: "text-yellow-400" },
    { label: "Critical", value: DEPARTMENTS.filter(d => d.status === "critical").length, icon: Activity, color: "text-red-400" },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col h-full p-6 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-white">Virtual Office</h1>
            <p className="text-sm text-gray-500">Interactive isometric view of the data center operations organization</p>
          </div>
          <div className="flex items-center gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/60 border border-white/10 rounded-lg">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm font-bold text-white">{stat.value}</span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Office Map */}
        <div className="flex-1 relative min-h-0">
          <motion.div
            className="h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <IsometricOffice
              onDepartmentClick={handleDeptClick}
              selectedDepartment={selectedDept?.id ?? null}
            />
          </motion.div>

          {/* Department Side Panel */}
          <DepartmentPanel
            department={selectedDept}
            onClose={() => setSelectedDept(null)}
          />
        </div>

        {/* Department Quick Navigation */}
        <div className="shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => handleDeptClick(dept)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  selectedDept?.id === dept.id
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                    : "border-white/10 bg-gray-900/40 text-gray-400 hover:text-white hover:border-white/20"
                }`}
                style={{
                  borderColor: selectedDept?.id === dept.id ? dept.color + "50" : undefined,
                  backgroundColor: selectedDept?.id === dept.id ? dept.color + "15" : undefined,
                  color: selectedDept?.id === dept.id ? dept.color : undefined,
                }}
              >
                <span>{dept.icon}</span>
                <span>{dept.shortName}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  dept.status === "normal" ? "bg-emerald-400" :
                  dept.status === "warning" ? "bg-yellow-400" : "bg-red-400"
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
