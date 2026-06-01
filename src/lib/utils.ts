import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercentage(value: number, total: number): string {
  return `${((value / total) * 100).toFixed(1)}%`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-green-400",
    online: "text-emerald-400",
    offline: "text-red-400",
    idle: "text-gray-400",
    busy: "text-blue-400",
    active: "text-emerald-400",
    resolved: "text-green-400",
    open: "text-red-400",
    "in-progress": "text-blue-400",
    pending: "text-yellow-400",
  };
  return map[status.toLowerCase()] ?? "text-gray-400";
}

export function getStatusBg(status: string): string {
  const map: Record<string, string> = {
    critical: "bg-red-500/20 border-red-500/30",
    high: "bg-orange-500/20 border-orange-500/30",
    medium: "bg-yellow-500/20 border-yellow-500/30",
    low: "bg-green-500/20 border-green-500/30",
    online: "bg-emerald-500/20 border-emerald-500/30",
    offline: "bg-red-500/20 border-red-500/30",
    active: "bg-emerald-500/20 border-emerald-500/30",
    resolved: "bg-green-500/20 border-green-500/30",
    open: "bg-red-500/20 border-red-500/30",
    "in-progress": "bg-blue-500/20 border-blue-500/30",
    pending: "bg-yellow-500/20 border-yellow-500/30",
  };
  return map[status.toLowerCase()] ?? "bg-gray-500/20 border-gray-500/30";
}
