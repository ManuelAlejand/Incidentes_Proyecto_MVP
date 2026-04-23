export interface IncidentSummary {
  total: number;
  avg_recovery_minutes: number;
  avg_recovery_formatted: string;
  mtbf_hours: number;
  mtbf_formatted: string;
  services_affected: number;
  total_operation_hours: number;
  total_failures: number;
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
  impact_color: string;
  date: string;
}

export interface ServiceSummary {
  name: string;
  availability: number;
  availability_formatted: string;
  incident_count: number;
  impact: 'Crítico' | 'Alto' | 'Bajo';
  impact_color: string;
  deployments: {
    total: number;
    success: number;
    failed: number;
    rate: number;
    rate_formatted: string;
  };
  capacity: {
    alerts: number;
    status: 'normal' | 'warning' | 'critical';
    message: string;
    recommendation: string;
  };
  incidents: IncidentDetail[];
  main_source: string;
  trend_data: { month: string; availability: number }[];
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
  services: ServiceSummary[];
  analysis: IncidentAnalysis;
}
