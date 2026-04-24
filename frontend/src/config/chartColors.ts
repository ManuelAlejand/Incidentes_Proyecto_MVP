// Paleta centralizada para todos los gráficos de torta
// Agregar colores aquí cuando se necesiten más categorías
export const PIE_COLORS = [
  '#4F81BD',  // azul
  '#70AD47',  // verde
  '#00B0F0',  // celeste
  '#FF6B35',  // naranja
  '#9B59B6',  // púrpura
  '#E74C3C',  // rojo
  '#F39C12',  // amarillo
  '#1ABC9C',  // teal
];

/**
 * Helper para obtener color por índice.
 * Maneja automáticamente el ciclo si hay más ítems que colores definidos.
 */
export function getPieColor(index: number): string {
  return PIE_COLORS[index % PIE_COLORS.length];
}
