import { useState, useEffect, useCallback } from 'react';
import type { TrendResponse } from '../types/trend';
import { fetchTrendData } from '../services/trendService';

export const useAvailabilityTrend = (projectId: string, serviceName?: string) => {
  const [period, setPeriod] = useState<'6m' | '3m' | 'day'>('6m');
  const [componentType, setComponentType] = useState<string>('Todos');
  const [slot, setSlot] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TrendResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchTrendData(projectId, period, componentType, serviceName, signal);
      setData(result);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Error al cargar los datos de tendencia');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, period, componentType, serviceName]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  return {
    period,
    setPeriod,
    componentType,
    setComponentType,
    slot,
    setSlot,
    data,
    isLoading,
    error,
    refresh: fetchData
  };
};
