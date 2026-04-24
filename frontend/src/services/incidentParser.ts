import type { IncidentResponse, IncidentDetail, IncidentBySource, ServiceSummary } from '../types/incident';
import { formatMTTR, formatMTBF } from '../utils/formatTime';

// Constantes de las columnas V3 (debe coincidir con el Excel actual)
const COL_PROJECT       = "Nombre del Proyecto";
const COL_SERVICE       = "Servicio del Incidente";
const COL_DESCRIPTION   = "Descripción del Incidente";
const COL_SOURCE        = "Fuente del Incidente";
const COL_MTTR          = "MTTR del Incidente (minutos)";
const COL_DATE          = "Fecha del Incidente";
const COL_MTTR_SUMMARY  = "MTTR Promedio (minutos)";
const COL_MTBF_SUMMARY  = "MTBF (horas)";
const COL_OP_TIME       = "Tiempo Total de Operación (h)";
const COL_FAILURES      = "Número de Fallas";
const COL_IMPACT        = "Impacto"; 
const COL_RECURRENT     = "Incidentes Recurrentes"; // Nueva columna para resiliencia

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
  // const globalCriticals = parseInt(summaryRow["Incidentes Críticos Totales"]) || 0;
  const opTimeHours = parseFloat(summaryRow[COL_OP_TIME]) || 720; // Default 1 month
  const numFallasGlobal = parseInt(summaryRow[COL_FAILURES]) || 0;

  // Filas de detalle: solo las que tienen "Servicio del Incidente" no vacío
  const incidentRows = projectRows.filter(r => {
    const s = r[COL_SERVICE];
    return s !== undefined && s !== null && String(s).trim() !== "";
  });

  // Construir array de incidentes detallados
  const incidents: IncidentDetail[] = incidentRows.map((r, idx) => {
    const mttr_minutes = parseFloat(r[COL_MTTR]) || 0;

    // Lógica de clasificación de impacto
    let impact: 'Crítico' | 'Alto' | 'Bajo' = 'Bajo';
    
    // Si existe la columna de impacto en el Excel, usarla. Si no, calcular por MTTR.
    const rawImpact = r[COL_IMPACT] ? String(r[COL_IMPACT]).trim().toLowerCase() : null;
    
    if (rawImpact) {
      if (rawImpact.includes('crit') || rawImpact.includes('crít')) impact = 'Crítico';
      else if (rawImpact.includes('alt')) impact = 'Alto';
      else impact = 'Bajo';
    } else {
      if (mttr_minutes >= 480) impact = 'Crítico';
      else if (mttr_minutes >= 120) impact = 'Alto';
    }

    const impact_color = impact === 'Crítico' ? '#E74C3C' : impact === 'Alto' ? '#F39C12' : '#70AD47';

    return {
      index: idx + 1,
      service: String(r[COL_SERVICE] || "").trim(),
      description: String(r[COL_DESCRIPTION] || "Sin descripción registrada").trim(),
      mttr_minutes,
      recovery_formatted: formatMTTR(mttr_minutes),
      source: String(r[COL_SOURCE] || "Sin clasificar").trim(),
      impact,
      impact_color,
      date: String(r[COL_DATE] || "Fecha no registrada").trim(),
      recurrent_count: parseInt(r[COL_RECURRENT]) || 0,
    };
  });

  // Ordenar por fecha descendente
  incidents.sort((a, b) => b.date.localeCompare(a.date));

  // --- AGRUPACIÓN POR SERVICIOS (Spec Sección 1 y 3) ---
  const servicesMap: Record<string, IncidentDetail[]> = {};
  incidents.forEach(inc => {
    if (!servicesMap[inc.service]) servicesMap[inc.service] = [];
    servicesMap[inc.service].push(inc);
  });

  const services: ServiceSummary[] = Object.entries(servicesMap).map(([name, serviceIncidents]) => {
    const totalMTTR = serviceIncidents.reduce((sum, i) => sum + i.mttr_minutes, 0);
    const opTimeMin = opTimeHours * 60;
    
    // Disponibilidad (Spec Sección 6)
    const availability = opTimeMin > 0 ? Number(((opTimeMin - totalMTTR) / opTimeMin * 100).toFixed(2)) : 100;
    
    // Determinar impacto del servicio (priorizando incidentes del servicio)
    let serviceImpact: 'Crítico' | 'Alto' | 'Bajo' = 'Bajo';
    const serviceIncidentCount = serviceIncidents.length;

    if (serviceIncidentCount >= 5 || serviceIncidents.some(i => i.impact === 'Crítico')) {
      serviceImpact = 'Crítico';
    } else if (serviceIncidentCount >= 2 || serviceIncidents.some(i => i.impact === 'Alto')) {
      serviceImpact = 'Alto';
    }

    const serviceImpactColor = serviceImpact === 'Crítico' ? '#E74C3C' : serviceImpact === 'Alto' ? '#F39C12' : '#70AD47';

    // Lógica Hardcoded: Despliegues
    let deployments = { total: 8, success: 8, failed: 0, rate: 100, rate_formatted: '100.0%' };
    if (serviceImpact === 'Crítico') deployments = { total: 12, success: 10, failed: 2, rate: 83.3, rate_formatted: '83.3%' };
    else if (serviceImpact === 'Alto') deployments = { total: 10, success: 9, failed: 1, rate: 90.0, rate_formatted: '90.0%' };

    // Lógica Hardcoded: Capacidad (Basada en impacto del servicio)
    let capacity: { alerts: number; status: 'normal' | 'warning' | 'critical'; message: string; recommendation: string } = { 
      alerts: 0, 
      status: 'normal', 
      message: 'No hay alertas de capacidad. Todos los recursos operando normal.',
      recommendation: 'Operación estable.'
    };
    if (serviceImpact === 'Crítico') {
      capacity = { 
        alerts: 3, 
        status: 'critical', 
        message: '3 Alertas Activas: Memoria 92%, CPU 88%, Conexiones DB 95%.',
        recommendation: 'Acción inmediata requerida. Escalar recursos.'
      };
    } else if (serviceImpact === 'Alto') {
      capacity = { 
        alerts: 1, 
        status: 'warning', 
        message: '1 Alerta Activa: Conexiones DB 85%.',
        recommendation: 'Monitorear de cerca. Considerar optimización.'
      };
    }

    // Análisis de Causa Raíz (Moda)
    const sources = serviceIncidents.map(i => i.source);
    const sourceMode = sources.sort((a,b) =>
          sources.filter(v => v===a).length
        - sources.filter(v => v===b).length
    ).pop() || 'Sin clasificar';

    // Simulación de Tendencia (Spec Sección 4B)
    const baseTrend = serviceImpact === 'Crítico' ? 98.5 : serviceImpact === 'Alto' ? 99.4 : 99.8;
    const trend_data = ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'].map((m) => ({
      month: m,
      availability: Number((baseTrend + (Math.random() * 0.4 - 0.2)).toFixed(2))
    }));

    return {
      name,
      availability,
      availability_formatted: availability.toFixed(2) + '%',
      incident_count: serviceIncidents.length,
      impact: serviceImpact,
      impact_color: serviceImpactColor,
      deployments,
      capacity,
      incidents: serviceIncidents,
      main_source: sourceMode,
      trend_data
    };
  });

  // Ordenar tabla de servicios: Crítico > Alto > Bajo, luego MTTR desc
  services.sort((a, b) => {
    const impactOrder = { 'Crítico': 0, 'Alto': 1, 'Bajo': 2 };
    if (impactOrder[a.impact] !== impactOrder[b.impact]) {
      return impactOrder[a.impact] - impactOrder[b.impact];
    }
    return b.availability - a.availability; // Sort by availability desc (worst first if impact is same)
  });

  // MTTR promedio: desde filas de detalle, fallback a columna de resumen
  let avgMinutes = 0;
  if (incidents.length > 0) {
    const total = incidents.reduce((sum, i) => sum + i.mttr_minutes, 0);
    avgMinutes = total / incidents.length;
  } else {
    avgMinutes = parseFloat(summaryRow[COL_MTTR_SUMMARY]) || 0;
  }

  // Servicios afectados: count distinct
  const uniqueServicesCount = new Set(incidents.map(i => i.service)).size;

  // Total de incidentes: desde detalle, fallback a suma de columnas de resumen
  const totalFromSummary = SUMMARY_COLUMNS.reduce((sum, col) => sum + (parseFloat(summaryRow[col]) || 0), 0);
  const finalTotal = incidents.length > 0 ? incidents.length : totalFromSummary;

  // Pie chart — agrupar por "Fuente del Incidente"
  const by_source: IncidentBySource[] = [];

  if (incidents.length > 0) {
    const sourceCount: Record<string, number> = {};
    incidents.forEach(i => {
      const s = i.source;
      sourceCount[s] = (sourceCount[s] || 0) + 1;
    });
    Object.entries(sourceCount).forEach(([s, count], idx) => {
      by_source.push({
        name: s, source: s, count,
        percentage: Number(((count / incidents.length) * 100).toFixed(1)),
        value: count,
        color: CHART_COLORS[idx % CHART_COLORS.length],
      });
    });
    by_source.sort((a, b) => b.count - a.count);
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
    if (finalTotal >= 5) {
      analysisMessage += "Alerta: El volumen de incidentes ha superado el umbral aceptable.";
      actionRequired = true;
    } else if (finalTotal >= 2) {
      analysisMessage += "Se recomienda revisar las fuentes recurrentes de incidentes.";
    } else {
      analysisMessage += "Incidentes dentro de los parámetros normales de operación.";
    }
  }

  // --- LÓGICA DE RESILIENCIA (Top Offenders) ---
  const mapAction = (source: string): string => {
    const s = source.toLowerCase();
    if (s.includes('base de datos') || s.includes('database') || s.includes('db')) return "OPTIMIZACIÓN QUERIES";
    if (s.includes('api gateway') || s.includes('gateway')) return "REFACTORIZAR CÓDIGO DE API";
    if (s.includes('servidor web') || s.includes('web server')) return "TUNEADO DE PARÁMETROS";
    if (s.includes('error operativo')) return "CAPACITACIÓN / AUTOMATIZACIÓN";
    if (s.includes('red interna') || s.includes('network')) return "REVISIÓN DE TOPOLOGÍA";
    if (s.includes('infraestructura')) return "ESCALAMIENTO DE RECURSOS";
    if (s.includes('microservicio')) return "ANÁLISIS DE DEPENDENCIAS";
    return "ANÁLISIS DE CAUSA RAÍZ";
  };

  // 1. Intentar obtener de columna "Incidentes Recurrentes"
  let top_offenders_raw = incidents.filter(i => (i as any).recurrent_count > 0);
  
  // 2. Fallback: Si no hay recurrentes marcados, tomar los 3 primeros del proyecto
  if (top_offenders_raw.length === 0) {
    top_offenders_raw = incidents.slice(0, 3);
  }

  const top_offenders = top_offenders_raw.slice(0, 5).map(inc => {
    const fallas = (inc as any).recurrent_count || 1;
    return {
      sistema: inc.service,
      fallas: fallas,
      recurrencia: Number(((fallas / finalTotal) * 100).toFixed(1)),
      causa: inc.source,
      accion: mapAction(inc.source),
      description: inc.description
    };
  });

  return {
    project_id: targetProject,
    summary: {
      total: finalTotal,
      avg_recovery_minutes: avgMinutes,
      avg_recovery_formatted: formatMTTR(avgMinutes),
      mtbf_hours: parseFloat(summaryRow[COL_MTBF_SUMMARY]) || 0,
      mtbf_formatted: formatMTBF(parseFloat(summaryRow[COL_MTBF_SUMMARY]) || 0),
      services_affected: uniqueServicesCount,
      total_operation_hours: opTimeHours,
      total_failures: numFallasGlobal
    },
    by_source,
    incidents,
    services,
    analysis: {
      message: analysisMessage.trim(),
      action_required: actionRequired,
    },
    resilience: {
      top_offenders
    }
  };
}
