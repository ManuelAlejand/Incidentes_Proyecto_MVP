import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList
} from 'recharts';
import type { TrendPoint } from '../../types/trend';

interface TrendChartProps {
  data: TrendPoint[];
  meta: number;
  height?: number | string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload as TrendPoint;
    return (
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '12px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        fontSize: '0.85rem'
      }}>
        <p style={{ fontWeight: 700, color: '#020B50', marginBottom: '4px' }}>{label}</p>
        <p style={{ margin: 0 }}>
          Disponibilidad: <span style={{ fontWeight: 700, color: '#9b1b30' }}>{point.value}%</span>
        </p>
        {point.is_simulated && (
          <p style={{ fontSize: '10px', color: '#6B7280', fontStyle: 'italic', marginTop: '4px' }}>
            Dato simulado (MVP)
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const TrendChart: React.FC<TrendChartProps> = ({ data, meta, height = 250 }) => {
  // Color granate/maroon para la línea
  const MAROON = '#9b1b30';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 11 }}
            dy={10}
          />
          <YAxis 
            hide={false}
            domain={['auto', 100]} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={meta} 
            stroke="#9CA3AF" 
            strokeDasharray="5 5" 
            label={{ 
              value: `Meta ${meta}%`, 
              position: 'right', 
              fill: '#9CA3AF', 
              fontSize: 10,
              fontWeight: 600
            }} 
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={MAROON}
            strokeWidth={3}
            dot={{ r: 4, fill: MAROON, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1000}
          >
            <LabelList 
              dataKey="value" 
              position="top" 
              offset={10} 
              formatter={(val: any) => `${val}%`}
              style={{ fontSize: '10px', fontWeight: '700', fill: '#020B50' }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
