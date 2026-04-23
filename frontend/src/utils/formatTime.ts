/**
 * Formatea minutos (MTTR) a un string legible.
 * < 60 min          → "{N}min"
 * exacto en horas   → "{N}h"
 * resto             → "{N}h {M}min"
 */
export function formatMTTR(minutes: number): string {
  if (!minutes || minutes === 0) return "0min";
  if (minutes < 60) return `${Math.round(minutes)}min`;
  
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/**
 * Formatea horas (MTBF) a un string legible.
 * < 1h              → "{N*60}min"
 * exacto en horas   → "{N}h"
 * con decimales     → "{N}h {M}min"
 */
export function formatMTBF(hours: number): string {
  if (!hours || hours === 0) return "0h";
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
