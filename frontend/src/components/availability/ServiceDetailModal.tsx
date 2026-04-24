import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { AvailabilityPieChart } from '../shared/AvailabilityPieChart';
import type { BusinessService } from '../../types/availability';

interface ServiceDetailModalProps {
  service: BusinessService;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  const componentTypes = service.by_type ? Object.keys(service.by_type) : [];
  const [activeType, setActiveType] = useState(componentTypes[0] || '');

  const activeData = useMemo(() => {
    return (service.by_type && activeType) ? service.by_type[activeType] : null;
  }, [service, activeType]);

  // Disponibilidad a mostrar en la card de detalle según tipo activo
  const detailAvailability = activeData?.avg_availability ?? service.availability;
  const detailMeta = service.meta || 99.5;
  const detailColor = detailAvailability >= detailMeta ? 'var(--teal)' : '#f44336';

  // Construir datos de tendencia para el tipo activo (o del servicio si no hay tipo)
  // Primero usamos los datos del trend global del servicio como base
  const trendData = useMemo(() => {
    if (!service.trend || service.trend.length === 0) return [];
    // Si hay un tipo activo y tiene componentes con datos, mostramos la disponibilidad real del tipo
    // como línea horizontal sobre la base de la tendencia del servicio
    if (activeData) {
      return service.trend.map(point => ({
        ...point,
        // Ajustamos el valor con la diferencia entre disponibilidad del tipo y del servicio
        availability: Number((point.availability + (activeData.avg_availability - service.availability)).toFixed(2))
      }));
    }
    return service.trend;
  }, [service.trend, service.availability, activeData]);

  if (!service) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px', padding: '2rem' }}>
        <button className="modal-close-btn" onClick={onClose} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem' }}>{service.name}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Detalle de Servicio de Negocio</p>
        </div>

        {/* Section: Métricas Actuales (Top Cards) */}
        <div className="detail-section">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1.5rem' }}>Métricas Actuales</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Disponibilidad Global</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: service.availability >= (service.meta || 99.5) ? 'var(--teal)' : '#f44336' }}>
                {service.availability.toFixed(2)}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Meta: {service.meta || 99.5}%</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Incidentes</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--navy)' }}>{service.incident_count ?? 0}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Mes Actual</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tasa de Éxito Despliegues</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f59e0b' }}>
                {service.deployments?.success_rate ?? 0}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                {service.deployments?.successful ?? 0}/{service.deployments?.total ?? 0} Exitosos
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Alertas de Capacidad</div>
              <div style={{ 
                width: '40px', height: '40px', background: '#fee2e2', color: '#ef4444', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto', fontSize: '1.2rem', fontWeight: 700 
              }}>
                {service.capacity_alerts?.count ?? 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Recursos Críticos</div>
            </div>
          </div>
        </div>

        {/* Section: Disponibilidad por Tipo de Componente */}
        <AvailabilityPieChart 
          data={Object.entries(service.by_type || {}).map(([type, data]) => ({
            type: type,
            avg: data.avg_availability,
            meetsTarget: data.avg_availability >= detailMeta
          }))}
        />

        {/* Section: Tendencia de Disponibilidad */}
        <div className="detail-section">
          {/* Type selector + Detalle card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>
              Tendencia de Disponibilidad - {activeType || 'General'}
            </h3>
            
            {/* Technical Tabs */}
            {componentTypes.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {componentTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: activeType === type ? 'var(--blue)' : '#F3F4F6',
                      color: activeType === type ? 'white' : 'var(--text-muted)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalle: disponibilidad del tipo seleccionado */}
          {activeData && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1.5rem',
              background: '#F8F9FB', borderRadius: '10px', padding: '0.75rem 1.25rem',
              marginBottom: '1rem', border: `1px solid ${detailColor}30`
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detalle: {activeType}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: detailColor }}>{detailAvailability.toFixed(2)}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Componentes</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {activeData.components.map((comp, i) => (
                    <span key={i} style={{
                      fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '99px',
                      background: comp.availability >= detailMeta ? '#dcfce7' : '#fee2e2',
                      color: comp.availability >= detailMeta ? '#16A34A' : '#DC2626',
                      fontWeight: 600
                    }}>
                      {comp.name}: {comp.availability.toFixed(1)}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ height: '280px', background: '#fff', borderRadius: '12px', padding: '1rem' }}>
            {trendData.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Sin datos de tendencia histórica</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }} />
                  <YAxis
                    domain={[
                      (dataMin: number) => Math.min(dataMin - 1, detailMeta - 1),
                      (dataMax: number) => Math.max(dataMax + 0.5, detailMeta + 0.5)
                    ]}
                    axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }}
                    tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                  />
                  <Tooltip formatter={(v: any) => [`${Number(v).toFixed(2)}%`, 'Disponibilidad']} />
                  <ReferenceLine y={detailMeta} stroke="#DC2626" strokeDasharray="4 4"
                    label={{ position: 'right', value: `Meta ${detailMeta}%`, fill: '#DC2626', fontSize: 10 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="availability" 
                    stroke={detailColor}
                    strokeWidth={3} 
                    dot={{ r: 4, fill: detailColor }}
                    label={{ position: 'top', fontSize: 10, fill: '#999', formatter: (v: any) => `${Number(v).toFixed(1)}%` }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Section: Alertas de Capacidad (Yellow Box) */}
        <div className="detail-section" style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem' }}>Alertas de Capacidad</h3>
          <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D97706', fontWeight: 700, marginBottom: '0.5rem' }}>
              <span className="material-icons">warning</span>
              {service.capacity_alerts?.count ?? 0} Alertas Activas
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#92400E', marginBottom: '0.5rem' }}>
              {(service.capacity_alerts?.items || []).join(', ')}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#92400E', opacity: 0.8 }}>
              <strong>Recomendación:</strong> {service.capacity_alerts?.recommendation ?? 'No hay recomendaciones adicionales.'}
            </div>
          </div>
        </div>

        {/* Section: Historial de Despliegues (Table) */}
        <div className="detail-section" style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem' }}>Historial de Despliegues</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '1rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Periodo</th>
                <th style={{ textAlign: 'center', padding: '1rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</th>
                <th style={{ textAlign: 'center', padding: '1rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exitosos</th>
                <th style={{ textAlign: 'center', padding: '1rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fallidos</th>
                <th style={{ textAlign: 'center', padding: '1rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tasa de Éxito</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1.5rem 0.5rem', fontWeight: 600 }}>Mes Actual</td>
                <td style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>{service.deployments?.total ?? 0}</td>
                <td style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: '#10B981', fontWeight: 600 }}>{service.deployments?.successful ?? 0}</td>
                <td style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: '#EF4444', fontWeight: 600 }}>
                  {(service.deployments?.total ?? 0) - (service.deployments?.successful ?? 0)}
                </td>
                <td style={{ textAlign: 'center', padding: '1.5rem 0.5rem', fontWeight: 600 }}>{service.deployments?.success_rate ?? 0}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section: Análisis de Incidentes */}
        <div className="detail-section" style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem' }}>Análisis de Incidentes</h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <span style={{ color: '#EF4444', fontWeight: 700 }}>Alerta: </span>
            {service.incident_analysis?.message ?? `Análisis basado en ${service.incident_count ?? 0} incidentes registrados.`}
            {service.incident_analysis?.main_cause && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Causa principal identificada:</strong> {service.incident_analysis.main_cause}.
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .kpi-mini-card {
          background: #F8F9FB;
          padding: 1.2rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #F1F3F5;
        }
        .kpi-mini-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .kpi-mini-value {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 0.2rem;
        }
        .kpi-mini-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
