export * from "./database";

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  position: { x: number; y: number };
  headcount: number;
  status: "normal" | "warning" | "critical";
}

export interface GlobalKPI {
  activeAlarms: number;
  openTickets: number;
  criticalIncidents: number;
  pmCompletion: number;
  cmCompletion: number;
  monthlyKpi: number;
  upsLoad: number;
  pue: number;
  energyConsumption: number;
  capacityUtilization: number;
  assetHealthScore: number;
  slaCompliance: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: string;
}

export interface AgentTask {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}
