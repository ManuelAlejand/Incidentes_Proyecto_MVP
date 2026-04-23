import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  ClipboardCheck,
  TrendingUp,
  X,
  TriangleAlert,
  Activity,
  Server,
  Database
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  topMetrics, 
  serviciosNegocio, 
  slaDesempeno, 
  topOffenders,
  modalDisponibilidadGlobal,
  modalIncidentesCriticos,
  modalAppMovil
} from './data';
import { useDataStore } from './store/dataStore';
import { UploadZone } from './components/UploadZone';
import { parseIncidentsFrontend } from './services/incidentParser';
import './index.css';

function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { 
    hasData, 
    projectsByMonth, 
    parsedExcelRawData, 
    projectNames, 
    activeProjectName, 
    setActiveProjectName, 
    resetData 
  } = useDataStore();

  const resetDashboard = () => {
    resetData();
  };

  const dynamicIncidents = parsedExcelRawData && parsedExcelRawData.length > 0 
      ? parseIncidentsFrontend(parsedExcelRawData, activeProjectName || undefined) 
      : null;

  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setActiveModal(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setActiveModal(null)}><X size={24} /></button>
          
          {activeModal === 'disponibilidad' && (
            <div>
              <div className="modal-title">Tendencia de Disponibilidad Global</div>
              <div className="font-bold mb-4">Últimos 6 Meses</div>
              <div className="chart-container-md">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modalDisponibilidadGlobal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                    <ReferenceLine y={99.47} stroke="#ef4444" strokeDasharray="3 3" />
                    <Bar dataKey="value" fill="#05b682" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#333', fontSize: 12, formatter: (val: any) => `${val}%` }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2"><div style={{width: 12, height: 12, background: '#05b682'}}></div> Cumple meta</div>
                <div className="flex items-center gap-2"><div style={{width: 12, height: 12, background: '#ef4444'}}></div> No cumple meta</div>
                <div className="flex items-center gap-2"><div style={{width: 20, height: 2, background: '#ef4444', borderStyle: 'dashed'}}></div> Meta (99.47%)</div>
              </div>
            </div>
          )}

          {activeModal === 'incidentes' && (
            <div>
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <div className="modal-title" style={{marginBottom: 0}}>Incidentes Críticos del Mes</div>
                {projectNames.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted uppercase">Proyecto:</span>
                    <select 
                      className="text-xs p-1 border rounded font-bold bg-white"
                      value={activeProjectName || ''}
                      onChange={(e) => setActiveProjectName(e.target.value)}
                    >
                      {projectNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="font-bold mb-4">Resumen de Incidentes</div>
              <div className="flex gap-4 mb-8">
                <div className="metric-card flex-col items-center justify-center flex" style={{flex: 1, padding: '1rem'}}>
                   <div className="text-xs text-muted font-bold uppercase mb-2">Total Incidentes</div>
                   <div className={`text-3xl font-bold ${dynamicIncidents && dynamicIncidents.summary.total > 0 ? 'text-danger' : 'text-success'}`}>
                     {dynamicIncidents ? dynamicIncidents.summary.total : modalIncidentesCriticos.resumen.total}
                   </div>
                </div>
                <div className="metric-card flex-col items-center justify-center flex" style={{flex: 1, padding: '1rem'}}>
                   <div className="text-xs text-muted font-bold uppercase mb-2">Tiempo Prom. Recuperación</div>
                   <div className="text-xl font-bold">{dynamicIncidents ? dynamicIncidents.summary.avg_recovery_formatted : modalIncidentesCriticos.resumen.recoveryTime}</div>
                </div>
                <div className="metric-card flex-col items-center justify-center flex" style={{flex: 1, padding: '1rem'}}>
                   <div className="text-xs text-muted font-bold uppercase mb-2">Servicios Afectados</div>
                   <div className="text-3xl font-bold">{dynamicIncidents ? dynamicIncidents.summary.services_affected : modalIncidentesCriticos.resumen.affected}</div>
                </div>
              </div>

              <div className="font-bold mb-4">Incidentes por Fuente de Falla</div>
              {dynamicIncidents && dynamicIncidents.by_source.length === 0 ? (
                <div className="text-muted p-4 bg-gray-50 rounded mb-8">Sin incidentes registrados</div>
              ) : (
                <div className="flex items-center mb-8">
                  <div style={{width: '200px', height: '200px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dynamicIncidents ? dynamicIncidents.by_source : modalIncidentesCriticos.pieData} innerRadius={0} outerRadius={80} paddingAngle={2} dataKey="value">
                          {(dynamicIncidents ? dynamicIncidents.by_source : modalIncidentesCriticos.pieData).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2">
                     {(dynamicIncidents ? dynamicIncidents.by_source : modalIncidentesCriticos.pieData as any).map((entry: any, idx: number) => (
                       <div key={idx} className="flex items-center gap-2 text-sm">
                         <div style={{width: 14, height: 14, background: entry.color, borderRadius: 2}}></div>
                         <b>{entry.name}</b>
                         <span>{entry.count || 1} Incidente(s) ({entry.percentage || '33.3'}%)</span>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              <div className="font-bold mb-4">Detalle de Incidentes</div>
              <table className="services-table text-xs">
                <thead><tr><th>Servicio</th><th>Descripción</th><th>Tiempo de Recuperación</th><th>Fuente de la Falla</th><th>Impacto</th></tr></thead>
                <tbody>
                  {dynamicIncidents ? dynamicIncidents.incidents.map((row, idx) => (
                    <tr key={idx}>
                      <td className="font-bold">{row.service}</td>
                      <td>{row.description}</td>
                      <td className={row.impact_color === 'green' ? 'font-bold' : 'text-danger font-bold'}>{row.recovery_formatted}</td>
                      <td>
                        <div className="font-bold">{row.source}</div>
                        <div className="text-xs text-muted">{row.date}</div>
                      </td>
                      <td>
                        <span style={{
                            padding: '4px 8px', borderRadius: 4, fontWeight: 'bold',
                            background: row.impact_color === 'red' ? '#fee2e2' : row.impact_color === 'orange' ? '#fff7ed' : '#f0fdf4', 
                            color: row.impact_color === 'red' ? '#dc2626' : row.impact_color === 'orange' ? '#ea580c' : '#16a34a',
                            border: `1px solid ${row.impact_color === 'red' ? '#dc2626' : row.impact_color === 'orange' ? '#ea580c' : '#16a34a'}`
                        }}>
                          {row.impact}
                        </span>
                      </td>
                    </tr>
                  )) : modalIncidentesCriticos.detalle.map((row, idx) => (
                    <tr key={idx}>
                      <td className="font-bold">{row.servicio}</td>
                      <td>{row.desc}</td>
                      <td className="text-danger font-bold">{row.recovery}</td>
                      <td>
                        <div className="font-bold">{row.root.split("-")[0]}</div>
                        <div className="text-muted">{row.root.split("-")[1]}</div>
                        <div className="text-xs text-muted">{row.date}</div>
                      </td>
                      <td>
                        <span style={{padding: '4px 8px', borderRadius: 4, background: '#fffbeb', color: row.impacto === 'Crítico' ? '#ef4444' : '#b45309'}} className="font-bold">
                          {row.impacto}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 font-bold text-lg border-b pb-2">Análisis y Acciones</div>
              {dynamicIncidents ? (
                <div style={{
                  borderLeft: `4px solid ${dynamicIncidents.analysis.action_required ? '#ea580c' : '#16a34a'}`, 
                  marginTop: '1rem', 
                  background: dynamicIncidents.analysis.action_required ? '#fff7ed' : '#f0fdf4', 
                  padding: '1rem', 
                  borderRadius: 4
                }}>
                  <div className="flex items-center gap-2 font-bold mb-2" style={{color: dynamicIncidents.analysis.action_required ? '#ea580c' : '#16a34a'}}>
                    {dynamicIncidents.analysis.action_required ? <AlertCircle size={18}/> : <CheckCircle size={18} />} 
                    {dynamicIncidents.analysis.action_required ? "Acciones Requeridas" : "Sin acciones requeridas"}
                  </div>
                  <div className="text-sm">{dynamicIncidents.analysis.message}</div>
                </div>
              ) : (
                <div style={{borderLeft: '4px solid #ef4444', paddingLeft: '1rem', marginTop: '1rem', background: '#ffe4e6', padding: '1rem', borderRadius: 4}}>
                  <div className="flex items-center gap-2 font-bold text-danger"><AlertCircle size={18}/> Acciones Requeridas</div>
                </div>
              )}
            </div>
          )}

          {activeModal === 'service' && (
            <div>
              <div className="modal-title">Detalle: App Móvil</div>
              
              <div className="font-bold mb-4">Métricas Actuales</div>
              <div className="flex gap-4 mb-8">
                <div className="metric-card flex-col items-center justify-center flex" style={{flex: 1, padding: '1rem'}}>
                   <div className="text-xs text-muted font-bold uppercase mb-2">Disponibilidad</div>
                   <div className="text-3xl font-bold text-danger">98.5%</div>
                </div>
                <div className="metric-card flex-col items-center justify-center flex" style={{flex: 1, padding: '1rem'}}>
                   <div className="text-xs text-muted font-bold uppercase mb-2">Incidentes</div>
                   <div className="text-3xl font-bold">8</div>
                </div>
                <div className="metric-card flex-col items-center justify-center flex" style={{flex: 1, padding: '1rem'}}>
                   <div className="text-xs text-muted font-bold uppercase mb-2">Tasa de Éxito Despliegues</div>
                   <div className="text-3xl font-bold text-warning">83%</div>
                </div>
                <div className="metric-card flex-col items-center justify-center flex" style={{flex: 1, padding: '1rem'}}>
                   <div className="text-xs text-muted font-bold uppercase mb-2">Alertas de Capacidad</div>
                   <div className="text-3xl font-bold text-danger" style={{background: '#fee2e2', padding: '4px 16px', borderRadius: 16}}>3</div>
                </div>
              </div>

              <div className="font-bold mb-4">Tendencia de Disponibilidad - Últimos 6 Meses</div>
              <div className="chart-container-md mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={modalAppMovil.disponibilidadTendencia} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#7f1d1d" strokeWidth={2} dot={{fill: '#7f1d1d', r: 4}} label={{position: 'top', fontSize: 10}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="font-bold mb-4">Alertas de Capacidad</div>
              <div style={{borderLeft: '4px solid #f59e0b', background: '#fffbeb', padding: '1.5rem', borderRadius: 4, marginBottom: '2rem'}}>
                <div className="flex items-center gap-2 font-bold text-warning mb-2"><TriangleAlert size={18}/> 3 Alertas Activas</div>
                <div className="mb-4 text-sm font-bold">Memoria 92%, CPU 88%, Conexiones DB 95%</div>
                <div className="text-xs text-muted"><b>Recomendación:</b> Acción inmediata requerida. Escalar recursos o implementar optimizaciones urgentes.</div>
              </div>

              <div className="font-bold mb-4">Historial de Despliegues</div>
              <table className="services-table text-sm mb-8">
                <thead><tr><th>Periodo</th><th>Total</th><th>Exitosos</th><th>Fallidos</th><th>Tasa de Éxito</th></tr></thead>
                <tbody>
                  <tr>
                    <td>{modalAppMovil.despliegues.periodo}</td>
                    <td>{modalAppMovil.despliegues.total}</td>
                    <td className="text-success">{modalAppMovil.despliegues.exitosos}</td>
                    <td className="text-danger">{modalAppMovil.despliegues.fallidos}</td>
                    <td>{modalAppMovil.despliegues.tasa}</td>
                  </tr>
                </tbody>
              </table>

              <div className="font-bold mb-4">Análisis de Incidentes</div>
              <div className="text-sm bg-gray-50 p-4 rounded text-muted">
                <b className="text-danger">Alerta:</b> Se han registrado 8 incidentes en el mes actual, superando el umbral aceptable.<br/>
                Causa principal identificada: Latencia en DB.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="header justify-between">
        <div className="flex items-center gap-4">
           <div className="logo cursor-pointer" onClick={resetDashboard}>goo</div>
           <h1>Informe del Servicio Febrero 2026</h1>
        </div>
        {hasData && (
          <div className="flex gap-4">
             <div className="text-sm border border-white p-1 px-3 rounded-full">Archivo Cargado (Session)</div>
             <button onClick={resetDashboard} style={{ background: 'transparent', border: 'none', color: 'currentcolor', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}>Limpiar</button>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="mb-8">
           <UploadZone />
        </div>
        
        {hasData && parsedExcelRawData && parsedExcelRawData.length > 0 && (
          <div className="metric-card" style={{ marginBottom: '2rem', overflowX: 'auto' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-header-bg)', fontWeight: 'bold' }}>Datos extraídos del Excel (Pre-validación en Frontend)</h2>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  {Object.keys(parsedExcelRawData[0]).map((key) => (
                    <th key={key} style={{ padding: '0.5rem', borderBottom: '2px solid var(--color-border)' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedExcelRawData.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val: any, j) => (
                       <td key={j} style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedExcelRawData.length > 10 && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Mostrando los primeros 10 registros de {parsedExcelRawData.length} totales...</p>}
          </div>
        )}

        <div className="dashboard-metrics-row">
          <div className="metric-card" onClick={() => setActiveModal('disponibilidad')}>
            <div className="card-header"><CheckCircle className="card-icon text-success" /> Disponibilidad Global</div>
            <div className="card-value text-success">{topMetrics.disponibilidad.value}</div>
            <div className="card-subtitle">{topMetrics.disponibilidad.meta}</div>
            <div className="card-footer-link">Click para ver detalle</div>
          </div>
          
          <div className="metric-card" onClick={() => setActiveModal('incidentes')} style={{cursor:'pointer'}}>
            <div className="card-header"><AlertCircle className="card-icon text-header-bg" /> Incidentes</div>
            <div className="flex justify-center gap-8 card-value" style={{fontSize: '1.5rem'}}>
              <div className="flex-col">
                 <div className="text-xs text-danger uppercase block mb-1">Totales</div>
                 <span className={dynamicIncidents && dynamicIncidents.summary.total === 0 ? "text-success" : "text-danger"}>
                   {dynamicIncidents ? dynamicIncidents.summary.total : topMetrics.incidentes.totales}
                 </span>
              </div>
              <div className="flex-col"><div className="text-xs text-info uppercase block mb-1">Seti</div><span className="text-info">{topMetrics.incidentes.seti}</span></div>
            </div>
            <div className="card-footer-link">Click para ver detalle</div>
          </div>
          
          <div className="metric-card">
            <div className="card-header"><Clock className="card-icon" /> Tiempos de Respuesta</div>
            <div className="flex justify-center gap-8 card-value" style={{fontSize: '1.5rem'}}>
              <div className="flex-col"><div className="text-xs text-success uppercase block mb-1">MTTR</div><span className="text-success">{topMetrics.tiempos.mttr}</span></div>
              <div className="flex-col"><div className="text-xs text-info uppercase block mb-1">MTBF</div><span className="text-info">{topMetrics.tiempos.mtbf}</span></div>
            </div>
            <div className="card-subtitle" style={{marginTop: '0.25rem'}}>Mean Time To Repair / Between Failures</div>
          </div>
          
          <div className="metric-card">
            <div className="card-header"><ShieldCheck className="card-icon" /> Cumplimiento de Vulnerabilidades</div>
            <div className="card-value text-success">{topMetrics.vulnerabilidades.value}</div>
            <div className="card-subtitle">{topMetrics.vulnerabilidades.desc}</div>
          </div>
          
          <div className="metric-card">
            <div className="card-header"><ClipboardCheck className="card-icon" /> Cumplimiento de Compromisos</div>
            <div className="card-value text-success">{topMetrics.compromisos.value}</div>
            <div className="card-footer-link">Click para ver detalle</div>
          </div>
        </div>

        <div className="dashboard-main-grid">
          <div className="section-card">
            <div className="section-title"><Server size={20} /> Servicios de Negocio</div>
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
                {(hasData ? (projectsByMonth["2026-02"] || []) : serviciosNegocio).map((s: any) => (
                  <tr key={s.id} onClick={() => s.servicio === "App Móvil" ? setActiveModal('service') : null}>
                    <td className="font-bold">{s.servicio}</td>
                    <td className={s.disponibilidad < 99 ? "text-danger flex gap-2 items-center" : "text-success flex gap-2 items-center"}>
                      <div style={{width: 12, height: 12, borderRadius: 6, background: s.disponibilidad < 99 ? 'var(--color-danger)' : 'var(--color-success)'}}></div>
                      {s.disponibilidad}%
                    </td>
                    <td className="font-bold"><TriangleAlert size={14} style={{display:'inline', marginBottom: '-2px'}}/> {s.incidentes}</td>
                    <td>
                      <div className="text-sm font-bold">{s.despliegues.current}/{s.despliegues.max}</div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{width: `${(s.despliegues.current/s.despliegues.max)*100}%`, background: s.despliegues.current < s.despliegues.max ? 'var(--color-info)' : 'var(--color-success)'}}></div>
                      </div>
                    </td>
                    <td className="font-bold flex items-center gap-1">
                      {s.capacidad > 0 ? (
                        <>
                           {s.capacidad > 2 ? <AlertCircle size={14} className="text-danger"/> : <CheckCircle size={14} className="text-info"/>} 
                           <span className={s.capacidad > 2 ? 'text-danger' : 'text-info'}>{s.capacidad}</span>
                        </>
                      ) : (
                         <><CheckCircle size={14} className="text-success"/> <span className="text-success">0</span></>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-col gap-4">
             <div className="section-card mb-4" style={{padding: '1.5rem 1rem'}}>
               <div className="section-title ml-2"><TrendingUp size={20} /> Desempeño (SLA)</div>
               <div className="flex justify-around items-end" style={{height: '150px', marginTop: '2rem'}}>
                  {slaDesempeno.map((item, idx) => (
                    <div key={idx} className="flex-col items-center flex gap-2" style={{width: '30%'}}>
                       <div className="text-xs font-bold">{item.value}%</div>
                       <div style={{ 
                         width: '100%', 
                         height: `${item.value}%`, 
                         background: idx === 2 ? 'linear-gradient(to bottom, #0ea5e9, #10b981)' : 'linear-gradient(to bottom, #3b82f6, #0ea5e9)',
                         borderRadius: '4px 4px 0 0',
                         minHeight: '100px'
                       }}></div>
                       <div className="text-xs text-muted">{item.name}</div>
                    </div>
                  ))}
               </div>
             </div>

             <div className="section-card">
               <div className="section-title"><ShieldCheck size={20} /> Resiliencia</div>
               <div className="font-bold text-sm mb-4">Top Offenders</div>
               <div className="flex flex-col gap-4">
                 {topOffenders.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center text-sm">
                     <div>
                       <div className="font-bold">{item.name}</div>
                       <div className="text-xs text-muted">Recurrencia: {item.recurrencia}</div>
                     </div>
                     <div className="text-danger font-bold">{item.fallas} fallas</div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </main>
      
      {renderModal()}
    </div>
  );
}

export default App;
