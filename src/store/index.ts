import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { GlobalKPI, Department, AiAgent, Incident, MaintenanceTask, Asset } from "@/types";

interface UIState {
  sidebarOpen: boolean;
  selectedDepartment: string | null;
  departmentPanelOpen: boolean;
  selectedAgent: string | null;
  agentChatOpen: boolean;
  theme: "dark" | "light";
}

interface DataState {
  kpis: GlobalKPI;
  departments: Department[];
  agents: AiAgent[];
  incidents: Incident[];
  maintenanceTasks: MaintenanceTask[];
  assets: Asset[];
  isLoading: boolean;
  lastUpdated: string | null;
}

interface Actions {
  setSidebarOpen: (open: boolean) => void;
  setSelectedDepartment: (id: string | null) => void;
  setDepartmentPanelOpen: (open: boolean) => void;
  setSelectedAgent: (id: string | null) => void;
  setAgentChatOpen: (open: boolean) => void;
  setKpis: (kpis: GlobalKPI) => void;
  setDepartments: (departments: Department[]) => void;
  setAgents: (agents: AiAgent[]) => void;
  setIncidents: (incidents: Incident[]) => void;
  setMaintenanceTasks: (tasks: MaintenanceTask[]) => void;
  setAssets: (assets: Asset[]) => void;
  setLoading: (loading: boolean) => void;
  updateKpi: (key: keyof GlobalKPI, value: number) => void;
}

type AppStore = UIState & DataState & Actions;

const defaultKpis: GlobalKPI = {
  activeAlarms: 12,
  openTickets: 47,
  criticalIncidents: 3,
  pmCompletion: 87,
  cmCompletion: 92,
  monthlyKpi: 94.5,
  upsLoad: 68,
  pue: 1.42,
  energyConsumption: 2847,
  capacityUtilization: 73,
  assetHealthScore: 91,
  slaCompliance: 99.2,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        // UI State
        sidebarOpen: true,
        selectedDepartment: null,
        departmentPanelOpen: false,
        selectedAgent: null,
        agentChatOpen: false,
        theme: "dark",

        // Data State
        kpis: defaultKpis,
        departments: [],
        agents: [],
        incidents: [],
        maintenanceTasks: [],
        assets: [],
        isLoading: false,
        lastUpdated: null,

        // Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setSelectedDepartment: (id) => set({ selectedDepartment: id }),
        setDepartmentPanelOpen: (open) => set({ departmentPanelOpen: open }),
        setSelectedAgent: (id) => set({ selectedAgent: id }),
        setAgentChatOpen: (open) => set({ agentChatOpen: open }),
        setKpis: (kpis) => set({ kpis, lastUpdated: new Date().toISOString() }),
        setDepartments: (departments) => set({ departments }),
        setAgents: (agents) => set({ agents }),
        setIncidents: (incidents) => set({ incidents }),
        setMaintenanceTasks: (tasks) => set({ maintenanceTasks: tasks }),
        setAssets: (assets) => set({ assets }),
        setLoading: (isLoading) => set({ isLoading }),
        updateKpi: (key, value) =>
          set((state) => ({
            kpis: { ...state.kpis, [key]: value },
          })),
      }),
      {
        name: "virtual-office-store",
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    )
  )
);
