"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, Server, Wifi, Thermometer, Battery, Activity, Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MOCK_ASSETS } from "@/data/mock";
import { getStatusColor, cn } from "@/lib/utils";
import type { AssetStatus } from "@/types";

const typeIcons: Record<string, React.ReactNode> = {
  "UPS": <Battery className="w-4 h-4" />,
  "CRAC": <Thermometer className="w-4 h-4" />,
  "Generator": <Activity className="w-4 h-4" />,
  "Network Switch": <Wifi className="w-4 h-4" />,
};

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");

  const filtered = MOCK_ASSETS.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.type.toLowerCase().includes(search.toLowerCase()) ||
      asset.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    online: MOCK_ASSETS.filter(a => a.status === "online").length,
    offline: MOCK_ASSETS.filter(a => a.status === "offline").length,
    maintenance: MOCK_ASSETS.filter(a => a.status === "maintenance").length,
    total: MOCK_ASSETS.length,
  };

  const avgHealth = Math.round(
    MOCK_ASSETS.reduce((sum, a) => sum + a.health_score, 0) / MOCK_ASSETS.length
  );

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Asset Management</h1>
            <p className="text-sm text-gray-500">Infrastructure asset tracking and health monitoring</p>
          </div>
          <Button size="sm" className="gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Add Asset
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Assets", value: statusCounts.total, color: "text-white", bg: "bg-gray-800/40" },
            { label: "Online", value: statusCounts.online, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Offline", value: statusCounts.offline, color: "text-red-400", bg: "bg-red-500/10" },
            { label: "Avg Health", value: `${avgHealth}%`, color: "text-blue-400", bg: "bg-blue-500/10" },
          ].map((item) => (
            <div key={item.label} className={cn("rounded-xl border border-white/5 p-3 text-center", item.bg)}>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "online", "offline", "maintenance"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium capitalize border transition-colors",
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

        {/* Asset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <Card className="hover:border-white/20 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        asset.status === "online" ? "bg-emerald-500/15 text-emerald-400" :
                        asset.status === "offline" ? "bg-red-500/15 text-red-400" :
                        "bg-yellow-500/15 text-yellow-400"
                      )}>
                        {typeIcons[asset.type] ?? <Server className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight">{asset.name}</p>
                        <p className="text-xs text-gray-500">{asset.type}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        asset.status === "online" ? "success" :
                        asset.status === "offline" ? "destructive" : "warning"
                      }
                      className="text-xs"
                    >
                      {asset.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Location</span>
                      <span className="text-gray-300 truncate max-w-[120px]">{asset.location}</span>
                    </div>
                    {asset.model && (
                      <div className="flex justify-between text-gray-500">
                        <span>Model</span>
                        <span className="text-gray-300 truncate max-w-[120px]">{asset.model}</span>
                      </div>
                    )}
                    {asset.serial_number && (
                      <div className="flex justify-between text-gray-500">
                        <span>S/N</span>
                        <span className="font-mono text-gray-400 text-xs">{asset.serial_number}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Health Score</span>
                      <span className={cn(
                        "text-xs font-bold",
                        asset.health_score >= 90 ? "text-emerald-400" :
                        asset.health_score >= 70 ? "text-yellow-400" :
                        asset.health_score >= 50 ? "text-orange-400" : "text-red-400"
                      )}>
                        {asset.health_score}%
                      </span>
                    </div>
                    <Progress
                      value={asset.health_score}
                      className="h-1.5"
                      indicatorClassName={
                        asset.health_score >= 90 ? "bg-emerald-500" :
                        asset.health_score >= 70 ? "bg-yellow-500" :
                        asset.health_score >= 50 ? "bg-orange-500" : "bg-red-500"
                      }
                    />
                  </div>

                  {asset.warranty_expiry && (
                    <p className="text-xs text-gray-600 mt-2">
                      Warranty: {new Date(asset.warranty_expiry).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No assets found</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
