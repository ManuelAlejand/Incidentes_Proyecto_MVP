export interface ImpactLevel {
  key: string;
  color: string;         // texto y borde
  bgColor: string;       // fondo del badge/pill
  bgColorActive: string; // fondo cuando el pill está activo en filtros
  order: number;         // para ordenar de mayor a menor severidad
}

export const IMPACT_LEVELS: ImpactLevel[] = [
  {
    key: 'Crítico',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    bgColorActive: '#DC2626',
    order: 1
  },
  {
    key: 'Alto',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    bgColorActive: '#EA580C',
    order: 2
  },
  {
    key: 'Bajo',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    bgColorActive: '#16A34A',
    order: 3
  },
];

// Función helper usada en toda la app para obtener el color de un nivel
export function getImpactLevel(key: string): ImpactLevel {
  return IMPACT_LEVELS.find(l => l.key === key) ?? {
    key,
    color: '#6B7280',
    bgColor: '#F9FAFB',
    bgColorActive: '#6B7280',
    order: 99
  };
}

// Orden para sort
export function getImpactOrder(key: string): number {
  return getImpactLevel(key).order;
}
