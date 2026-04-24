export interface AvailabilityComponent {
  name: string;
  availability: number;
}

export interface AvailabilityByType {
  avg_availability: number;
  meets_target: boolean;
  components: AvailabilityComponent[];
}

export interface AvailabilityTrend {
  month: string;
  availability: number;
  meets_target: boolean;
}

export interface DeploymentHistory {
  period: string;
  total: number;
  successful: number;
  failed: number;
  success_rate: number;
}

export interface CapacityAlerts {
  status: 'ok' | 'warning' | 'alert';
  count: number;
  items: string[];
  recommendation: string;
}

export interface IncidentAnalysis {
  total: number;
  main_cause: string | null;
  message: string;
  is_alert: boolean;
}

export interface BusinessService {
  name: string;
  availability: number;
  meta: number;
  meets_target: boolean;
  incident_count: number;
  capacity_status: 'ok' | 'warning' | 'alert';
  capacity_count: number;
  deployments: DeploymentHistory;
  capacity_alerts: CapacityAlerts;
  by_type: Record<string, AvailabilityByType>;
  by_type_summary?: GlobalAvailabilityByType[];
  trend: AvailabilityTrend[];
  incident_analysis: IncidentAnalysis;
}

export interface GlobalAvailabilityByType {
  type: string;
  avg: number;
}

export interface GlobalAvailability {
  percentage: number;
  meta: number;
  meets_target: boolean;
  delta: number;
  by_type: GlobalAvailabilityByType[];
}

export interface AvailabilityResponse {
  project_id: string;
  global_availability: GlobalAvailability;
  services: BusinessService[];
}
