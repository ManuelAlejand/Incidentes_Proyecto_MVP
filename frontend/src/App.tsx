import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  topMetrics, 
  slaDesempeno, 
  topOffenders,
  modalDisponibilidadGlobal
} from './data';
import { useDataStore } from './store/dataStore';
import { UploadZone } from './components/UploadZone';
import { parseIncidentsFrontend } from './services/incidentParser';
import './index.css';

// Datos hardcodeados del prototipo original para las nuevas secciones
const eventData = {
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
    { evento: "Memory", cantidad: 1151 },
    { evento: "Log Availability", cantidad: 1139 },
    { evento: "Ping", cantidad: 970 }
  ]
};

const eficienciaData = {
  porcentaje_automatizacion: 68,
  avance_mes: 12,
  horas_ahorradas: 450,
  incidentes_auto_resueltos: 245,
  mttr_reduccion: "15%"
};

const automatizaciones = [
  { nombre: "Auto-Healing DB", descripcion: "Reinicio automático de pools de conexión", fecha_implementacion: "15/01/2026", ahorro_horas: 120, estado: "Activo" },
  { nombre: "Log Rotation Auto", descripcion: "Gestión automática de espacio en disco", fecha_implementacion: "20/01/2026", ahorro_horas: 80, estado: "Activo" },
  { nombre: "Predictive Monitoring", descripcion: "Detección de anomalías con ML", fecha_implementacion: "05/02/2026", ahorro_horas: 150, estado: "Activo" },
  { nombre: "Cache Purge Auto", descripcion: "Limpieza inteligente de CDN", fecha_implementacion: "10/02/2026", ahorro_horas: 100, estado: "Advertencia" }
];

const slaData = [
  { metrica: "01. Servicio soportado en ambientes previos", anterior: "100,00%", actual: "100,00%", objetivo: "99,80%", variacion: "0%", color: "#16A34A" },
  { metrica: "01. Servicio soportado en ambientes productivos con esquema de alta disponibilidad", anterior: "100,00%", actual: "100,00%", objetivo: "99,60%", variacion: "0%", color: "#16A34A" },
  { metrica: "01. Servicio soportado en ambientes productivos fuera del esquema de alta disponibilidad", anterior: "100,00%", actual: "100,00%", objetivo: "99,00%", variacion: "0%", color: "#16A34A" },
  { metrica: "02. Solución de Incidentes Producción y Contingencia", anterior: "97,92%", actual: "100,00%", objetivo: "100,00%", variacion: "+2,08%", color: "#16A34A" },
  { metrica: "04. Solución de Incidentes Ambientes Previos", anterior: "100,00%", actual: "100,00%", objetivo: "96,50%", variacion: "0%", color: "#16A34A" },
  { metrica: "05. Cumplimiento de Entregables", anterior: "90,00%", actual: "95,71%", objetivo: "98,00%", variacion: "+5,71%", color: "#16A34A" },
  { metrica: "06. Cumplimiento RTO y activación de contingencias", anterior: "100,00%", actual: "100,00%", objetivo: "95,00%", variacion: "0%", color: "#16A34A" },
  { metrica: "07. Cumplimiento cierre vulnerabilidades externas altas", anterior: "100,00%", actual: "100,00%", objetivo: "96,00%", variacion: "0,00%", color: "#16A34A" },
  { metrica: "08. Cumplimiento cierre vulnerabilidades internas altas", anterior: "99,51%", actual: "100,00%", objetivo: "95,00%", variacion: "0,49%", color: "#16A34A" },
  { metrica: "09. Cierre de requerimientos registrados en Service Manager", anterior: "100,00%", actual: "99,83%", objetivo: "100,00%", variacion: "-0,17%", color: "#DC2626" },
  { metrica: "12. Cumplimiento Hardening", anterior: "100,00%", actual: "80,30%", objetivo: "99,00%", variacion: "-19,70%", color: "#DC2626" },
  { metrica: "17. Informes de incidentes servicios administrados", anterior: "94,29%", actual: "84,34%", objetivo: "99,50%", variacion: "-9,95%", color: "#DC2626" }
];

