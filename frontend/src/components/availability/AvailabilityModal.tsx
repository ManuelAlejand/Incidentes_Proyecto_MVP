import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';
import type { GlobalAvailability } from '../../types/availability';

interface AvailabilityModalProps {
  data: GlobalAvailability;
  onClose: () => void;
}

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ data, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="material-icons" style={{ color: 'var(--navy)', fontSize: '2rem' }}>analytics</span>
            <h2 className="modal-title">Detalle de Disponibilidad Global</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            {/* Left: Summary Metrics */}
            <div className="modal-sidebar">
              <div className="metric-box">
                <div className="metric-label">Disponibilidad Actual</div>
                <div className="metric-value" style={{ color: data.meets_target ? '#16A34A' : '#DC2626' }}>
                  {data.percentage}%
                </div>
                <div className="metric-sub">Meta del Proyecto: {data.meta}%</div>
              </div>

              <div className="metric-box" style={{ marginTop: '1.5rem' }}>
                <div className="metric-label">Variación vs Meta</div>
                <div className="metric-value" style={{ color: data.delta >= 0 ? '#16A34A' : '#DC2626', fontSize: '1.8rem' }}>
                  {data.delta >= 0 ? `+${data.delta}` : data.delta}%
                </div>
                <div className="metric-sub">Puntos porcentuales</div>
              </div>
            </div>

            {/* Right: Breakdown by Type */}
            <div className="modal-main">
              <h3 className="section-title">Disponibilidad por Tipo de Componente</h3>
              <div style={{ height: '350px', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.by_type}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="type" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      domain={[90, 100]} 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ 
                        borderRadius: 'var(--radius-md)', 
                        border: 'none', 
                        boxShadow: 'var(--shadow-lg)' 
                      }}
                    />
                    <ReferenceLine y={data.meta} stroke="#DC2626" strokeDasharray="3 3" label={{ position: 'right', value: `Meta ${data.meta}%`, fill: '#DC2626', fontSize: 10 }} />
                    <Bar dataKey="avg" radius={[4, 4, 0, 0]} barSize={50}>
                      {data.by_type.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.avg >= data.meta ? '#16A34A' : '#DC2626'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
