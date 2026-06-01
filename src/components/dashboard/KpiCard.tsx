"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "teal";
  alert?: boolean;
  className?: string;
}

const colorMap = {
  blue: {
    icon: "bg-blue-500/20 text-blue-400",
    glow: "shadow-blue-500/10",
    border: "border-blue-500/20",
    value: "text-blue-100",
  },
  green: {
    icon: "bg-emerald-500/20 text-emerald-400",
    glow: "shadow-emerald-500/10",
    border: "border-emerald-500/20",
    value: "text-emerald-100",
  },
  red: {
    icon: "bg-red-500/20 text-red-400",
    glow: "shadow-red-500/10",
    border: "border-red-500/20",
    value: "text-red-100",
  },
  yellow: {
    icon: "bg-yellow-500/20 text-yellow-400",
    glow: "shadow-yellow-500/10",
    border: "border-yellow-500/20",
    value: "text-yellow-100",
  },
  purple: {
    icon: "bg-purple-500/20 text-purple-400",
    glow: "shadow-purple-500/10",
    border: "border-purple-500/20",
    value: "text-purple-100",
  },
  teal: {
    icon: "bg-teal-500/20 text-teal-400",
    glow: "shadow-teal-500/10",
    border: "border-teal-500/20",
    value: "text-teal-100",
  },
};

export function KpiCard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  icon,
  color = "blue",
  alert = false,
  className,
}: KpiCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative rounded-xl border bg-gray-900/60 backdrop-blur-sm p-4 shadow-xl",
        alert ? "border-red-500/40 shadow-red-500/10" : `border-white/10 ${colors.glow}`,
        className
      )}
    >
      {alert && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
      )}

      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.icon)}>
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              trend > 0
                ? "bg-emerald-500/10 text-emerald-400"
                : trend < 0
                ? "bg-red-500/10 text-red-400"
                : "bg-gray-500/10 text-gray-400"
            )}
          >
            {trend > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-2xl font-bold", colors.value)}>{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        {trendLabel && (
          <p className="text-xs text-gray-600 mt-1">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
