// Datos dummy
const data = {
    resumen_ejecutivo: {
        disponibilidad_global: 100,
        cumplimiento_vulnerabilidades: 100,
        vulnerabilidades_totales: 33295,
        vulnerabilidades_resueltas: 7743,
        cumplimiento_compromisos: 95,
        incidentes_criticos: 81,
        incidentes_Seti: 1,
        hitos_mes: ["Migración Cloud Exitosa", "Parcheo Crítico 100%"]
    },
    vulnerabilidades_historico: {
        totales: [52979, 50529, 34687, 34648, 33740, 33295],
        resueltas: [4982, 13283, 14017, 6154, 4910, 7743]
    },
    compromisos: [
        {
            nombre: "Migración de servicios a Cloud",
            descripcion: "Migrar 15 servicios críticos a infraestructura cloud",
            avance: 100,
            estado: "Completado",
            fecha_compromiso: "2024-01-31",
            responsable: "Equipo Cloud"
        },
        {
            nombre: "Actualización de parches de seguridad",
            descripcion: "Aplicar parches críticos en todos los servidores productivos",
            avance: 100,
            estado: "Completado",
            fecha_compromiso: "2024-01-15",
            responsable: "Equipo Seguridad"
        },
        {
            nombre: "Implementación de monitoreo predictivo",
            descripcion: "Desplegar solución de monitoreo con IA/ML",
            avance: 85,
            estado: "En Progreso",
            fecha_compromiso: "2024-01-30",
            responsable: "Equipo Operaciones"
        },
        {
            nombre: "Optimización de base de datos",
            descripcion: "Mejorar performance de queries en DB principal",
            avance: 95,
            estado: "En Progreso",
            fecha_compromiso: "2024-01-28",
            responsable: "Equipo DBA"
        },
        {
            nombre: "Documentación de procedimientos DR",
            descripcion: "Actualizar documentación de disaster recovery",
            avance: 100,
            estado: "Completado",
            fecha_compromiso: "2024-01-20",
            responsable: "Equipo Infraestructura"
        },
        {
            nombre: "Capacitación equipo DevOps",
            descripcion: "Entrenar equipo en nuevas herramientas de automatización",
            avance: 90,
            estado: "En Progreso",
            fecha_compromiso: "2024-01-25",
            responsable: "Recursos Humanos"
        },
        {
            nombre: "Auditoría de seguridad",
            descripcion: "Realizar auditoría completa de seguridad de infraestructura",
            avance: 75,
            estado: "En Progreso",
            fecha_compromiso: "2024-02-05",
            responsable: "Equipo Seguridad"
        },
        {
            nombre: "Expansión de capacidad storage",
            descripcion: "Adquirir e instalar 200TB adicionales de almacenamiento",
            avance: 60,
            estado: "En Progreso",
            fecha_compromiso: "2024-02-10",
            responsable: "Equipo Infraestructura"
        }
    ],
    incidentes_criticos: [
        {
            servicio: "App Móvil",
            descripcion: "Latencia excesiva en consultas de base de datos",
            tiempo_recuperacion: "2h 15min",
            fuente: "Base de Datos - Queries N+1",
            fecha: "2024-01-15 14:30",
            impacto: "Alto"
        },
        {
            servicio: "E-commerce",
            descripcion: "Timeout en API de pagos durante pico de tráfico",
            tiempo_recuperacion: "1h 45min",
            fuente: "API Gateway - Límite de conexiones",
            fecha: "2024-01-18 10:15",
            impacto: "Crítico"
        },
        {
            servicio: "Portal Clientes",
            descripcion: "Caída de servicio por agotamiento de memoria",
            tiempo_recuperacion: "45min",
            fuente: "Servidor Web - Memory Leak",
            fecha: "2024-01-22 16:00",
            impacto: "Alto"
        }
    ],
    incidentes_por_criticidad: {
        critico: 3,
        medio: 12,
        bajo: 13
    },
    incidentes_historico: {
        totales: [32, 29, 35, 31, 26, 28],
        criticos: [5, 4, 6, 4, 3, 3]
    },
    servicios_negocio: [
        { 
            nombre: "Portal Clientes", 
            uptime: 99.98, 
            estado: "Estable", 
            incidentes: 2,
            despliegues_total: 8,
            despliegues_exitosos: 8,
            capacidad: { alertas: 0, tipo: "ninguna" },
            tendencia: [99.95, 99.92, 99.96, 99.98, 99.97, 99.98]
        },
        { 
            nombre: "Core Bancario", 
            uptime: 99.99, 
            estado: "Estable", 
            incidentes: 1,
            despliegues_total: 4,
            despliegues_exitosos: 4,
            capacidad: { alertas: 1, tipo: "CPU en 85%" },
            tendencia: [99.98, 99.99, 99.97, 99.99, 99.98, 99.99]
        },
        { 
            nombre: "App Móvil", 
            uptime: 98.50, 
            estado: "Crítico", 
            causa: "Latencia en DB", 
            incidentes: 8,
            despliegues_total: 12,
            despliegues_exitosos: 10,
            capacidad: { alertas: 3, tipo: "Memoria 92%, CPU 88%, Conexiones DB 95%" },
            tendencia: [99.20, 98.80, 98.90, 98.60, 98.40, 98.50]
        },
        { 
            nombre: "Sistema de Nómina", 
            uptime: 99.85, 
            estado: "Estable", 
            incidentes: 3,
            despliegues_total: 6,
            despliegues_exitosos: 5,
            capacidad: { alertas: 1, tipo: "Almacenamiento 78%" },
            tendencia: [99.80, 99.82, 99.88, 99.85, 99.83, 99.85]
        },
        { 
            nombre: "E-commerce", 
            uptime: 99.70, 
            estado: "Advertencia", 
            incidentes: 5,
            despliegues_total: 15,
            despliegues_exitosos: 14,
            capacidad: { alertas: 2, tipo: "CPU 82%, IOPS disco 90%" },
            tendencia: [99.60, 99.65, 99.75, 99.70, 99.68, 99.70]
        }
    ],
    sla_performance: {
        mes_actual: 98.1,
        mes_anterior: 99.1,
        objetivo: 99.08
    },
    resiliencia: {
        top_offenders: [
            { sistema: "App Móvil", fallas: 8, recurrencia: 60 },
            { sistema: "E-commerce", fallas: 5, recurrencia: 40 },
            { sistema: "Portal Clientes", fallas: 2, recurrencia: 10 }
        ]
    },
    eficiencia: {
        horas_ahorradas: 120,
        incidentes_auto_resueltos: 45,
        alertas_proactivas: 78,
        mttr_reduccion: "15%",
        porcentaje_automatizacion: 68,
        avance_mes: 12
    },
    alertas_por_servicio: [
        { servicio: "azuetprdueba|10.160.48.132", alertas: 463 },
        { servicio: "MDRBBDPR02|10.129.62.24", alertas: 320 },
        { servicio: "cloudfront|30.50.0.10", alertas: 317 },
        { servicio: "mdrbbdpr01|10.129.62.23", alertas: 316 },
        { servicio: "AVC-FLR-POR-PRD|30.5.3.129", alertas: 281 }
    ],
    top_eventos: [
        { evento: "CPU", cantidad: 2376 },
        { evento: "SQL Query", cantidad: 2330 },
        { evento: "Memory", cantidad: 1161 },
        { evento: "Logfile Entry", cantidad: 1128 },
        { evento: "Png", cantidad: 976 }
    ],
    automatizaciones: [
        {
            nombre: "Auto-scaling de contenedores",
            descripcion: "Escalado automático basado en métricas de CPU y memoria",
            fecha_implementacion: "2024-01-10",
            ahorro_horas: 35,
            estado: "Activo"
        },
        {
            nombre: "Resolución automática de incidentes Tier 1",
            descripcion: "Bot que resuelve incidentes comunes sin intervención humana",
            fecha_implementacion: "2023-12-15",
            ahorro_horas: 45,
            estado: "Activo"
        },
        {
            nombre: "Backup automatizado multi-región",
            descripcion: "Sistema de respaldo automático con replicación geográfica",
            fecha_implementacion: "2024-01-05",
            ahorro_horas: 20,
            estado: "Activo"
        },
        {
            nombre: "Parcheo automático de seguridad",
            descripcion: "Aplicación automática de parches críticos en horarios de bajo tráfico",
            fecha_implementacion: "2024-01-20",
            ahorro_horas: 15,
            estado: "Activo"
        },
        {
            nombre: "Monitoreo predictivo con ML",
            descripcion: "Detección de anomalías y predicción de fallos usando machine learning",
            fecha_implementacion: "2024-01-25",
            ahorro_horas: 5,
            estado: "En Progreso"
        }
    ],
    capacidad_runway: {
        storage_onprem: { utilizacion: 85, meses_restantes: 2, capacidad_total: "500TB", usado: "425TB" },
        cloud_budget: { utilizacion: 60, meses_restantes: 6, presupuesto: "$50,000", usado: "$30,000" }
    },
    riesgos: [
        { titulo: "Capacidad Storage On-Prem", impacto: "Alto", probabilidad: "Alta", mitigacion: "Expansión planificada Q2" },
        { titulo: "Dependencia Proveedor Único", impacto: "Medio", probabilidad: "Media", mitigacion: "Evaluación multi-cloud" },
        { titulo: "Obsolescencia Tecnológica", impacto: "Medio", probabilidad: "Baja", mitigacion: "Roadmap de modernización" },
        { titulo: "Falta de Redundancia en DB Principal", impacto: "Alto", probabilidad: "Media", mitigacion: "Implementar cluster HA" },
        { titulo: "Vulnerabilidades sin Parchear", impacto: "Alto", probabilidad: "Alta", mitigacion: "Automatizar parcheo" },
        { titulo: "Falta de Documentación Técnica", impacto: "Bajo", probabilidad: "Alta", mitigacion: "Plan de documentación" },
        { titulo: "Rotación de Personal Clave", impacto: "Medio", probabilidad: "Media", mitigacion: "Programa de retención" },
        { titulo: "Falta de Plan DR Actualizado", impacto: "Alto", probabilidad: "Baja", mitigacion: "Revisión trimestral DR" },
        { titulo: "Crecimiento No Planificado", impacto: "Bajo", probabilidad: "Media", mitigacion: "Monitoreo de tendencias" }
    ],
    roadmap: [
        { fecha: "Semana 1", hito: "Implementación de monitoreo predictivo" },
        { fecha: "Semana 2", hito: "Migración de servicios críticos a HA" },
        { fecha: "Semana 3", hito: "Optimización de base de datos móvil" },
        { fecha: "Semana 4", hito: "Revisión de capacidad y proyecciones Q2" }
    ]
};

