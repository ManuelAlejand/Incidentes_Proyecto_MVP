import type { TrendResponse } from '../types/trend';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const fetchTrendData = async (
  projectId: string,
  period: string = '6m',
  componentType?: string,
  serviceName?: string,
  signal?: AbortSignal
): Promise<TrendResponse> => {
  const url = new URL(`${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/availability/trend`);
  url.searchParams.append('period', period);
  if (componentType && componentType !== 'Todos') {
    url.searchParams.append('component_type', componentType);
  }
  if (serviceName) {
    url.searchParams.append('service_name', serviceName);
  }

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch trend data: ${response.statusText}`);
  }

  return response.json();
};
