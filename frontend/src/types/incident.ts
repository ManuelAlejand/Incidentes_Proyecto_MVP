export interface IncidentSummary {
  total: number;
  avg_recovery_minutes: number;
  avg_recovery_formatted: string;
  services_affected: number;
}

export interface IncidentBySource {
  name: string;      // to match Recharts 'name' easily
  source: string;
  count: number;
  percentage: number;
  value: number;     // to match Recharts 'value' easily
  color: string;     // for dynamic recharts colors
}

export interface IncidentDetail {
  index: number;
  service: string;
  description: string;
  mttr_minutes: number;
  recovery_formatted: string;
  source: string;
  impact: 'Crítico' | 'Alto' | 'Bajo';
  impact_color: 'red' | 'orange' | 'green';
  date: string;
}

export interface IncidentAnalysis {
  message: string;
  action_required: boolean;
}

export interface IncidentResponse {
  project_id: string;
  summary: IncidentSummary;
  by_source: IncidentBySource[];
  incidents: IncidentDetail[];
  analysis: IncidentAnalysis;
}
