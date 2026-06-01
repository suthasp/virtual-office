export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "manager" | "engineer" | "viewer";
export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "in-progress" | "resolved" | "closed";
export type MaintenanceType = "preventive" | "corrective";
export type MaintenanceStatus = "scheduled" | "in-progress" | "completed" | "cancelled";
export type AssetStatus = "online" | "offline" | "maintenance" | "decommissioned";
export type AgentStatus = "online" | "idle" | "busy" | "offline";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          avatar_url: string | null;
          department: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      incidents: {
        Row: {
          id: string;
          title: string;
          description: string;
          severity: IncidentSeverity;
          status: IncidentStatus;
          department: string;
          assigned_to: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
          tags: string[];
        };
        Insert: Omit<Database["public"]["Tables"]["incidents"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["incidents"]["Insert"]>;
      };
      maintenance_tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: MaintenanceType;
          status: MaintenanceStatus;
          department: string;
          asset_id: string | null;
          assigned_to: string | null;
          scheduled_date: string;
          completed_date: string | null;
          priority: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["maintenance_tasks"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["maintenance_tasks"]["Insert"]>;
      };
      assets: {
        Row: {
          id: string;
          name: string;
          type: string;
          model: string | null;
          serial_number: string | null;
          location: string;
          department: string;
          status: AssetStatus;
          health_score: number;
          purchase_date: string | null;
          warranty_expiry: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["assets"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["assets"]["Insert"]>;
      };
      kpi_metrics: {
        Row: {
          id: string;
          metric_name: string;
          metric_value: number;
          unit: string;
          department: string;
          recorded_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["kpi_metrics"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["kpi_metrics"]["Insert"]>;
      };
      ai_agents: {
        Row: {
          id: string;
          name: string;
          type: string;
          status: AgentStatus;
          description: string;
          avatar: string;
          department: string;
          tasks_completed: number;
          accuracy_rate: number;
          response_time: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ai_agents"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["ai_agents"]["Insert"]>;
      };
      agent_messages: {
        Row: {
          id: string;
          agent_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["agent_messages"]["Row"], "id" | "created_at">;
        Update: never;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Incident = Database["public"]["Tables"]["incidents"]["Row"];
export type MaintenanceTask = Database["public"]["Tables"]["maintenance_tasks"]["Row"];
export type Asset = Database["public"]["Tables"]["assets"]["Row"];
export type KpiMetric = Database["public"]["Tables"]["kpi_metrics"]["Row"];
export type AiAgent = Database["public"]["Tables"]["ai_agents"]["Row"];
export type AgentMessage = Database["public"]["Tables"]["agent_messages"]["Row"];
