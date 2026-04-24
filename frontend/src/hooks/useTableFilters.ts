import { useState, useMemo } from 'react';

export interface FilterDef<T> {
  key: string;
  getValue: (item: T) => string;
  sortOrder?: (a: string, b: string) => number;
}

export interface FilterState {
  [key: string]: string[];
}

export interface UseTableFiltersResult<T> {
  filteredData: T[];
  filterState: FilterState;
  availableOptions: Record<string, string[]>;
  toggleFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  activeCount: number;
  resultCount: number;
  totalCount: number;
}

export function useTableFilters<T>(data: T[], filterDefs: FilterDef<T>[]): UseTableFiltersResult<T> {
  const [filterState, setFilterState] = useState<FilterState>({});

  // 1. Calcular opciones disponibles basadas en los datos iniciales
  const availableOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    
    filterDefs.forEach(def => {
      const values = Array.from(new Set(data.map(item => def.getValue(item))));
      if (def.sortOrder) {
        values.sort(def.sortOrder);
      } else {
        values.sort();
      }
      options[def.key] = values;
    });
    
    return options;
  }, [data, filterDefs]);

  // 2. Filtrar los datos
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return filterDefs.every(def => {
        const activeValues = filterState[def.key];
        if (!activeValues || activeValues.length === 0) return true;
        
        const value = def.getValue(item);
        return activeValues.includes(value);
      });
    });
  }, [data, filterDefs, filterState]);

  // 3. Helpers
  const toggleFilter = (key: string, value: string) => {
    setFilterState(prev => {
      const current = prev[key] || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      return { ...prev, [key]: next };
    });
  };

  const clearFilters = () => setFilterState({});

  const hasActiveFilters = Object.values(filterState).some(v => v.length > 0);
  const activeCount = Object.values(filterState).reduce((acc, v) => acc + v.length, 0);

  return {
    filteredData,
    filterState,
    availableOptions,
    toggleFilter,
    clearFilters,
    hasActiveFilters,
    activeCount,
    resultCount: filteredData.length,
    totalCount: data.length
  };
}
