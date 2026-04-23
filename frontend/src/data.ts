export const topMetrics = {
  disponibilidad: {
    value: "100%",
    meta: "Meta: 99.47%",
    status: "success",
  },
  incidentes: {
    totales: 81,
    seti: 1
  },
  tiempos: {
    mttr: "93min",
    mtbf: "5h"
  },
  vulnerabilidades: {
    value: "100%",
    desc: "7.743/33.295 vulnerabilidades resueltas"
  },
  compromisos: {
    value: "95%"
  }
};

export const serviciosNegocio = [
  { id: "1", servicio: "Portal Clientes", disponibilidad: 99.98, incidentes: 2, despliegues: { current: 8, max: 8 }, capacidad: 0 },
  { id: "2", servicio: "Core Bancario", disponibilidad: 99.99, incidentes: 1, despliegues: { current: 4, max: 4 }, capacidad: 1 },
  { id: "3", servicio: "App Móvil", disponibilidad: 98.5, incidentes: 8, despliegues: { current: 10, max: 12 }, capacidad: 3 },
  { id: "4", servicio: "Sistema de Nómina", disponibilidad: 99.65, incidentes: 3, despliegues: { current: 5, max: 6 }, capacidad: 1 },
  { id: "5", servicio: "E-commerce", disponibilidad: 99.7, incidentes: 5, despliegues: { current: 14, max: 15 }, capacidad: 2 },
];

export const slaDesempeno = [
  { name: "Mes Anterior", value: 99.1 },
  { name: "Mes Actual", value: 98.1 },
  { name: "Objetivo", value: 99.08 }
];

export const topOffenders = [
  { name: "App Móvil", recurrencia: "60%", fallas: 8 },
  { name: "E-commerce", recurrencia: "40%", fallas: 5 },
  { name: "Portal Clientes", recurrencia: "10%", fallas: 2 }
];

export const modalDisponibilidadGlobal = [
  { name: "Sep 2025", value: 99.97, status: "Cumple" },
  { name: "Oct 2025", value: 99.98, status: "Cumple" },
  { name: "Nov 2025", value: 99.96, status: "Cumple" },
  { name: "Dic 2025", value: 100.00, status: "Cumple" },
  { name: "Ene 2026", value: 99.83, status: "Cumple" },
  { name: "Feb 2026", value: 100.00, status: "Cumple" }
];

export const modalIncidentesCriticos = {
  resumen: { total: 3, recoveryTime: "1h 35min", affected: 3 },
  pieData: [
    { name: "Base de Datos", value: 33.3, color: "#3b82f6" },
    { name: "API Gateway", value: 33.3, color: "#22c55e" },
    { name: "Servidor Web", value: 33.3, color: "#06b6d4" }
  ],
  detalle: [
    { servicio: "App Móvil", desc: "Latencia excesiva en consultas de base de datos", recovery: "2h 15min", root: "Base de Datos - Queries N+1", date: "2024-01-15 14:30", impacto: "Alto" },
    { servicio: "E-commerce", desc: "Timeout en API de pagos durante pico de tráfico", recovery: "1h 45min", root: "API Gateway - Límite de conexiones", date: "2024-01-18 10:15", impacto: "Crítico" },
    { servicio: "Portal Clientes", desc: "Caída de servicio por agotamiento de memoria", recovery: "45min", root: "Servidor Web - Memory Leak", date: "2024-01-22 16:00", impacto: "Alto" }
  ]
};

export const modalAppMovil = {
  disponibilidadTendencia: [
    { name: "2025 Septiembre", value: 99.2 },
    { name: "2025 Octubre", value: 98.8 },
    { name: "2025 Noviembre", value: 98.9 },
    { name: "2025 Diciembre", value: 98.6 },
    { name: "2026 Enero", value: 98.4 },
    { name: "2026 Febrero", value: 98.5 }
  ],
  despliegues: {
    periodo: "Mes Actual", total: 12, exitosos: 10, fallidos: 2, tasa: "83.3%"
  }
};
