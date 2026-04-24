export interface TrendPoint {
  label: string;
  value: number;
  meets_target: boolean;
  is_simulated: boolean;
}

export interface ByTypeSummary {
  type: string;
  avg: number;
}

export interface TrendResponse {
  project_id: string;
  period: '6m' | '3m' | 'day';
  slot?: string;
  component_type?: string;
  meta: number;
  current_value: number;
  data_points: TrendPoint[];
  by_type_summary: ByTypeSummary[];
}