const resilienciaDetalle = [
  { sistema: "App Móvil", fallas: 12, recurrencia: 45, causa: "Latencia DB", accion: "Optimización queries" },
  { sistema: "E-commerce", fallas: 8, recurrencia: 30, causa: "Timeout API", accion: "Escalado horizontal" },
  { sistema: "Core Bancario", fallas: 5, recurrencia: 15, causa: "Picos de tráfico", accion: "Load balancing" }
];

function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const { 
    hasData, 
    parsedExcelRawData, 
    projectNames, 
    activeProjectName, 
    setActiveProjectName, 
    resetData 
  } = useDataStore();

  const dynamicData = parsedExcelRawData && parsedExcelRawData.length > 0 
      ? parseIncidentsFrontend(parsedExcelRawData, activeProjectName || undefined) 
      : null;

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setActiveModal('service');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedService(null);
  };

  return (
    <div id="app">
      {/* Header Top - Navy Bar */}
      <div className="header-top">
        <img src="/logo.png" alt="Logo" onClick={resetData} style={{cursor: 'pointer'}} />
        <h1>Informe del Servicio Febrero 2026</h1>
        
        {hasData && (
          <div className="project-selector-container">
            <select 
              className="project-select"
              value={activeProjectName || ''}
              onChange={(e) => setActiveProjectName(e.target.value)}
            >
              {projectNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <button className="upload-btn" onClick={resetData}>
              <span className="material-icons">cloud_upload</span>
              Cambiar Archivo
            </button>
          </div>
        )}
      </div>

      {/* KPI Header - Gray Bar */}
      <header className="header">
        {!hasData ? (
          <div style={{ textAlign: 'center', color: 'var(--navy)', padding: '1rem' }}>
            <UploadZone />
          </div>
        ) : (
          <div className="kpi-container">
            {/* Disponibilidad Global - HARDCODED 100% GREEN as requested */}
            <div className="kpi-card kpi-card-clickable" onClick={() => setActiveModal('disponibilidad')}>
              <div className="kpi-label">
                <span className="material-icons">check_circle</span>
                Disponibilidad Global
              </div>
              <div className="kpi-value" style={{color: '#00DEBC', textAlign: 'center', fontSize: '2.5rem'}}>
                100%
              </div>
              <div className="kpi-meta" style={{textAlign: 'center'}}>Meta: 99.47%</div>
              <div className="kpi-meta" style={{textAlign: 'center'}}>Click para ver detalle</div>
            </div>

            {/* Incidentes */}
            <div className="kpi-card kpi-card-clickable" onClick={() => setActiveModal('incidentes')}>
              <div className="kpi-label">
                <span className="material-icons">error</span>
                Incidentes
              </div>
              <div style={{display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem'}}>
                <div className="incident-metric">
                  <div style={{color: '#020B50', fontSize: '0.7rem', marginBottom: '0.25rem', textAlign: 'center'}}>Totales</div>
                  <div style={{color: '#DC3535', fontSize: '1.8rem', fontWeight: '700', textAlign: 'center'}}>
                    {dynamicData ? dynamicData.summary.total : topMetrics.incidentes.totales}
                  </div>
                </div>
                <div className="incident-metric">
                  <div style={{color: '#020B50', fontSize: '0.7rem', marginBottom: '0.25rem', textAlign: 'center'}}>Seti</div>
                  <div style={{color: '#0050F6', fontSize: '1.8rem', fontWeight: '700', textAlign: 'center'}}>
                    {topMetrics.incidentes.seti}
                  </div>
                </div>
              </div>
              <div className="kpi-meta" style={{textAlign: 'center', marginTop: '0.5rem'}}>Click para ver detalle</div>
            </div>

            {/* Tiempos de Respuesta */}
            <div className="kpi-card">
              <div className="kpi-label">
                <span className="material-icons">schedule</span>
                Tiempos de Respuesta
              </div>
              <div style={{display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem'}}>
                <div>
                  <div style={{color: '#020B50', fontSize: '0.7rem', marginBottom: '0.25rem'}}>MTTR</div>
                  <div style={{color: '#00896E', fontSize: '1.8rem', fontWeight: '700'}}>
                    {dynamicData ? dynamicData.summary.avg_recovery_formatted : topMetrics.tiempos.mttr}
                  </div>
                </div>
                <div>
                  <div style={{color: '#020B50', fontSize: '0.7rem', marginBottom: '0.25rem'}}>MTBF</div>
                  <div style={{color: '#0050F6', fontSize: '1.8rem', fontWeight: '700'}}>
                    {dynamicData ? dynamicData.summary.mtbf_formatted : topMetrics.tiempos.mtbf}
                  </div>
                </div>
              </div>
              <div className="kpi-meta" style={{textAlign: 'center', marginTop: '0.5rem'}}>Mean Time To Repair / Between Failures</div>
            </div>

            {/* Vulnerabilidades */}
            <div className="kpi-card">
              <div className="kpi-label">
                <span className="material-icons">security</span>
                Cumplimiento de Vulnerabilidades
              </div>
              <div className="kpi-value" style={{color: '#00DEBC', textAlign: 'center', fontSize: '2.5rem'}}>
                100%
              </div>
              <div className="kpi-meta" style={{textAlign: 'center'}}>7.743/33.295 vulnerabilidades resueltas</div>
            </div>

            {/* Compromisos */}
            <div className="kpi-card">
              <div className="kpi-label">
                <span className="material-icons">assignment_turned_in</span>
                Cumplimiento de Compromisos
              </div>
              <div className="kpi-value" style={{color: '#01ADEF', textAlign: 'center', fontSize: '2.5rem'}}>
                95%
              </div>
              <div className="kpi-meta" style={{textAlign: 'center'}}>Click para ver detalle</div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Grid */}
      {hasData && (
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Section: Servicios de Negocio */}
            <div className="card">
              <div className="card-header">
                <span className="material-icons card-icon">business</span>
                <h2 className="card-title">Servicios de Negocio</h2>
              </div>
              <div className="services-table-container">
                <table className="services-table">
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
                    {dynamicData?.services.map((s, index) => {
                      const color = s.availability >= 99.9 ? '#00DEBC' : s.availability >= 99 ? '#01ADEF' : '#f44336';
                      const capacityColor = s.capacity.alerts === 0 ? '#00DEBC' : s.capacity.alerts <= 2 ? '#01ADEF' : '#f44336';
                      const capacityIcon = s.capacity.alerts === 0 ? 'check_circle' : s.capacity.alerts <= 2 ? 'warning' : 'error';
                      
                      return (
                        <tr key={index} onClick={() => handleServiceClick(s)}>
                          <td className="service-name-cell">{s.name}</td>
                          <td>
                            <span className="service-metric" style={{color}}>
                              <span className="material-icons" style={{fontSize: '16px'}}>check_circle</span>
                              {s.availability_formatted}
                            </span>
                          </td>
                          <td>
                            <span className="service-metric" style={{color: s.incident_count > 0 ? '#f44336' : 'inherit'}}>
                              <span className="material-icons" style={{fontSize: '16px'}}>report_problem</span>
                              {s.incident_count}
                            </span>
                          </td>
                          <td>
                            <div className="deployment-info">
                              <span style={{fontSize: '0.8rem', fontWeight: 600}}>
                                {s.deployments.success}/{s.deployments.total} ({s.deployments.rate_formatted})
                              </span>
                              <div className="deployment-bar">
                                <div className="deployment-fill" style={{width: s.deployments.rate_formatted}}></div>
                              </div>
                            </div>
                          </td>
                          <td style={{textAlign: 'center'}}>
                            <span className="capacity-badge" style={{background: `${capacityColor}20`, color: capacityColor}}>
                              <span className="material-icons" style={{fontSize: '14px', verticalAlign: 'middle', marginRight: '4px'}}>
                                {capacityIcon}
                              </span>
                              {s.capacity.alerts}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gestión de Eventos */}
            <div className="card kpi-card-clickable" onClick={() => setActiveModal('alertamiento')}>
              <div className="card-header">
                <span className="material-icons card-icon">notifications_active</span>
                <h2 className="card-title">Gestión de Eventos</h2>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <h4 style={{color: '#2D3142', fontSize: '0.75rem', marginBottom: '1rem', textTransform: 'uppercase', alignSelf: 'flex-start'}}>TOP 5 Eventos por Servicio</h4>
                  <div style={{display: 'flex', gap: '2rem', alignItems: 'center', width: '100%'}}>
                    <div style={{width: '100px', height: '100px', background: 'conic-gradient(#0050F6 0% 30%, #00DEBC 30% 55%, #01ADEF 55% 75%, #5B8DEF 75% 90%, #00B89C 90% 100%)', borderRadius: '50%'}}></div>
                    <div style={{flex: 1}}>
                      {eventData.alertas_por_servicio.map((item, idx) => (
                        <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.7rem'}}>
                          <div style={{width: '8px', height: '8px', background: ['#0050F6', '#00DEBC', '#01ADEF', '#5B8DEF', '#00B89C'][idx], borderRadius: '2px'}}></div>
                          <span style={{color: '#2D3142', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px'}}>{item.servicio.split('|')[0]}</span>
                          <span style={{color: '#4A4E5A', marginLeft: 'auto'}}>{item.alertas}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <h4 style={{color: '#2D3142', fontSize: '0.75rem', marginBottom: '1rem', textTransform: 'uppercase'}}>Top 5 Eventos</h4>
                  {eventData.top_eventos.map((e, idx) => (
                    <div key={idx} style={{marginBottom: '0.8rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                        <span style={{color: '#2D3142', fontSize: '0.7rem'}}>{e.evento}</span>
                        <span style={{color: '#020B50', fontSize: '0.7rem', fontWeight: 600}}>{e.cantidad}</span>
                      </div>
                      <div style={{width: '100%', height: '6px', background: '#E8EAF0', borderRadius: '3px', overflow: 'hidden'}}>
                        <div style={{width: `${(e.cantidad / 2376) * 100}%`, height: '100%', background: ['#0050F6', '#00DEBC', '#01ADEF', '#5B8DEF', '#00B89C'][idx], borderRadius: '3px'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E4E8', textAlign: 'center'}}>
                <div style={{color: '#4A4E5A', fontSize: '0.75rem', marginBottom: '0.25rem'}}>Total Alertas Gestionadas</div>
                <div style={{color: '#020B50', fontSize: '1.8rem', fontWeight: 700}}>13,643</div>
                <div style={{color: '#4A4E5A', fontSize: '0.7rem', marginTop: '0.5rem'}}>Click para ver detalle</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Desempeño (SLA) */}
            <div className="card kpi-card-clickable" onClick={() => setActiveModal('sla')}>
              <div className="card-header">
                <span className="material-icons card-icon">trending_up</span>
                <h2 className="card-title">Desempeño (SLA)</h2>
              </div>
              <div style={{height: '180px', width: '100%'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={slaDesempeno} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'rgba(0, 80, 246, 0.04)'}} />
                    <Bar dataKey="value" fill="var(--blue)" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: any) => `${v}%` }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{textAlign: 'center', color: '#4A4E5A', fontSize: '0.7rem', marginTop: '0.5rem'}}>Click para ver análisis de brechas</div>
            </div>

            {/* Resiliencia */}
            <div className="card kpi-card-clickable" onClick={() => setActiveModal('resiliencia')}>
              <div className="card-header">
                <span className="material-icons card-icon">shield</span>
                <h2 className="card-title">Resiliencia</h2>
              </div>
              <div className="font-bold text-sm mb-4">Top Offenders</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                {(dynamicData?.resilience.top_offenders || topOffenders).map((item: any, idx: number) => (
                  <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem'}}>
                    <div>
                      <div style={{fontWeight: 700, color: 'var(--navy)'}}>{item.sistema || (item as any).name}</div>
                      <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>Recurrencia: {item.recurrencia}%</div>
                    </div>
                    <div style={{color: '#f44336', fontWeight: 700}}>{item.fallas} fallas</div>
                  </div>
                ))}
              </div>
              <div style={{textAlign: 'center', color: '#4A4E5A', fontSize: '0.7rem', marginTop: '0.5rem'}}>Click para ver análisis RCA</div>
            </div>

            {/* Eficiencia Operativa */}
            <div className="card kpi-card-clickable" onClick={() => setActiveModal('eficiencia')}>
              <div className="card-header">
                <span className="material-icons card-icon">psychology</span>
                <h2 className="card-title">Eficiencia Operativa</h2>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{color: '#4A4E5A', fontSize: '0.85rem', marginBottom: '0.5rem'}}>Automatización Total</div>
                  <div style={{color: '#00DEBC', fontSize: '3rem', fontWeight: 700}}>{eficienciaData.porcentaje_automatizacion}%</div>
                </div>
                <div style={{borderTop: '1px solid #E2E4E8', paddingTop: '1.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                    <span style={{color: '#4A4E5A', fontSize: '0.85rem'}}>Avance del Mes</span>
                    <span style={{color: '#020B50', fontWeight: 600}}>+{eficienciaData.avance_mes}%</span>
                  </div>
                  <div className="deployment-bar" style={{width: '100%', height: '10px'}}>
                    <div className="deployment-fill" style={{width: `${(eficienciaData.avance_mes / 20) * 100}%`}}></div>
                  </div>
                </div>
                <div style={{textAlign: 'center', color: '#4A4E5A', fontSize: '0.75rem'}}>
                  Click para ver detalle
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
            © 2026 gou Payments - Dashboard de Control Operativo
          </div>
          <div style={{display: 'flex', gap: '1.5rem'}}>
            <span className="material-icons" style={{color: 'var(--gray)', cursor: 'pointer'}}>info</span>
            <span className="material-icons" style={{color: 'var(--gray)', cursor: 'pointer'}}>settings</span>
          </div>
        </div>
      </footer>

      {/* Availability Modal */}
      {activeModal === 'disponibilidad' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">Tendencia de Disponibilidad Global</h2>
            </div>
            <div className="detail-section">
              <div style={{height: '300px', width: '100%', marginTop: '1rem'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modalDisponibilidadGlobal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip cursor={{fill: 'rgba(0, 80, 246, 0.04)'}} />
                    <ReferenceLine y={99.47} stroke="#f44336" strokeDasharray="3 3" />
                    <Bar dataKey="value" fill="#00DEBC" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#333', fontSize: 12, formatter: (val: any) => `${val}%` }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.8rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div style={{width: 12, height: 12, background: '#00DEBC'}}></div> Cumple meta</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div style={{width: 12, height: 12, background: '#f44336'}}></div> No cumple meta</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div style={{width: 20, height: 2, background: '#f44336', borderStyle: 'dashed'}}></div> Meta (99.47%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incident Modal */}
      {activeModal === 'incidentes' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '1000px'}}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">Detalle de Incidentes del Mes</h2>
            </div>

            {dynamicData && (
              <>
                <div className="detail-section">
                  <h3><span className="material-icons">analytics</span> Resumen</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
                    <div style={{background: '#F4F5F7', padding: '1.5rem', borderRadius: '12px', textAlign: 'center'}}>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Total Incidentes</div>
                      <div style={{fontSize: '2rem', fontWeight: 700, color: dynamicData.summary.total > 0 ? '#f44336' : '#00DEBC'}}>
                        {dynamicData.summary.total}
                      </div>
                    </div>
                    <div style={{background: '#F4F5F7', padding: '1.5rem', borderRadius: '12px', textAlign: 'center'}}>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>MTTR Promedio</div>
                      <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--navy)'}}>
                        {dynamicData.summary.avg_recovery_formatted}
                      </div>
                    </div>
                    <div style={{background: '#F4F5F7', padding: '1.5rem', borderRadius: '12px', textAlign: 'center'}}>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Servicios Afectados</div>
                      <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--navy)'}}>
                        {dynamicData.summary.services_affected}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3><span className="material-icons">pie_chart</span> Distribución por Fuente de Falla</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '3rem', background: '#F8F9FB', padding: '2rem', borderRadius: '12px'}}>
                    <div style={{width: '200px', height: '200px'}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dynamicData.by_source} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {dynamicData.by_source.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                      {dynamicData.by_source.map((entry: any, idx: number) => (
                        <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem'}}>
                          <div style={{width: 14, height: 14, background: entry.color, borderRadius: 3}}></div>
                          <span style={{fontWeight: 600, color: 'var(--navy)', minWidth: '120px'}}>{entry.name}</span>
                          <span style={{color: 'var(--text-muted)'}}>{entry.count} incidentes ({entry.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3><span className="material-icons">list</span> Detalle de Incidentes</h3>
                  <div className="services-table-container">
                    <table className="services-table" style={{fontSize: '0.85rem'}}>
                      <thead>
                        <tr>
                          <th>Servicio</th>
                          <th>Descripción</th>
                          <th>Tiempo de Recuperación</th>
                          <th>Fuente / Fecha</th>
                          <th>Impacto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dynamicData.incidents.map((row, idx) => (
                          <tr key={idx}>
                            <td style={{fontWeight: 700, color: 'var(--navy)'}}>{row.service}</td>
                            <td>{row.description}</td>
                            <td style={{fontWeight: 700, color: row.impact === 'Crítico' ? '#DC2626' : row.impact === 'Alto' ? '#EA580C' : '#16A34A'}}>
                              {row.recovery_formatted}
                            </td>
                            <td>
                              <div style={{fontWeight: 600}}>{row.source}</div>
                              <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{row.date}</div>
                            </td>
                            <td>
                              <span className="capacity-badge" style={{
                                background: row.impact === 'Crítico' ? '#FEE2E2' : row.impact === 'Alto' ? '#FFF7ED' : '#F0FDF4',
                                color: row.impact === 'Crítico' ? '#DC2626' : row.impact === 'Alto' ? '#EA580C' : '#16A34A',
                                border: `1px solid ${row.impact === 'Crítico' ? '#FCA5A5' : row.impact === 'Alto' ? '#FED7AA' : '#BBF7D0'}`
                              }}>
                                {row.impact}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="detail-section">
                  <h3><span className="material-icons">psychology</span> Análisis y Recomendaciones</h3>
                  <div style={{
                    borderLeft: `5px solid ${dynamicData.analysis.action_required ? '#EA580C' : '#16A34A'}`,
                    background: dynamicData.analysis.action_required ? '#FFF7ED' : '#F0FDF4',
                    padding: '1.5rem',
                    borderRadius: '8px'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
                      <span className="material-icons" style={{color: dynamicData.analysis.action_required ? '#EA580C' : '#16A34A'}}>
                        {dynamicData.analysis.action_required ? 'warning' : 'check_circle'}
                      </span>
                      <span style={{fontWeight: 700, color: dynamicData.analysis.action_required ? '#EA580C' : '#16A34A'}}>
                        {dynamicData.analysis.action_required ? "Acciones Requeridas" : "Estado Estable"}
                      </span>
                    </div>
                    <div style={{fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6}}>
                      {dynamicData.analysis.message}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SLA Modal */}
      {activeModal === 'sla' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '1000px'}}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">Análisis de Desempeño SLA</h2>
            </div>
            <div className="detail-section">
              <h3>Comparativa Mensual</h3>
              <div className="services-table-container">
                <table className="services-table" style={{fontSize: '0.8rem'}}>
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
                    {slaData.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.metrica}</td>
                        <td>{row.anterior}</td>
                        <td style={{fontWeight: 700}}>{row.actual}</td>
                        <td>{row.objetivo}</td>
                        <td style={{color: row.color, fontWeight: 700}}>{row.variacion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="detail-section">
              <h3>Análisis de Brechas</h3>
              <p style={{color: '#2D3142', lineHeight: 1.6, background: '#F8F9FB', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--blue)'}}>
                El cumplimiento actual se encuentra 0,85% por debajo del objetivo contractual.
                Las principales causas identificadas son: vencimiento del plazo para una solicitud (RF), entrega oportunda de cinco informes preliminares de incidentes, uno definitivo y un entregable.
                El resultado de la medición de hardening corresponde a una propuesta hecha desde SETI.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resiliencia Modal */}
      {activeModal === 'resiliencia' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '900px'}}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">Análisis de Resiliencia</h2>
            </div>
            <div className="detail-section">
              <h3>Top Offenders - Detalle</h3>
              <div className="services-table-container">
                <table className="services-table" style={{fontSize: '0.85rem'}}>
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
                    {(dynamicData?.resilience.top_offenders || resilienciaDetalle).map((o: any, idx: number) => (
                      <tr key={idx}>
                        <td style={{fontWeight: 700}}>{o.sistema}</td>
                        <td>{o.fallas}</td>
                        <td>{o.recurrencia}%</td>
                        <td>{o.causa}</td>
                        <td>
                          <span className="capacity-badge" style={{
                            background: 'rgba(0, 80, 246, 0.05)', 
                            color: 'var(--blue)',
                            fontWeight: 700,
                            fontSize: '0.7rem'
                          }}>
                            {o.accion}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="detail-section">
              <h3>Análisis RCA (Root Cause Analysis)</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {(dynamicData?.resilience.top_offenders || []).slice(0, 3).map((o, idx) => (
                  <div key={idx} style={{
                    background: idx === 0 ? '#FFF5F5' : '#F0F9FF', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    borderLeft: `4px solid ${idx === 0 ? '#f44336' : 'var(--blue)'}`
                  }}>
                    <strong style={{color: idx === 0 ? '#8b0000' : 'var(--navy)', display: 'block', marginBottom: '0.5rem'}}>
                      {o.sistema}: {o.description}
                    </strong>
                    <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                      <strong>Solución Aplicada:</strong> {o.accion === "OPTIMIZACIÓN QUERIES" ? "Se procedió con la creación de índices compuestos y revisión de planes de ejecución." : 
                      o.accion === "REFACTORIZAR CÓDIGO DE API" ? "Optimización de middlewares y reducción de llamadas redundantes a microservicios." :
                      o.accion === "ESCALAMIENTO DE RECURSOS" ? "Ajuste de límites de CPU/RAM en el clúster de Kubernetes." :
                      "Implementación de medidas preventivas y monitoreo avanzado."}
                    </div>
                  </div>
                ))}
                {(!dynamicData || dynamicData.resilience.top_offenders.length === 0) && (
                   <p>No hay datos dinámicos de resiliencia disponibles. Por favor carga un Excel válido.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alertamiento Modal */}
      {activeModal === 'alertamiento' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">Detalle de Gestión de Eventos</h2>
            </div>
            <div className="detail-section">
              <h3>Histórico de Alertas</h3>
              <p>Se han procesado un total de 13,643 alertas en el periodo actual, con un tiempo promedio de resolución de 4.2 minutos.</p>
              <div style={{height: '250px', width: '100%', marginTop: '1.5rem'}}>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventData.alertas_por_servicio}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="servicio" tick={false} />
                       <YAxis />
                       <Tooltip />
                       <Bar dataKey="alertas" fill="#0050F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
            <div className="detail-section">
              <h3>Análisis Operativo</h3>
              <div style={{background: '#F8F9FB', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #00DEBC'}}>
                La mayoría de las alertas se concentran en el recurso de CPU y SQL Queries. 
                Se recomienda la optimización de los índices en las bases de datos de los servicios de MDRBBDPR.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eficiencia Modal */}
      {activeModal === 'eficiencia' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '900px'}}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">Detalle de Eficiencia Operativa</h2>
            </div>
            <div className="detail-section">
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
                <div style={{background: '#F4F5F7', padding: '1.5rem', borderRadius: '12px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Automatización Total</div>
                  <div style={{fontSize: '2rem', fontWeight: 700, color: '#00DEBC'}}>{eficienciaData.porcentaje_automatizacion}%</div>
                </div>
                <div style={{background: '#F4F5F7', padding: '1.5rem', borderRadius: '12px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Avance del Mes</div>
                  <div style={{fontSize: '2rem', fontWeight: 700, color: '#0050F6'}}>+{eficienciaData.avance_mes}%</div>
                </div>
                <div style={{background: '#F4F5F7', padding: '1.5rem', borderRadius: '12px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Horas Ahorradas</div>
                  <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--navy)'}}>{eficienciaData.horas_ahorradas}h</div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Automatizaciones Implementadas</h3>
              <div className="services-table-container">
                <table className="services-table" style={{fontSize: '0.85rem'}}>
                  <thead>
                    <tr>
                      <th>Automatización</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th>Ahorro</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {automatizaciones.map((auto, idx) => (
                      <tr key={idx}>
                        <td><strong>{auto.nombre}</strong></td>
                        <td style={{fontSize: '0.75rem'}}>{auto.descripcion}</td>
                        <td>{auto.fecha_implementacion}</td>
                        <td style={{color: '#16A34A', fontWeight: 700}}>{auto.ahorro_horas}h</td>
                        <td>
                          <span className="capacity-badge" style={{
                            background: auto.estado === 'Activo' ? '#F0FDF4' : '#FFF7ED',
                            color: auto.estado === 'Activo' ? '#16A34A' : '#EA580C'
                          }}>
                            {auto.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="detail-section">
              <h3>Impacto y Beneficios</h3>
              <div style={{background: 'rgba(0, 222, 188, 0.1)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #00DEBC'}}>
                <p style={{color: '#2D3142', lineHeight: 1.6, marginBottom: '1rem'}}>
                  Las automatizaciones implementadas han generado un ahorro total de <strong style={{color: '#00DEBC'}}>{eficienciaData.horas_ahorradas} horas/mes</strong>, 
                  equivalente a <strong>{(eficienciaData.horas_ahorradas / 160).toFixed(1)} FTEs</strong>.
                </p>
                <p style={{color: '#2D3142', lineHeight: 1.6}}>
                  El nivel de automatización actual del <strong style={{color: '#00DEBC'}}>{eficienciaData.porcentaje_automatizacion}%</strong> 
                  ha permitido reducir el MTTR en un {eficienciaData.mttr_reduccion} y resolver automáticamente 
                  {eficienciaData.incidentes_auto_resueltos} incidentes este mes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {activeModal === 'service' && selectedService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2 className="modal-title">Detalle: {selectedService.name}</h2>
            </div>

            <div className="detail-section">
              <h3><span className="material-icons">analytics</span> Métricas Actuales</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
                <div style={{background: '#F4F5F7', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Disponibilidad</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 700, color: selectedService.availability < 99 ? '#f44336' : '#00DEBC'}}>
                    {selectedService.availability_formatted}
                  </div>
                </div>
                <div style={{background: '#F4F5F7', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Incidentes</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)'}}>{selectedService.incident_count}</div>
                </div>
                <div style={{background: '#F4F5F7', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Despliegues</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue)'}}>{selectedService.deployments.rate_formatted}</div>
                </div>
                <div style={{background: '#F4F5F7', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Alertas</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 700, color: selectedService.capacity.status === 'critical' ? '#f44336' : '#01ADEF'}}>
                    {selectedService.capacity.alerts}
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3><span className="material-icons">show_chart</span> Tendencia de Disponibilidad</h3>
              <div style={{height: '200px', width: '100%', background: '#F8F9FB', borderRadius: '8px', padding: '1rem'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedService.trend_data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E4E8" />
                    <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Line type="monotone" dataKey="availability" stroke="var(--blue)" strokeWidth={3} dot={{r: 4, fill: 'var(--blue)'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="detail-section">
              <h3><span className="material-icons">speed</span> Análisis de Capacidad</h3>
              <div style={{
                borderLeft: `4px solid ${selectedService.capacity.status === 'critical' ? '#f44336' : '#01ADEF'}`,
                background: selectedService.capacity.status === 'critical' ? '#FFF5F5' : '#F0F9FF',
                padding: '1.5rem',
                borderRadius: '8px'
              }}>
                <div style={{fontWeight: 700, color: selectedService.capacity.status === 'critical' ? '#f44336' : '#0170B8', marginBottom: '0.5rem'}}>
                  {selectedService.capacity.message}
                </div>
                <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                  <strong>Recomendación:</strong> {selectedService.capacity.recommendation}
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3><span className="material-icons">history</span> Historial de Despliegues</h3>
              <table className="services-table" style={{fontSize: '0.85rem'}}>
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
                    <td>{selectedService.deployments.total}</td>
                    <td style={{color: '#00DEBC', fontWeight: 700}}>{selectedService.deployments.success}</td>
                    <td style={{color: '#f44336', fontWeight: 700}}>{selectedService.deployments.failed}</td>
                    <td>{selectedService.deployments.rate_formatted}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="detail-section">
              <h3><span className="material-icons">psychology</span> Análisis de Incidentes</h3>
              <div style={{background: '#F8F9FB', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
                  <span className="material-icons" style={{color: selectedService.incident_count >= 5 ? '#f44336' : '#00DEBC'}}>
                    {selectedService.incident_count >= 5 ? 'report_problem' : 'verified_user'}
                  </span>
                  <span style={{fontWeight: 700, color: 'var(--navy)'}}>
                    {selectedService.incident_count >= 5 ? 'Alerta de Estabilidad' : 'Operación Estable'}
                  </span>
                </div>
                <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5}}>
                  Se han registrado {selectedService.incident_count} incidentes en el mes actual. 
                  {selectedService.incident_count >= 5 
                    ? ' Se requiere revisión inmediata de los logs y escalamiento de recursos.' 
                    : ' El servicio se mantiene dentro de los parámetros de operación normal.'}
                </p>
                <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Causa principal identificada:</span>
                  <span className="capacity-badge" style={{background: 'var(--blue)15', color: 'var(--blue)'}}>{selectedService.main_source}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
