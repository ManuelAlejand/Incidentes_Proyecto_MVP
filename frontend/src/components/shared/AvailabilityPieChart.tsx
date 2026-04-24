import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer 
} from 'recharts';
import { getPieColor } from '../../config/chartColors';

interface AvailabilityPieChartProps {
  data: {
    type: string;
    avg: number;
    meetsTarget: boolean;
  }[];
  height?: number;
  title?: string;
}

export const AvailabilityPieChart: React.FC<AvailabilityPieChartProps> = ({
  data,
  height = 220,
  title = 'Disponibilidad por Tipo de Componente'
}) => {
  // Guard clause: Si no hay datos o hay solo uno, no tiene sentido el gráfico de torta
  if (!data || data.length <= 1) return null;

  const pieData = data.map((item, i) => ({
    name: item.type,
    value: item.avg,
    displayValue: `${item.avg.toFixed(2)}%`,
    color: getPieColor(i),
    meetsTarget: item.meetsTarget,
  }));

  return (
    <div className="detail-section" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1.5rem' }}>
        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem', fontSize: '1.2rem' }}>pie_chart</span>
        {title}
      </h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '3rem', 
        background: '#F8F9FB', 
        padding: '1.5rem 2rem', 
        borderRadius: '12px' 
      }}>
        <div style={{ width: height, height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={pieData} 
                innerRadius={height * 0.3} 
                outerRadius={height * 0.4} 
                paddingAngle={5} 
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}% de disponibilidad promedio`, name]}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          {pieData.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ width: 14, height: 14, background: entry.color, borderRadius: 3 }}></div>
              <span style={{ fontWeight: 600, color: 'var(--navy)', flex: 1 }}>{entry.name}</span>
              <span style={{ 
                fontWeight: 700, 
                color: entry.meetsTarget ? '#16A34A' : '#DC2626',
                minWidth: '60px',
                textAlign: 'right'
              }}>
                {entry.displayValue}
              </span>
            </div>
          ))}
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.75rem', 
            color: 'var(--text-muted)', 
            fontStyle: 'italic',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '0.5rem'
          }}>
            * Porcentaje = promedio de disponibilidad del tipo de componente
          </div>
        </div>
      </div>
    </div>
  );
};
