import type { IncidentResponse, IncidentDetail, IncidentBySource } from '../types/incident';

export function formatMinutes(minutes: number): string {
  if (!minutes || minutes === 0) return "0min";
  if (minutes < 60) return `${minutes}min`;
  if (minutes % 60 === 0) return `${Math.floor(minutes / 60)}h`;
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h}h ${m}min`;
}

// Constantes de las columnas V3 (debe coincidir con el Excel actual)
const COL_PROJECT       = "Nombre del Proyecto";
const COL_SERVICE       = "Servicio del Incidente";
const COL_DESCRIPTION   = "Descripción del Incidente";
const COL_SOURCE        = "Fuente del Incidente";
const COL_MTTR          = "MTTR del Incidente (minutos)";
const COL_DATE          = "Fecha del Incidente";
const COL_MTTR_SUMMARY  = "MTTR Promedio (minutos)";
const CHART_COLORS = ['#4F81BD', '#70AD47', '#00B0F0', '#FF6B35', '#9B59B6', '#E74C3C', '#F39C12', '#1ABC9C'];

const SUMMARY_COLUMNS = [
  "Incidentes Críticos Totales",
  "Número de Fallas",
  "Incidentes Recurrentes",
  "Incidentes por Error Operativo",
  "Incidentes por Base de Datos",
  "Incidentes por API Gateway",
];

/**
 * Parsea el array raw del Excel (V3: una fila por incidente).
 * Agrupa por "Nombre del Proyecto", separando datos de resumen de detalle.
 * 
 * @param rawExcelData  Array de objetos crudos leídos con SheetJS (sheet_to_json)
 * @param projectName   Opcional: filtrar por un proyecto específico. Si no se pasa, usa el primer proyecto del Excel.
 */
export function parseIncidentsFrontend(rawExcelData: any[], projectName?: string): IncidentResponse | null {
  if (!rawExcelData || rawExcelData.length === 0) return null;

  // Detectar esquema antiguo (columnas Inc1_, Inc2_, ...)
  const firstRow = rawExcelData[0];
  const hasOldSchema = Object.keys(firstRow).some(k => /Inc\d+_/i.test(k));
  if (hasOldSchema) {
    console.warn("[incidentParser] Esquema desactualizado detectado. Usa la plantilla v3.");
    return null;
  }

  // Determinar el proyecto a analizar
  const targetProject = projectName
    ? projectName
    : (firstRow[COL_PROJECT] || null);

  if (!targetProject) return null;

  // Filtrar todas las filas que pertenecen al proyecto
  const projectRows = rawExcelData.filter(r => r[COL_PROJECT] === targetProject);
  if (projectRows.length === 0) return null;

  // Datos de resumen — tomados de la primera fila (son idénticos en todas las filas del proyecto)
  const summaryRow = projectRows[0];

  // Filas de detalle: solo las que tienen "Servicio del Incidente" no vacío
  const incidentRows = projectRows.filter(r => {
    const s = r[COL_SERVICE];
    return s !== undefined && s !== null && String(s).trim() !== "";
  });

  // Construir array de incidentes detallados
  const incidents: IncidentDetail[] = incidentRows.map((r, idx) => {
    const mttr_minutes = parseFloat(r[COL_MTTR]) || 0;

    let impact: 'Crítico' | 'Alto' | 'Bajo' = 'Bajo';
    let impact_color: 'red' | 'orange' | 'green' = 'green';

    if (mttr_minutes > 180) {
      impact = 'Crítico';
      impact_color = 'red';
    } else if (mttr_minutes >= 60) {
      impact = 'Alto';
      impact_color = 'orange';
    }

    return {
      index: idx + 1,
      service: String(r[COL_SERVICE] || "").trim(),
      description: String(r[COL_DESCRIPTION] || "Sin descripción registrada").trim(),
      mttr_minutes,
      recovery_formatted: formatMinutes(mttr_minutes),
      source: String(r[COL_SOURCE] || "Sin clasificar").trim(),
      impact,
      impact_color,
      date: String(r[COL_DATE] || "Fecha no registrada").trim(),
    };
  });

  // Ordenar por fecha descendente
  incidents.sort((a, b) => b.date.localeCompare(a.date));

  // MTTR promedio: desde filas de detalle, fallback a columna de resumen
  let avgMinutes = 0;
  if (incidents.length > 0) {
    const total = incidents.reduce((sum, i) => sum + i.mttr_minutes, 0);
    avgMinutes = total / incidents.length;
  } else {
    avgMinutes = parseFloat(summaryRow[COL_MTTR_SUMMARY]) || 0;
  }

  // Servicios afectados: count distinct
  const uniqueServices = new Set(incidents.map(i => i.service));

  // Total de incidentes: desde detalle, fallback a suma de columnas de resumen
  const totalFromSummary = SUMMARY_COLUMNS.reduce((sum, col) => sum + (parseFloat(summaryRow[col]) || 0), 0);
  const finalTotal = incidents.length > 0 ? incidents.length : totalFromSummary;

  // Pie chart — agrupar por "Fuente del Incidente"
  const by_source: IncidentBySource[] = [];

  if (incidents.length > 0) {
    // Fuentes dinámicas desde filas de detalle
    const sourceCount: Record<string, number> = {};
    incidents.forEach(i => {
      const s = i.source;
      sourceCount[s] = (sourceCount[s] || 0) + 1;
    });
    Object.entries(sourceCount).forEach(([s, count], idx) => {
      by_source.push({
        name: s,
        source: s,
        count,
        percentage: Number(((count / incidents.length) * 100).toFixed(1)),
        value: count,
        color: CHART_COLORS[idx % CHART_COLORS.length],
      });
    });
    by_source.sort((a, b) => b.count - a.count);
  } else if (finalTotal > 0) {
    // Fallback: usar columnas de resumen agregadas
    const aggData = [
      { name: "Críticos", key: "Incidentes Críticos Totales" },
      { name: "Recurrentes", key: "Incidentes Recurrentes" },
      { name: "Error Operativo", key: "Incidentes por Error Operativo" },
      { name: "Base de Datos", key: "Incidentes por Base de Datos" },
      { name: "API Gateway", key: "Incidentes por API Gateway" },
    ];
    let colorIdx = 0;
    aggData.forEach(({ name, key }) => {
      const count = parseFloat(summaryRow[key]) || 0;
      if (count > 0) {
        by_source.push({
          name, source: name, count,
          percentage: Number(((count / finalTotal) * 100).toFixed(1)),
          value: count,
          color: CHART_COLORS[colorIdx++ % CHART_COLORS.length],
        });
      }
    });
  }

  // Análisis automático
  let analysisMessage = "";
  let actionRequired = false;

  if (finalTotal === 0) {
    analysisMessage = "No se registraron incidentes críticos en el mes actual. Excelente desempeño operativo.";
  } else {
    analysisMessage = `Se han registrado ${finalTotal} incidente(s) en el mes. `;
    if (by_source.length > 0) {
      analysisMessage += `Causa principal: ${by_source[0].source}. `;
    }
    if (avgMinutes > 180) {
      analysisMessage += "MTTR alto — se recomienda revisar tiempos de respuesta y recuperación.";
      actionRequired = true;
    } else if (avgMinutes >= 60) {
      analysisMessage += "MTTR en rango medio — se recomienda monitoreo continuo.";
    } else if (avgMinutes > 0) {
      analysisMessage += "MTTR bajo — buen desempeño en recuperación de incidentes.";
    }
    if (by_source.length > 3) {
      analysisMessage += " Se detectaron múltiples fuentes de falla — se recomienda estandarizar procesos.";
      actionRequired = true;
    }
    if (finalTotal > 5) actionRequired = true;
  }

  return {
    project_id: targetProject,
    summary: {
      total: finalTotal,
      avg_recovery_minutes: avgMinutes,
      avg_recovery_formatted: formatMinutes(avgMinutes),
      services_affected: uniqueServices.size,
    },
    by_source,
    incidents,
    analysis: {
      message: analysisMessage.trim(),
      action_required: actionRequired,
    },
  };
}