// Renderizado principal
function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderHeader()}
        ${renderDashboardGrid()}
        ${renderFooter()}
        ${renderModal()}
    `;
    attachEventListeners();
}

function renderHeader() {
    const { disponibilidad_global, cumplimiento_vulnerabilidades, vulnerabilidades_totales, vulnerabilidades_resueltas, cumplimiento_compromisos, incidentes_criticos, incidentes_Seti } = data.resumen_ejecutivo;
    const disponibilidadColor = disponibilidad_global >= 99.9 ? '#00DEBC' : '#f44336';
    const vulnerabilidadesColor = cumplimiento_vulnerabilidades >= 95 ? '#00DEBC' : cumplimiento_vulnerabilidades >= 80 ? '#01ADEF' : '#f44336';
    const cumplimientoColor = cumplimiento_compromisos >= 95 ? '#00DEBC' : cumplimiento_compromisos >= 85 ? '#01ADEF' : '#f44336';
    
    return `
        <div class="header-top">
            <img src="logo.png" alt="Logo">
            <h1>Informe del Servicio Febrero 2026</h1>
        </div>
        <header class="header">
            <div class="kpi-container">
                <div class="kpi-card kpi-card-clickable" id="disponibilidad-card">
                    <div class="kpi-label">
                        <span class="material-icons">check_circle</span>
                        Disponibilidad Global
                    </div>
                    <div class="kpi-value" style="color: ${disponibilidadColor}; text-align: center">${disponibilidad_global}%</div>
                    <div class="kpi-meta" style="text-align: center">Meta: 99.47%</div>
                    <div class="kpi-meta" style="text-align: center">Click para ver detalle</div>
                </div>
                <div class="kpi-card kpi-card-clickable" id="incidentes-card">
                    <div class="kpi-label">
                        <span class="material-icons">error</span>
                        Incidentes
                    </div>
                    <div style="display: flex; gap: 1.5rem; justify-content: center; margin-top: 0.5rem;">
                        <div class="incident-metric" data-type="criticos">
                            <div style="color: #020B50; font-size: 0.7rem; margin-bottom: 0.25rem;">Totales</div>
                            <div style="color: #DC3535; font-size: 1.5rem; font-weight: 700; text-align: center">${incidentes_criticos}</div>
                        </div>
                        <div class="incident-metric" data-type="totales">
                            <div style="color: #020B50; font-size: 0.7rem; margin-bottom: 0.25rem;">Seti</div>
                            <div style="color: #0050F6; font-size: 1.5rem; font-weight: 700; text-align: center">${incidentes_Seti}</div>
                        </div>
                    </div>
                    <div class="kpi-meta" style="margin-top: 0.5rem;text-align: center">Click para ver detalle</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">
                        <span class="material-icons">schedule</span>
                        Tiempos de Respuesta
                    </div>
                    <div style="display: flex; gap: 1.5rem; justify-content: center; margin-top: 0.5rem;">
                        <div>
                            <div style="color: #020B50; font-size: 0.7rem; margin-bottom: 0.25rem;">MTTR</div>
                            <div style="color: #00896E; font-size: 1.5rem; font-weight: 700;">93min</div>
                        </div>
                        <div>
                            <div style="color: #020B50; font-size: 0.7rem; margin-bottom: 0.25rem;">MTBF</div>
                            <div style="color: #0050F6; font-size: 1.5rem; font-weight: 700;">5h</div>
                        </div>
                    </div>
                    <div class="kpi-meta" style="margin-top: 0.5rem; text-align:center">Mean Time To Repair / Between Failures</div>
                </div>
                <div class="kpi-card kpi-card-clickable" id="vulnerabilidades-card">
                    <div class="kpi-label">
                        <span class="material-icons">security</span>
                        Cumplimiento de Vulnerabilidades
                    </div>
                    <div class="kpi-value" style="color: ${vulnerabilidadesColor};text-align: center;">${cumplimiento_vulnerabilidades}%</div>
                    <div class="kpi-meta" style="font-size: 0.7rem; text-align: center;">${vulnerabilidades_resueltas.toLocaleString('es-CL')}/${vulnerabilidades_totales.toLocaleString('es-CL')} vulnerabilidades resueltas</div>
                </div>
                <div class="kpi-card kpi-card-clickable" id="cumplimiento-compromisos-card">
                    <div class="kpi-label">
                        <span class="material-icons">assignment_turned_in</span>
                        Cumplimiento de Compromisos
                    </div>
                    <div class="kpi-value" style="color: ${cumplimientoColor}; text-align: center;">${cumplimiento_compromisos}%</div>
                    <div class="kpi-meta" style="text-align: center;">Click para ver detalle</div>
                </div>
            </div>
        </header>
    `;
}

function renderDashboardGrid() {
    return `
        <div class="dashboard-grid">
            ${renderServiciosCard()}
            ${renderSLACard()}
            ${renderResilienciaCard()}
            ${renderAlertamientoCard()}
            ${renderEficienciaCard()}
        </div>
    `;
}

function renderServiciosCard() {
    const servicios = data.servicios_negocio;
    return `
        <div class="card card-wide" data-section="servicios">
            <div class="card-header">
                <span class="material-icons card-icon">business</span>
                <h2 class="card-title">Servicios de Negocio</h2>
            </div>
            <div class="services-table-container">
                <table class="services-table">
                    <thead>
                        <tr>
                            <th>Servicio</th>
                            <th>Disponibilidad</th>
                            <th>Incidentes</th>
                            <th>Despliegues</th>
                            <th>Capacidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${servicios.map((s, index) => {
                            const color = s.uptime >= 99.9 ? '#00DEBC' : s.uptime >= 99 ? '#01ADEF' : '#f44336';
                            const capacidadColor = s.capacidad.alertas === 0 ? '#00DEBC' : s.capacidad.alertas <= 2 ? '#01ADEF' : '#f44336';
                            const capacidadIcon = s.capacidad.alertas === 0 ? 'check_circle' : s.capacidad.alertas <= 2 ? 'warning' : 'error';
                            const tasaExito = ((s.despliegues_exitosos / s.despliegues_total) * 100).toFixed(0);
                            return `
                                <tr class="service-row" data-service-index="${index}">
                                    <td class="service-name-cell">${s.nombre}</td>
                                    <td>
                                        <span class="service-metric" style="color: ${color}">
                                            <span class="material-icons" style="font-size: 16px; vertical-align: middle;">check_circle</span>
                                            ${s.uptime}%
                                        </span>
                                    </td>
                                    <td>
                                        <span class="service-metric">
                            <span class="material-icons" style="font-size: 16px; vertical-align: middle; color: ${s.incidentes > 5 ? '#f44336' : '#4A4E5A'};">warning</span>
                                            ${s.incidentes}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="deployment-info">
                                            <span class="service-metric">${s.despliegues_exitosos}/${s.despliegues_total}</span>
                                            <div class="deployment-bar">
                                                <div class="deployment-fill" style="width: ${tasaExito}%"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="service-metric" style="color: ${capacidadColor}">
                                            <span class="material-icons" style="font-size: 18px; vertical-align: middle;">${capacidadIcon}</span>
                                            ${s.capacidad.alertas}
                                        </span>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderSLACard() {
    const { mes_actual, mes_anterior, objetivo } = data.sla_performance;
    const maxVal = Math.max(mes_actual, mes_anterior, objetivo);
    
    return `
        <div class="card" data-section="sla">
            <div class="card-header">
                <span class="material-icons card-icon">trending_up</span>
                <h2 class="card-title">Desempeño (SLA)</h2>
            </div>
            <div class="bar-chart">
                <div class="bar" style="height: ${(mes_anterior / maxVal) * 100}%">
                    <div class="bar-value">${mes_anterior}%</div>
                    <div class="bar-label">Mes Anterior</div>
                </div>
                <div class="bar" style="height: ${(mes_actual / maxVal) * 100}%">
                    <div class="bar-value">${mes_actual}%</div>
                    <div class="bar-label">Mes Actual</div>
                </div>
                <div class="bar" style="height: ${(objetivo / maxVal) * 100}%; background: linear-gradient(to top, #00DEBC, #01ADEF);">
                    <div class="bar-value">${objetivo}%</div>
                    <div class="bar-label">Objetivo</div>
                </div>
            </div>
        </div>
    `;
}

function renderResilienciaCard() {
    const offenders = data.resiliencia.top_offenders;
    return `
        <div class="card" data-section="resiliencia">
            <div class="card-header">
                <span class="material-icons card-icon">security</span>
                <h2 class="card-title">Resiliencia</h2>
            </div>
            <div style="margin-top: 1rem;">
                <h4 style="color: #2D3142; font-size: 0.85rem; margin-bottom: 1rem;">Top Offenders</h4>
                ${offenders.map(o => `
                    <div class="service-item">
                        <div>
                            <div class="service-name">${o.sistema}</div>
                            <div style="font-size: 0.75rem; color: #4A4E5A;">Recurrencia: ${o.recurrencia}%</div>
                        </div>
                        <span style="color: #DC3535; font-weight: 600;">${o.fallas} fallas</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAlertamientoCard() {
    const alertas = data.alertas_por_servicio;
    const totalAlertas = alertas.reduce((sum, a) => sum + a.alertas, 0);
    const eventos = data.top_eventos;
    const maxEventos = Math.max(...eventos.map(e => e.cantidad));
    
    const colores = ['#0050F6', '#00DEBC', '#01ADEF', '#5B8DEF', '#00B89C'];
    let currentAngle = 0;
    
    const pieSlices = alertas.map((item, index) => {
        const porcentaje = (item.alertas / totalAlertas) * 100;
        const angle = (item.alertas / totalAlertas) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;
        
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        const largeArc = angle > 180 ? 1 : 0;
        
        const x1 = 60 + 50 * Math.cos(startRad);
        const y1 = 60 + 50 * Math.sin(startRad);
        const x2 = 60 + 50 * Math.cos(endRad);
        const y2 = 60 + 50 * Math.sin(endRad);
        
        return {
            path: `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`,
            color: colores[index % colores.length],
            servicio: item.servicio,
            alertas: item.alertas,
            porcentaje: porcentaje.toFixed(1)
        };
    });

    return `
        <div class="card" data-section="alertamiento">
            <div class="card-header">
                <span class="material-icons card-icon">notifications_active</span>
                <h2 class="card-title">Gestión de Eventos</h2>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <h4 style="color: #2D3142; font-size: 0.75rem; margin-bottom: 0.75rem; text-transform: uppercase; align-self: flex-start;">TOP 5 Eventos por Servicio</h4>
                    <svg width="100" height="100" viewBox="0 0 120 120">
                        ${pieSlices.map(slice => `
                            <path d="${slice.path}" fill="${slice.color}" stroke="#fff" stroke-width="1"/>
                        `).join('')}
                    </svg>
                    <div style="margin-top: 0.75rem; width: 90%;">
                        ${pieSlices.slice(0, 5).map(slice => `
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.7rem;">
                                <div style="width: 8px; height: 8px; background: ${slice.color}; border-radius: 2px;"></div>
                                <span style="color: #2D3142;">${slice.servicio}</span>
                                <span style="color: #4A4E5A; margin-left: auto;">${slice.alertas}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column;">
                    <h4 style="color: #2D3142; font-size: 0.75rem; margin-bottom: 0.75rem; text-transform: uppercase;">Top 5 Eventos</h4>
                    ${eventos.map((e, idx) => `
                        <div style="margin-bottom: 0.75rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                <span style="color: #2D3142; font-size: 0.7rem;">${e.evento}</span>
                                <span style="color: #020B50; font-size: 0.7rem; font-weight: 600;">${e.cantidad}</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: #E8EAF0; border-radius: 3px; overflow: hidden;">
                                <div style="width: ${(e.cantidad / maxEventos) * 100}%; height: 100%; background: ${colores[idx % colores.length]}; border-radius: 3px;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #E2E4E8; text-align: center;">
                <div style="color: #4A4E5A; font-size: 0.75rem; margin-bottom: 0.25rem;">Total Alertas Gestionadas</div>
                <div style="color: #020B50; font-size: 1.5rem; font-weight: 700;">13643</div>
            </div>
        </div>
    `;
}

function renderEficienciaCard() {
    const { porcentaje_automatizacion, avance_mes } = data.eficiencia;
    return `
        <div class="card kpi-card-clickable" data-section="eficiencia">
            <div class="card-header">
                <span class="material-icons card-icon">psychology</span>
                <h2 class="card-title">Eficiencia Operativa</h2>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
                <div style="text-align: center;">
                    <div style="color: #4A4E5A; font-size: 0.85rem; margin-bottom: 0.5rem;">Automatización Total</div>
                    <div style="color: #00DEBC; font-size: 2.5rem; font-weight: 700;">${porcentaje_automatizacion}%</div>
                </div>
                <div style="border-top: 1px solid #E2E4E8; padding-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: #4A4E5A; font-size: 0.85rem;">Avance del Mes</span>
                        <span style="color: #020B50; font-weight: 600;">+${avance_mes}%</span>
                    </div>
                    <div class="progress-bar" style="height: 10px; margin: 0;">
                        <div class="progress-fill" style="width: ${(avance_mes / 20) * 100}%; height: 100%;"></div>
                    </div>
                </div>
                <div style="text-align: center; color: #4A4E5A; font-size: 0.75rem; margin-top: 0.5rem;">
                    Click para ver detalle
                </div>
            </div>
        </div>
    `;
}

function renderCapacidadCard() {
    const { storage_onprem, cloud_budget } = data.capacidad_runway;
    return `
        <div class="card" data-section="capacidad">
            <div class="card-header">
                <span class="material-icons card-icon">storage</span>
                <h2 class="card-title">Capacidad & Runway</h2>
            </div>
            <div class="resource-item">
                <div class="resource-label">
                    <span>Storage On-Prem</span>
                    <span>${storage_onprem.meses_restantes} meses restantes</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${storage_onprem.utilizacion}%">
                        ${storage_onprem.utilizacion}%
                    </div>
                </div>
            </div>
            <div class="resource-item">
                <div class="resource-label">
                    <span>Cloud Budget</span>
                    <span>${cloud_budget.meses_restantes} meses restantes</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${cloud_budget.utilizacion}%; background: linear-gradient(90deg, #1b5e20, #4caf50);">
                        ${cloud_budget.utilizacion}%
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderFooter() {
    return ''
   /* return `
        <footer class="footer">
            <div class="card-header">
                <span class="material-icons card-icon">report_problem</span>
                <h2 class="card-title">Matriz de Riesgos</h2>
            </div>
            <div class="risk-matrix">
                ${data.riesgos.map(r => {
                    const impactoColor = r.impacto === 'Alto' ? 'rgba(244, 67, 54, 0.12)' : r.impacto === 'Medio' ? 'rgba(1, 173, 239, 0.12)' : 'rgba(0, 222, 188, 0.12)';
                    const borderColor = r.impacto === 'Alto' ? '#f44336' : r.impacto === 'Medio' ? '#01ADEF' : '#00DEBC';
                    return `
                        <div class="risk-item" style="background: ${impactoColor}; border-color: ${borderColor};">
                            <div class="risk-title">${r.titulo}</div>
                            <div class="risk-level">Impacto: ${r.impacto} | Prob: ${r.probabilidad}</div>
                            <div style="font-size: 0.75rem; color: #4A4E5A; margin-top: 0.5rem;">${r.mitigacion}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </footer>
    `;*/
}

function renderModal() {
    return `
        <div class="modal" id="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="modal-title"></h2>
                    <button class="modal-close" id="modal-close">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div id="modal-body"></div>
            </div>
        </div>
    `;
}

function attachEventListeners() {
    // Click en cards principales
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Evitar que el click en filas de servicio active el modal general
            if (!e.target.closest('.service-row')) {
                const section = card.dataset.section;
                if (section) {
                    openModal(section);
                }
            }
        });
    });

    // Click en filas de servicios individuales
    document.querySelectorAll('.service-row').forEach(row => {
        row.addEventListener('click', (e) => {
            e.stopPropagation();
            const serviceIndex = row.dataset.serviceIndex;
            openServiceDetailModal(serviceIndex);
        });
    });

    // Click en panel de disponibilidad
    const disponibilidadCard = document.getElementById('disponibilidad-card');
    if (disponibilidadCard) {
        disponibilidadCard.addEventListener('click', () => {
            openDisponibilidadModal();
        });
    }

    // Click en panel de incidentes (críticos o totales)
    const incidentesCard = document.getElementById('incidentes-card');
    if (incidentesCard) {
        const criticosMetric = incidentesCard.querySelector('[data-type="criticos"]');
        const totalesMetric = incidentesCard.querySelector('[data-type="totales"]');
        
        if (criticosMetric) {
            criticosMetric.addEventListener('click', (e) => {
                e.stopPropagation();
                openIncidentesCriticosModal();
            });
        }
        
        if (totalesMetric) {
            totalesMetric.addEventListener('click', (e) => {
                e.stopPropagation();
                openIncidentesTotalesModal();
            });
        }
    }

    // Click en panel de cumplimiento de compromisos
    const compromisosCard = document.getElementById('cumplimiento-compromisos-card');
    if (compromisosCard) {
        compromisosCard.addEventListener('click', () => {
            openCompromisosModal();
        });
    }

    // Click en panel de vulnerabilidades
    const vulnerabilidadesCard = document.getElementById('vulnerabilidades-card');
    if (vulnerabilidadesCard) {
        vulnerabilidadesCard.addEventListener('click', () => {
            openVulnerabilidadesModal();
        });
    }

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
}

function openModal(section) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    const content = getModalContent(section);
    title.textContent = content.title;
    body.innerHTML = content.body;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function openDisponibilidadModal() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    const historico = [
        { mes: 'Sep 2025', valor: 99.97 },
        { mes: 'Oct 2025', valor: 99.98 },
        { mes: 'Nov 2025', valor: 99.96 },
        { mes: 'Dic 2025', valor: 100.00 },
        { mes: 'Ene 2026', valor: 99.83 },
        { mes: 'Feb 2026', valor: 100.00 }
    ];

    const meta = 99.47;
    const minVal = Math.min(...historico.map(h => h.valor), meta) - 0.1;
    const maxVal = 100.05;
    const chartH = 250;
    const chartW = 700;
    const padL = 80;
    const padB = 40;
    const barW = 60;
    const gap = (chartW - padL) / historico.length;

    const scaleY = (v) => chartH - padB - ((v - minVal) / (maxVal - minVal)) * (chartH - padB - 20);
    const metaY = scaleY(meta);

    title.textContent = 'Tendencia de Disponibilidad Global';
    body.innerHTML = `
        <div class="detail-section">
            <h3>Últimos 6 Meses</h3>
            <div style="margin-top: 1rem; overflow-x: auto;">
                <svg width="100%" height="${chartH + 20}" viewBox="0 0 ${chartW + 40} ${chartH + 20}">
                    <!-- Eje Y -->
                    <line x1="${padL}" y1="10" x2="${padL}" y2="${chartH - padB}" stroke="#BCBEC2" stroke-width="1"/>
                    <!-- Eje X -->
                    <line x1="${padL}" y1="${chartH - padB}" x2="${chartW + 20}" y2="${chartH - padB}" stroke="#BCBEC2" stroke-width="1"/>
                    
                    <!-- Línea meta -->
                    <line x1="${padL}" y1="${metaY}" x2="${chartW + 20}" y2="${metaY}" stroke="#f44336" stroke-width="1" stroke-dasharray="6,4"/>
                    <text x="${padL - 5}" y="${metaY + 4}" fill="#f44336" font-size="11" text-anchor="end">${meta}%</text>
                    
                    ${historico.map((h, i) => {
                        const x = padL + 30 + (i * gap);
                        const y = scaleY(h.valor);
                        const barHeight = (chartH - padB) - y;
                        const color = h.valor >= meta ? '#00DEBC' : '#f44336';
                        return `
                            <rect x="${x - barW/2}" y="${y}" width="${barW}" height="${barHeight}" fill="${color}" rx="4" opacity="0.85"/>
                            <text x="${x}" y="${y - 8}" fill="#020B50" font-size="13" font-weight="600" text-anchor="middle">${h.valor.toFixed(2).replace('.', ',')}%</text>
                            <text x="${x}" y="${chartH - padB + 18}" fill="#4A4E5A" font-size="12" text-anchor="middle">${h.mes}</text>
                        `;
                    }).join('')}
                </svg>
            </div>
            <div style="display: flex; gap: 1.5rem; margin-top: 1rem; justify-content: center;">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="width: 14px; height: 14px; background: #00DEBC; border-radius: 3px; display: inline-block;"></span>
                    <span style="font-size: 0.85rem; color: #4A4E5A;">Cumple meta</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="width: 14px; height: 14px; background: #f44336; border-radius: 3px; display: inline-block;"></span>
                    <span style="font-size: 0.85rem; color: #4A4E5A;">No cumple meta</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="width: 20px; border-top: 2px dashed #f44336; display: inline-block;"></span>
                    <span style="font-size: 0.85rem; color: #4A4E5A;">Meta (${meta}%)</span>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function openIncidentesCriticosModal() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    // Calcular proporción de incidentes por fuente
    const fuentesMap = {};
    data.incidentes_criticos.forEach(inc => {
        const fuente = inc.fuente.split(' - ')[0]; // Tomar solo la primera parte
        fuentesMap[fuente] = (fuentesMap[fuente] || 0) + 1;
    });
    
    const fuentesData = Object.entries(fuentesMap).map(([fuente, count]) => ({
        fuente,
        count,
        porcentaje: ((count / data.incidentes_criticos.length) * 100).toFixed(1)
    }));

    // Colores para la torta - tonalidades de azules, verdes y blancos
    const colores = ['#2196f3', '#4caf50', '#00bcd4', '#8bc34a', '#03a9f4', '#66bb6a'];
    
    // Calcular ángulos para SVG
    let currentAngle = 0;
    const pieSlices = fuentesData.map((item, index) => {
        const angle = (item.count / data.incidentes_criticos.length) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;
        
        // Convertir ángulos a coordenadas
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        const largeArc = angle > 180 ? 1 : 0;
        
        const x1 = 100 + 80 * Math.cos(startRad);
        const y1 = 100 + 80 * Math.sin(startRad);
        const x2 = 100 + 80 * Math.cos(endRad);
        const y2 = 100 + 80 * Math.sin(endRad);
        
        return {
            path: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`,
            color: colores[index % colores.length],
            ...item
        };
    });

    title.textContent = 'Incidentes Críticos del Mes';
    body.innerHTML = `
        <div class="detail-section">
            <h3>Resumen de Incidentes</h3>
            <div class="service-metrics-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="metric-box">
                    <div class="metric-label">Total Incidentes</div>
                    <div class="metric-value" style="color: #f44336">${data.incidentes_criticos.length}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Tiempo Promedio Recuperación</div>
                    <div class="metric-value" style="font-size: 1.2rem;">1h 35min</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Servicios Afectados</div>
                    <div class="metric-value">${new Set(data.incidentes_criticos.map(i => i.servicio)).size}</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Incidentes por Fuente de Falla</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                <div style="display: flex; justify-content: center;">
                    <svg width="250" height="250" viewBox="0 0 200 200">
                        ${pieSlices.map(slice => `
                            <path d="${slice.path}" fill="${slice.color}" stroke="#E2E4E8" stroke-width="2"/>
                        `).join('')}
                    </svg>
                </div>
                <div>
                    ${pieSlices.map(slice => `
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div style="width: 20px; height: 20px; background: ${slice.color}; border-radius: 4px;"></div>
                            <div style="flex: 1;">
                                <div style="color: #020B50; font-weight: 600;">${slice.fuente}</div>
                                <div style="color: #4A4E5A; font-size: 0.85rem;">${slice.count} incidente${slice.count > 1 ? 's' : ''} (${slice.porcentaje}%)</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Detalle de Incidentes</h3>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Descripción</th>
                        <th>Tiempo de Recuperación</th>
                        <th>Fuente de la Falla</th>
                        <th>Impacto</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.incidentes_criticos.map(incidente => `
                        <tr>
                            <td><strong>${incidente.servicio}</strong></td>
                            <td>${incidente.descripcion}</td>
                            <td style="color: ${incidente.tiempo_recuperacion.includes('2h') ? '#f44336' : '#C49000'}">
                                ${incidente.tiempo_recuperacion}
                            </td>
                            <td>
                                <div style="font-size: 0.9rem;">${incidente.fuente}</div>
                                <div style="font-size: 0.75rem; color: #4A4E5A; margin-top: 0.25rem;">${incidente.fecha}</div>
                            </td>
                            <td>
                                <span class="status-badge status-${incidente.impacto === 'Crítico' ? 'rojo' : 'amarillo'}">
                                    ${incidente.impacto}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="detail-section">
            <h3>Análisis y Acciones</h3>
            <div class="alert-item" style="border-left: 4px solid #f44336">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span class="material-icons" style="color: #f44336;">priority_high</span>
                    <strong style="color: #020B50;">Acciones Requeridas</strong>
                </div>
                <ul style="color: #2D3142; line-height: 1.8; margin-left: 1.5rem;">
                    <li>Implementar optimización de queries en base de datos de App Móvil</li>
                    <li>Configurar auto-scaling en API Gateway para E-commerce</li>
                    <li>Investigar y corregir memory leak en Portal Clientes</li>
                    <li>Establecer monitoreo proactivo para prevenir recurrencia</li>
                </ul>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function openCompromisosModal() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    const completados = data.compromisos.filter(c => c.estado === 'Completado').length;
    const enProgreso = data.compromisos.filter(c => c.estado === 'En Progreso').length;
    const promedioAvance = Math.round(data.compromisos.reduce((sum, c) => sum + c.avance, 0) / data.compromisos.length);

    title.textContent = 'Cumplimiento de Compromisos';
    body.innerHTML = `
        <div class="detail-section">
            <h3>Resumen General</h3>
            <div class="service-metrics-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="metric-box">
                    <div class="metric-label">Compromisos Completados</div>
                    <div class="metric-value" style="color: #4caf50">${completados}/${data.compromisos.length}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">En Progreso</div>
                    <div class="metric-value" style="color: #C49000">${enProgreso}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Avance Promedio</div>
                    <div class="metric-value" style="color: ${promedioAvance >= 95 ? '#4caf50' : promedioAvance >= 85 ? '#C49000' : '#f44336'}">
                        ${promedioAvance}%
                    </div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Detalle de Compromisos</h3>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Compromiso</th>
                        <th>Descripción</th>
                        <th>Avance</th>
                        <th>Estado</th>
                        <th>Fecha Compromiso</th>
                        <th>Responsable</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.compromisos.map(compromiso => {
                        const avanceColor = compromiso.avance === 100 ? '#4caf50' : compromiso.avance >= 85 ? '#C49000' : '#f44336';
                        return `
                            <tr>
                                <td><strong>${compromiso.nombre}</strong></td>
                                <td style="font-size: 0.85rem;">${compromiso.descripcion}</td>
                                <td>
                                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                        <span style="color: ${avanceColor}; font-weight: 600;">${compromiso.avance}%</span>
                                        <div class="progress-bar" style="height: 8px; margin: 0;">
                                            <div class="progress-fill" style="width: ${compromiso.avance}%; height: 100%; background: ${avanceColor};"></div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="status-badge status-${compromiso.estado === 'Completado' ? 'verde' : 'amarillo'}">
                                        ${compromiso.estado}
                                    </span>
                                </td>
                                <td style="font-size: 0.85rem;">${compromiso.fecha_compromiso}</td>
                                <td style="font-size: 0.85rem;">${compromiso.responsable}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="detail-section">
            <h3>Observaciones</h3>
            <div class="alert-item" style="border-left: 4px solid #4caf50">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span class="material-icons" style="color: #4caf50;">check_circle</span>
                    <strong style="color: #020B50;">Estado General: Satisfactorio</strong>
                </div>
                <p style="color: #2D3142; line-height: 1.6;">
                    El cumplimiento general de compromisos es del ${promedioAvance}%, superando la meta del 90%. 
                    ${completados} de ${data.compromisos.length} compromisos han sido completados exitosamente. 
                    Los compromisos en progreso mantienen un avance adecuado y se espera su finalización en las fechas comprometidas.
                </p>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function openIncidentesTotalesModal() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    const { critico, medio, bajo } = data.incidentes_por_criticidad;
    const total = critico + medio + bajo;

    title.textContent = 'Incidentes Totales del Mes';
    body.innerHTML = `
        <div class="detail-section">
            <h3>Resumen por Criticidad</h3>
            <div class="service-metrics-grid" style="grid-template-columns: repeat(4, 1fr);">
                <div class="metric-box">
                    <div class="metric-label">Total</div>
                    <div class="metric-value">${total}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Críticos</div>
                    <div class="metric-value" style="color: #f44336">${critico}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Medios</div>
                    <div class="metric-value" style="color: #C49000">${medio}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Bajos</div>
                    <div class="metric-value" style="color: #4caf50">${bajo}</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Distribución por Criticidad</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                <div style="display: flex; justify-content: center;">
                    <svg width="250" height="250" viewBox="0 0 200 200">
                        <path d="M 100 100 L 100 20 A 80 80 0 0 1 ${100 + 80 * Math.sin((critico/total) * 2 * Math.PI)} ${100 - 80 * Math.cos((critico/total) * 2 * Math.PI)} Z" fill="#f44336" stroke="#E2E4E8" stroke-width="2"/>
                        <path d="M 100 100 L ${100 + 80 * Math.sin((critico/total) * 2 * Math.PI)} ${100 - 80 * Math.cos((critico/total) * 2 * Math.PI)} A 80 80 0 0 1 ${100 + 80 * Math.sin(((critico+medio)/total) * 2 * Math.PI)} ${100 - 80 * Math.cos(((critico+medio)/total) * 2 * Math.PI)} Z" fill="#C49000" stroke="#E2E4E8" stroke-width="2"/>
                        <path d="M 100 100 L ${100 + 80 * Math.sin(((critico+medio)/total) * 2 * Math.PI)} ${100 - 80 * Math.cos(((critico+medio)/total) * 2 * Math.PI)} A 80 80 0 0 1 100 20 Z" fill="#4caf50" stroke="#E2E4E8" stroke-width="2"/>
                    </svg>
                </div>
                <div>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 20px; height: 20px; background: #f44336; border-radius: 4px;"></div>
                        <div style="flex: 1;">
                            <div style="color: #020B50; font-weight: 600;">Críticos</div>
                            <div style="color: #4A4E5A; font-size: 0.85rem;">${critico} incidentes (${((critico/total)*100).toFixed(1)}%)</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 20px; height: 20px; background: #C49000; border-radius: 4px;"></div>
                        <div style="flex: 1;">
                            <div style="color: #020B50; font-weight: 600;">Medios</div>
                            <div style="color: #4A4E5A; font-size: 0.85rem;">${medio} incidentes (${((medio/total)*100).toFixed(1)}%)</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 20px; height: 20px; background: #4caf50; border-radius: 4px;"></div>
                        <div style="flex: 1;">
                            <div style="color: #020B50; font-weight: 600;">Bajos</div>
                            <div style="color: #4A4E5A; font-size: 0.85rem;">${bajo} incidentes (${((bajo/total)*100).toFixed(1)}%)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Tendencia Histórica - Últimos 6 Meses</h3>
            <div class="trend-chart">
                <svg width="100%" height="100%" viewBox="0 0 700 200">
                    <line x1="0" y1="40" x2="700" y2="40" stroke="#2a2a2a" stroke-width="1" stroke-dasharray="5,5"/>
                    <line x1="0" y1="80" x2="700" y2="80" stroke="#2a2a2a" stroke-width="1" stroke-dasharray="5,5"/>
                    <line x1="0" y1="120" x2="700" y2="120" stroke="#2a2a2a" stroke-width="1" stroke-dasharray="5,5"/>
                    <line x1="0" y1="160" x2="700" y2="160" stroke="#333" stroke-width="2"/>
                    
                    <polyline points="${data.incidentes_historico.totales.map((val, idx) => `${idx * 140},${160 - (val * 3.5)}`).join(' ')}" 
                        fill="none" stroke="#C49000" stroke-width="3"/>
                    <polyline points="${data.incidentes_historico.criticos.map((val, idx) => `${idx * 140},${160 - (val * 3.5)}`).join(' ')}" 
                        fill="none" stroke="#f44336" stroke-width="3"/>
                    
                    ${data.incidentes_historico.totales.map((val, idx) => `
                        <circle cx="${idx * 140}" cy="${160 - (val * 3.5)}" r="4" fill="#C49000"/>
                        <text x="${idx * 140}" y="${160 - (val * 3.5) - 10}" fill="#C49000" font-size="11" text-anchor="middle">${val}</text>
                    `).join('')}
                    
                    ${data.incidentes_historico.criticos.map((val, idx) => `
                        <circle cx="${idx * 140}" cy="${160 - (val * 3.5)}" r="4" fill="#f44336"/>
                        <text x="${idx * 140}" y="${160 - (val * 3.5) + 15}" fill="#f44336" font-size="11" text-anchor="middle">${val}</text>
                    `).join('')}
                    
                    <text x="0" y="180" fill="#4A4E5A" font-size="12">Mes 1</text>
                    <text x="140" y="180" fill="#4A4E5A" font-size="12">Mes 2</text>
                    <text x="280" y="180" fill="#4A4E5A" font-size="12">Mes 3</text>
                    <text x="420" y="180" fill="#4A4E5A" font-size="12">Mes 4</text>
                    <text x="560" y="180" fill="#4A4E5A" font-size="12">Mes 5</text>
                    <text x="700" y="180" fill="#4A4E5A" font-size="12" text-anchor="end">Mes 6</text>
                    
                    <line x1="500" y1="20" x2="530" y2="20" stroke="#C49000" stroke-width="3"/>
                    <text x="535" y="24" fill="#C49000" font-size="12">Totales</text>
                    <line x1="600" y1="20" x2="630" y2="20" stroke="#f44336" stroke-width="3"/>
                    <text x="635" y="24" fill="#f44336" font-size="12">Críticos</text>
                </svg>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Análisis</h3>
            <p style="color: #2D3142; line-height: 1.6;">
                Durante el mes actual se registraron <strong>${total} incidentes</strong>, de los cuales 
                <strong style="color: #f44336;">${critico} fueron críticos</strong> (${((critico/total)*100).toFixed(1)}%), 
                <strong style="color: #C49000;">${medio} de severidad media</strong> (${((medio/total)*100).toFixed(1)}%) y 
                <strong style="color: #4caf50;">${bajo} de baja severidad</strong> (${((bajo/total)*100).toFixed(1)}%). 
                La tendencia histórica muestra una reducción del ${((1 - total/data.incidentes_historico.totales[0]) * 100).toFixed(0)}% 
                respecto al primer mes del período.
            </p>
        </div>
    `;

    modal.classList.add('active');
}

function openVulnerabilidadesModal() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    const { cumplimiento_vulnerabilidades, vulnerabilidades_totales, vulnerabilidades_resueltas } = data.resumen_ejecutivo;
    const vulnerabilidades_pendientes = vulnerabilidades_totales - vulnerabilidades_resueltas;

    title.textContent = 'Cumplimiento de Vulnerabilidades';
    body.innerHTML = `
        <div class="detail-section">
            <h3>Resumen Actual</h3>
            <div class="service-metrics-grid" style="grid-template-columns: repeat(4, 1fr);">
                <div class="metric-box">
                    <div class="metric-label">Cumplimiento</div>
                    <div class="metric-value" style="color: ${cumplimiento_vulnerabilidades >= 95 ? '#4caf50' : cumplimiento_vulnerabilidades >= 80 ? '#C49000' : '#f44336'}">
                        ${cumplimiento_vulnerabilidades}%
                    </div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Total</div>
                    <div class="metric-value">${vulnerabilidades_totales.toLocaleString('es-CL')}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Resueltas</div>
                    <div class="metric-value" style="color: #4caf50">${vulnerabilidades_resueltas.toLocaleString('es-CL')}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Pendientes</div>
                    <div class="metric-value" style="color: #f44336">${vulnerabilidades_pendientes.toLocaleString('es-CL')}</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Histórico - Últimos 6 Meses</h3>
            <div style="margin-top: 1rem;">
                <svg width="100%" height="300" viewBox="0 0 800 300">
                    <line x1="60" y1="0" x2="60" y2="250" stroke="#333" stroke-width="2"/>
                    <line x1="60" y1="250" x2="800" y2="250" stroke="#333" stroke-width="2"/>
                    
                    ${[0, 1, 2, 3, 4, 5].map(idx => {
                        const x = 120 + (idx * 120);
                        const totales = data.vulnerabilidades_historico.totales[idx];
                        const resueltas = data.vulnerabilidades_historico.resueltas[idx];
                        const maxVal = Math.max(...data.vulnerabilidades_historico.totales);
                        const barHeight1 = (totales / maxVal) * 200;
                        const barHeight2 = (resueltas / maxVal) * 200;
                        
                        return `
                            <rect x="${x - 25}" y="${250 - barHeight1}" width="20" height="${barHeight1}" 
                                fill="#f44336" rx="2"/>
                            <text x="${x - 15}" y="${250 - barHeight1 - 5}" fill="#f44336" 
                                font-size="12" text-anchor="middle">${totales}</text>
                            
                            <rect x="${x + 5}" y="${250 - barHeight2}" width="20" height="${barHeight2}" 
                                fill="#4caf50" rx="2"/>
                            <text x="${x + 15}" y="${250 - barHeight2 - 5}" fill="#4caf50" 
                                font-size="12" text-anchor="middle">${resueltas}</text>
                            
                            <text x="${x}" y="270" fill="#4A4E5A" font-size="13" text-anchor="middle">Mes ${idx + 1}</text>
                        `;
                    }).join('')}
                    
                    <text x="50" y="255" fill="#4A4E5A" font-size="12" text-anchor="end">0</text>
                    <text x="50" y="130" fill="#4A4E5A" font-size="12" text-anchor="end">25</text>
                    <text x="50" y="10" fill="#4A4E5A" font-size="12" text-anchor="end">50</text>
                    
                    <rect x="600" y="20" width="15" height="15" fill="#f44336" rx="2"/>
                    <text x="620" y="32" fill="#e0e0e0" font-size="13">Totales</text>
                    <rect x="680" y="20" width="15" height="15" fill="#4caf50" rx="2"/>
                    <text x="700" y="32" fill="#e0e0e0" font-size="13">Resueltas</text>
                </svg>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Análisis de Tendencia</h3>
            <p style="color: #2D3142; line-height: 1.6;">
                El cumplimiento de vulnerabilidades actual es del <strong style="color: ${cumplimiento_vulnerabilidades >= 95 ? '#4caf50' : cumplimiento_vulnerabilidades >= 80 ? '#C49000' : '#f44336'}">${cumplimiento_vulnerabilidades}%</strong>. 
                Durante los últimos 6 meses, se ha observado una reducción del 
                <strong>${((1 - vulnerabilidades_totales/data.vulnerabilidades_historico.totales[0]) * 100).toFixed(1)}%</strong> 
                en el total de vulnerabilidades detectadas. 
                Actualmente quedan <strong style="color: #f44336;">${vulnerabilidades_pendientes} vulnerabilidades pendientes</strong> 
                de resolución, lo que representa el ${((vulnerabilidades_pendientes/vulnerabilidades_totales)*100).toFixed(1)}% del total.
            </p>
        </div>
        
        <div class="detail-section">
            <h3>Recomendaciones</h3>
            <ul style="color: #2D3142; line-height: 1.8; margin-left: 1.5rem;">
                <li>Priorizar la resolución de las ${vulnerabilidades_pendientes} vulnerabilidades pendientes</li>
                <li>Implementar proceso de parcheo automatizado para reducir tiempo de respuesta</li>
                <li>Establecer SLA de resolución según criticidad (Críticas: 24h, Altas: 7d, Medias: 30d)</li>
                <li>Realizar escaneos de vulnerabilidades semanales en lugar de mensuales</li>
            </ul>
        </div>
    `;

    modal.classList.add('active');
}

function openServiceDetailModal(serviceIndex) {
    const service = data.servicios_negocio[serviceIndex];
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = `Detalle: ${service.nombre}`;
    body.innerHTML = `
        <div class="detail-section">
            <h3>Métricas Actuales</h3>
            <div class="service-metrics-grid">
                <div class="metric-box">
                    <div class="metric-label">Disponibilidad</div>
                    <div class="metric-value" style="color: ${service.uptime >= 99.9 ? '#4caf50' : service.uptime >= 99 ? '#C49000' : '#f44336'}">
                        ${service.uptime}%
                    </div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Incidentes</div>
                    <div class="metric-value">${service.incidentes}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Tasa de Éxito Despliegues</div>
                    <div class="metric-value" style="color: ${service.despliegues_exitosos === service.despliegues_total ? '#4caf50' : '#C49000'}">
                        ${((service.despliegues_exitosos / service.despliegues_total) * 100).toFixed(0)}%
                    </div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Alertas de Capacidad</div>
                    <div class="metric-value">
                        <span class="status-badge status-${service.capacidad.alertas === 0 ? 'verde' : service.capacidad.alertas <= 2 ? 'amarillo' : 'rojo'}">
                            ${service.capacidad.alertas === 0 ? 'OK' : service.capacidad.alertas}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Tendencia de Disponibilidad - Últimos 6 Meses</h3>
            <div class="trend-chart">
                <svg width="100%" height="100%" viewBox="0 0 700 180">
                    <!-- Grid lines -->
                    <line x1="0" y1="30" x2="700" y2="30" stroke="#2a2a2a" stroke-width="1" stroke-dasharray="5,5"/>
                    <line x1="0" y1="60" x2="700" y2="60" stroke="#2a2a2a" stroke-width="1" stroke-dasharray="5,5"/>
                    <line x1="0" y1="90" x2="700" y2="90" stroke="#2a2a2a" stroke-width="1" stroke-dasharray="5,5"/>
                    <line x1="0" y1="120" x2="700" y2="120" stroke="#2a2a2a" stroke-width="1" stroke-dasharray="5,5"/>
                    <line x1="0" y1="150" x2="700" y2="150" stroke="#333" stroke-width="2"/>
                    
                    <!-- Trend line -->
                    <polyline points="${service.tendencia.map((val, idx) => {
                        const x = idx * 140;
                        const y = 150 - ((val - 98) * 60); // Escala de 98% a 100%
                        return `${x},${y}`;
                    }).join(' ')}" 
                        fill="none" stroke="#8b0000" stroke-width="3"/>
                    
                    <!-- Data points -->
                    ${service.tendencia.map((val, idx) => {
                        const x = idx * 140;
                        const y = 150 - ((val - 98) * 60);
                        return `
                            <circle cx="${x}" cy="${y}" r="5" fill="#8b0000"/>
                            <text x="${x}" y="${y - 15}" fill="#020B50" font-size="12" text-anchor="middle">${val}%</text>
                        `;
                    }).join('')}
                    
                    <!-- X-axis labels -->
                    <text x="0" y="170" fill="#4A4E5A" font-size="12">2025 Septiembre</text>
                    <text x="140" y="170" fill="#4A4E5A" font-size="12">2025 Octubre</text>
                    <text x="280" y="170" fill="#4A4E5A" font-size="12">2025 Noviembre</text>
                    <text x="420" y="170" fill="#4A4E5A" font-size="12">2025 Diciembre</text>
                    <text x="560" y="170" fill="#4A4E5A" font-size="12">2026 Enero</text>
                    <text x="700" y="170" fill="#4A4E5A" font-size="12" text-anchor="end">2026 Febrero</text>
                    
                    <!-- Y-axis labels -->
                    <text x="-5" y="155" fill="#4A4E5A" font-size="12" text-anchor="end">98%</text>
                    <text x="-5" y="95" fill="#4A4E5A" font-size="12" text-anchor="end">99%</text>
                    <text x="-5" y="35" fill="#4A4E5A" font-size="12" text-anchor="end">100%</text>
                </svg>
            </div>
        </div>
        
        ${service.capacidad.alertas > 0 ? `
            <div class="detail-section">
                <h3>Alertas de Capacidad</h3>
                <div class="capacity-alerts">
                    <div class="alert-item" style="border-left: 4px solid ${service.capacidad.alertas <= 2 ? '#C49000' : '#f44336'}">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span class="material-icons" style="color: ${service.capacidad.alertas <= 2 ? '#C49000' : '#f44336'};">warning</span>
                            <strong style="color: #020B50;">${service.capacidad.alertas} Alerta${service.capacidad.alertas > 1 ? 's' : ''} Activa${service.capacidad.alertas > 1 ? 's' : ''}</strong>
                        </div>
                        <div style="color: #2D3142; line-height: 1.6;">
                            ${service.capacidad.tipo}
                        </div>
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #E2E4E8; color: #4A4E5A; font-size: 0.85rem;">
                            <strong>Recomendación:</strong> ${service.capacidad.alertas >= 3 ? 
                                'Acción inmediata requerida. Escalar recursos o implementar optimizaciones urgentes.' :
                                'Monitorear de cerca. Planificar escalamiento preventivo en próxima ventana de mantenimiento.'
                            }
                        </div>
                    </div>
                </div>
            </div>
        ` : `
            <div class="detail-section">
                <h3>Estado de Capacidad</h3>
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #4caf50;">
                    <span class="material-icons">check_circle</span>
                    <span>No hay alertas de capacidad. Todos los recursos operando dentro de parámetros normales.</span>
                </div>
            </div>
        `}
        
        <div class="detail-section">
            <h3>Historial de Despliegues</h3>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Periodo</th>
                        <th>Total</th>
                        <th>Exitosos</th>
                        <th>Fallidos</th>
                        <th>Tasa de Éxito</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Mes Actual</td>
                        <td>${service.despliegues_total}</td>
                        <td style="color: #4caf50">${service.despliegues_exitosos}</td>
                        <td style="color: #f44336">${service.despliegues_total - service.despliegues_exitosos}</td>
                        <td>${((service.despliegues_exitosos / service.despliegues_total) * 100).toFixed(1)}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="detail-section">
            <h3>Análisis de Incidentes</h3>
            <p style="color: #2D3142; line-height: 1.6;">
                ${service.incidentes > 5 ? 
                    `<strong style="color: #f44336;">Alerta:</strong> Se han registrado ${service.incidentes} incidentes en el mes actual, superando el umbral aceptable. ${service.causa ? 'Causa principal identificada: ' + service.causa + '.' : 'Se requiere análisis RCA detallado.'}` :
                    `Se han registrado ${service.incidentes} incidente(s) en el mes actual, dentro de los parámetros normales de operación.`
                }
            </p>
        </div>
    `;

    modal.classList.add('active');
}

function getModalContent(section) {
    const contents = {
        servicios: {
            title: 'Detalle de Servicios de Negocio',
            body: `
                <div class="detail-section">
                    <h3>Análisis de Disponibilidad</h3>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Servicio</th>
                                <th>Uptime</th>
                                <th>Incidentes</th>
                                <th>Estado</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.servicios_negocio.map(s => `
                                <tr>
                                    <td>${s.nombre}</td>
                                    <td>${s.uptime}%</td>
                                    <td>${s.incidentes}</td>
                                    <td><span class="status-badge status-${s.estado === 'Estable' ? 'verde' : s.estado === 'Advertencia' ? 'amarillo' : 'rojo'}">${s.estado}</span></td>
                                    <td>${s.causa || 'Sin incidencias'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <h3>Tendencia de Disponibilidad (Últimos 6 meses)</h3>
                    <div class="trend-chart">
                        <svg width="100%" height="100%" viewBox="0 0 700 150">
                            <polyline points="0,50 116,30 232,40 348,20 464,35 580,10 700,15" 
                                fill="none" stroke="#8b0000" stroke-width="3"/>
                            <line x1="0" y1="140" x2="700" y2="140" stroke="#333" stroke-width="1"/>
                            <text x="50" y="160" fill="#4A4E5A" font-size="12">Ene</text>
                            <text x="200" y="160" fill="#4A4E5A" font-size="12">Feb</text>
                            <text x="350" y="160" fill="#4A4E5A" font-size="12">Mar</text>
                            <text x="500" y="160" fill="#4A4E5A" font-size="12">Abr</text>
                            <text x="650" y="160" fill="#4A4E5A" font-size="12">May</text>
                        </svg>
                    </div>
                </div>
            `
        },
        sla: {
            title: 'Análisis de Desempeño SLA',
            body: `
                <div class="detail-section">
                    <h3>Comparativa Mensual</h3>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Métrica</th>
                                <th>Mes Anterior</th>
                                <th>Mes Actual</th>
                                <th>Objetivo</th>
                                <th>Variación</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>01. Servicio soportado en ambientes previos</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>99,80%</td>
                                <td style="color: #4caf50">0%</td>
                            </tr>
                            <tr>
                                <td>01. Servicio soportado en ambientes productivos con esquema de alta disponibilidad</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>99,60%</td>
                                <td style="color: #4caf50">0%</td>
                            </tr>
                            <tr>
                                <td>01. Servicio soportado en ambientes productivos fuera del esquema de alta disponibilidad</td>
                                <td class="num">100,00%</td>
                                <td>100,00%</td>
                                <td>99,00%</td>
                                <td style="color: #4caf50">0%</td>
                            </tr>
                            <tr>
                                <td>02. Solución de Incidentes Producción y Contingencia</td>
                                <td>97,92%</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td style="color: #4caf50">+2,08%</td>
                            </tr>
                            <tr>
                                <td>04. Solución de Incidentes Ambientes Previos</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>96,50%</td>
                                <td style="color: #4caf50">0%</td>
                            </tr>
                            <tr>
                                <td>05. Cumplimiento de Entregables</td>
                                <td>90,00%</td>
                                <td>95,71%</td>
                                <td>98,00%</td>
                                <td style="color: #4caf50">+5,71%</td>
                            </tr>
                            <tr>
                                <td>06. Cumplimiento RTO y activación de contingencias</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>95,00%</td>
                                <td style="color: #4caf50">0%</td>
                            </tr>
                             <tr>
                                <td>07. Cumplimiento cierre vulnerabilidades externas altas</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>96,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>07. Cumplimiento cierre vulnerabilidades externas medias</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>99,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>08. Cumplimiento cierre vulnerabilidades internas altas</td>
                                <td>99,51%</td>
                                <td>100,00%</td>
                                <td>95,00%</td>
                                <td style="color: #4caf50">0,49%</td>
                            </tr>
                            <tr>
                                <td>08. Cumplimiento cierre vulnerabilidades internas medias</td>
                                <td>98,13%</td>
                                <td>99,73%</td>
                                <td>99,00%</td>
                                <td style="color: #4caf50">1,60%</td>
                            </tr>
                            <tr>
                                <td>09. Cierre de requerimientos registrados en Service Manager</td>
                                <td>100,00%</td>
                                <td>99,83%</td>
                                <td>100,00%</td>
                                <td style="color: #f44336">-0,17%</td>
                            </tr>
                            <tr>
                                <td>10. Recepción de Proyectos</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>95,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>12. Cumplimiento Hardening</td>
                                <td>100,00%</td>
                                <td>80,30%</td>
                                <td>99,00%</td>
                                <td style="color: #f44336">-19,70%</td>
                            </tr>
                            <tr>
                                <td>15. Restablecimiento de servicio ambientes previos</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>99,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>16. Cumplimiento de atención y solución de PQRS</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>98,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>17. Informes de incidentes servicios administrados</td>
                                <td>94,29%</td>
                                <td>84,34%</td>
                                <td>99,50%</td>
                                <td style="color: #f44336">-9,95%</td>
                            </tr>
                            <tr>
                                <td>18. Cumplimiento renovación de certificados</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>19. Cumplimiento de planes de acción sobre las plataformas</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>20. Cumplimiento de planes de afinamiento sobre las plataformas</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>21. Ejecución de cambios no autorizados</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                            <tr>
                                <td>22. Ejecución de cambios dentro de las ventanas autorizadas</td>
                                <td>99,50%</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td style="color: #4caf50">0,50%</td>
                            </tr>
                            <tr>
                                <td>23. Eficiencia en la implementación de cambios</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td>100,00%</td>
                                <td style="color: #4caf50">0,00%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <h3>Análisis de Brechas</h3>
                    <p style="color: #2D3142; line-height: 1.6;">
                        El cumplimiento actual se encuentra 0,85% por debajo del objetivo contractual.
Las principales causas identificadas son: vencimiento del plazo para una solicitud (RF), entrega oportunda de cinco informes preliminares de incidentes, uno definitivo y un entregable.
El resultado de la medición de hardening corresponde a una propuesta hecha desde SETI.
                    </p>
                </div>
            `
        },
        resiliencia: {
            title: 'Análisis de Resiliencia',
            body: `
                <div class="detail-section">
                    <h3>Top Offenders - Detalle</h3>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Sistema</th>
                                <th>Fallas Totales</th>
                                <th>Recurrencia</th>
                                <th>Causa Raíz</th>
                                <th>Acción Correctiva</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.resiliencia.top_offenders.map(o => `
                                <tr>
                                    <td>${o.sistema}</td>
                                    <td>${o.fallas}</td>
                                    <td>${o.recurrencia}%</td>
                                    <td>${o.sistema === 'App Móvil' ? 'Latencia DB' : o.sistema === 'E-commerce' ? 'Timeout API' : 'Picos de tráfico'}</td>
                                    <td>${o.sistema === 'App Móvil' ? 'Optimización queries' : o.sistema === 'E-commerce' ? 'Escalado horizontal' : 'Load balancing'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <h3>Análisis RCA (Root Cause Analysis)</h3>
                    <p style="color: #2D3142; line-height: 1.6; margin-bottom: 1rem;">
                        <strong style="color: #8b0000;">App Móvil:</strong> Análisis de performance reveló queries N+1 en módulo de transacciones. 
                        Implementación de caché Redis redujo latencia en 65%.
                    </p>
                    <p style="color: #2D3142; line-height: 1.6;">
                        <strong style="color: #8b0000;">E-commerce:</strong> Timeouts en API de pagos durante picos de Black Friday. 
                        Escalado automático configurado para manejar 3x carga base.
                    </p>
                </div>
            `
        },
        eficiencia: {
            title: 'Detalle de Eficiencia Operativa',
            body: `
                <div class="detail-section">
                    <h3>Métricas de Automatización</h3>
                    <div class="service-metrics-grid" style="grid-template-columns: repeat(3, 1fr);">
                        <div class="metric-box">
                            <div class="metric-label">Automatización Total</div>
                            <div class="metric-value" style="color: #4caf50">${data.eficiencia.porcentaje_automatizacion}%</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-label">Avance del Mes</div>
                            <div class="metric-value" style="color: #2196f3">+${data.eficiencia.avance_mes}%</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-label">Horas Ahorradas</div>
                            <div class="metric-value">${data.eficiencia.horas_ahorradas}h</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Automatizaciones Implementadas</h3>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Automatización</th>
                                <th>Descripción</th>
                                <th>Fecha Implementación</th>
                                <th>Ahorro (hrs/mes)</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.automatizaciones.map(auto => `
                                <tr>
                                    <td><strong>${auto.nombre}</strong></td>
                                    <td style="font-size: 0.85rem;">${auto.descripcion}</td>
                                    <td>${auto.fecha_implementacion}</td>
                                    <td style="color: #4caf50; font-weight: 600;">${auto.ahorro_horas}h</td>
                                    <td>
                                        <span class="status-badge status-${auto.estado === 'Activo' ? 'verde' : 'amarillo'}">
                                            ${auto.estado}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="detail-section">
                    <h3>Impacto y Beneficios</h3>
                    <div style="background: rgba(76, 175, 80, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #4caf50;">
                        <p style="color: #2D3142; line-height: 1.6; margin-bottom: 1rem;">
                            Las automatizaciones implementadas han generado un ahorro total de <strong style="color: #4caf50;">${data.eficiencia.horas_ahorradas} horas/mes</strong>, 
                            equivalente a <strong>${(data.eficiencia.horas_ahorradas / 160 * 100).toFixed(0)}%</strong> de un recurso FTE.
                        </p>
                        <p style="color: #2D3142; line-height: 1.6;">
                            El nivel de automatización actual del <strong style="color: #4caf50;">${data.eficiencia.porcentaje_automatizacion}%</strong> 
                            ha permitido reducir el MTTR en un ${data.eficiencia.mttr_reduccion} y resolver automáticamente 
                            ${data.eficiencia.incidentes_auto_resueltos} incidentes este mes.
                        </p>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Roadmap de Automatización</h3>
                    <ul style="color: #2D3142; line-height: 1.8; margin-left: 1.5rem;">
                        <li>Completar implementación de monitoreo predictivo con ML (En progreso)</li>
                        <li>Automatizar procesos de disaster recovery (Q2 2024)</li>
                        <li>Implementar self-healing para servicios críticos (Q2 2024)</li>
                        <li>Automatizar optimización de costos cloud (Q3 2024)</li>
                    </ul>
                </div>
            `
        },
        capacidad: {
            title: 'Análisis de Capacidad & Proyecciones',
            body: `
                <div class="detail-section">
                    <h3>Desglose por Recurso</h3>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Recurso</th>
                                <th>Capacidad Total</th>
                                <th>Utilizado</th>
                                <th>Disponible</th>
                                <th>Runway</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Storage On-Prem</td>
                                <td>${data.capacidad_runway.storage_onprem.capacidad_total}</td>
                                <td>${data.capacidad_runway.storage_onprem.usado}</td>
                                <td>75TB</td>
                                <td style="color: #f44336">${data.capacidad_runway.storage_onprem.meses_restantes} meses</td>
                            </tr>
                            <tr>
                                <td>Cloud Budget</td>
                                <td>${data.capacidad_runway.cloud_budget.presupuesto}</td>
                                <td>${data.capacidad_runway.cloud_budget.usado}</td>
                                <td>$20,000</td>
                                <td style="color: #4caf50">${data.capacidad_runway.cloud_budget.meses_restantes} meses</td>
                            </tr>
                            <tr>
                                <td>Compute (vCPU)</td>
                                <td>2,000 cores</td>
                                <td>1,400 cores</td>
                                <td>600 cores</td>
                                <td style="color: #C49000">4 meses</td>
                            </tr>
                            <tr>
                                <td>Memoria (RAM)</td>
                                <td>8TB</td>
                                <td>5.6TB</td>
                                <td>2.4TB</td>
                                <td style="color: #4caf50">5 meses</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <h3>Proyección de Crecimiento (6 meses)</h3>
                    <div class="trend-chart">
                        <svg width="100%" height="100%" viewBox="0 0 700 150">
                            <polyline points="0,100 116,90 232,75 348,60 464,40 580,20 700,5" 
                                fill="none" stroke="#8b0000" stroke-width="3" stroke-dasharray="5,5"/>
                            <line x1="0" y1="100" x2="700" y2="100" stroke="#4caf50" stroke-width="2" stroke-dasharray="3,3"/>
                            <line x1="0" y1="140" x2="700" y2="140" stroke="#333" stroke-width="1"/>
                            <text x="10" y="95" fill="#4caf50" font-size="12">Capacidad Actual</text>
                            <text x="10" y="10" fill="#f44336" font-size="12">Proyección</text>
                            <text x="50" y="160" fill="#4A4E5A" font-size="12">Mes 1</text>
                            <text x="200" y="160" fill="#4A4E5A" font-size="12">Mes 2</text>
                            <text x="350" y="160" fill="#4A4E5A" font-size="12">Mes 3</text>
                            <text x="500" y="160" fill="#4A4E5A" font-size="12">Mes 4</text>
                            <text x="650" y="160" fill="#4A4E5A" font-size="12">Mes 5</text>
                        </svg>
                    </div>
                    <p style="color: #2D3142; line-height: 1.6; margin-top: 1rem;">
                        <strong style="color: #f44336;">Alerta:</strong> Storage On-Prem alcanzará capacidad crítica (95%) en 2 meses. 
                        Se recomienda expansión inmediata o migración acelerada a cloud.
                    </p>
                </div>
            `
        }
    };

    return contents[section] || { title: 'Detalle', body: '<p>Contenido no disponible</p>' };
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', render);
