import type { AvailabilityResponse } from '../types/availability';

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchAvailability(projectId: string): Promise<AvailabilityResponse> {
  const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/availability`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `Error ${response.status}`;
    throw new Error(`${response.status}: ${detail}`);
  }
  return response.json();
}
