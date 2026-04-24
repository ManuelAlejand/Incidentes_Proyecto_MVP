import React from 'react';

interface PeriodToggleProps {
  activePeriod: '6m' | '3m' | 'day';
  onChange: (period: '6m' | '3m' | 'day') => void;
}

export const PeriodToggle: React.FC<PeriodToggleProps> = ({ activePeriod, onChange }) => {
  const periods: { id: '6m' | '3m' | 'day', label: string }[] = [
    { id: '6m', label: '6M' },
    { id: '3m', label: '3M' },
    { id: 'day', label: 'HOY' }
  ];

  return (
    <div style={{
      display: 'inline-flex',
      background: '#F3F4F6',
      padding: '4px',
      borderRadius: '12px',
      border: '1px solid #E5E7EB'
    }}>
      {periods.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activePeriod === p.id ? '#FFFFFF' : 'transparent',
            color: activePeriod === p.id ? '#020B50' : '#6B7280',
            boxShadow: activePeriod === p.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: '60px'
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};
