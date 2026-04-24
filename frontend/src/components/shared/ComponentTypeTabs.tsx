import React from 'react';
import type { ByTypeSummary } from '../../types/trend';

interface ComponentTypeTabsProps {
  types: ByTypeSummary[];
  activeType: string;
  onChange: (type: string) => void;
}

export const ComponentTypeTabs: React.FC<ComponentTypeTabsProps> = ({ types, activeType, onChange }) => {
  // Siempre incluimos la opción "Todos"
  const allTypes = [{ type: 'Todos', avg: 0 }, ...types];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
      scrollbarWidth: 'none'
    }}>
      {allTypes.map((t) => (
        <button
          key={t.type}
          onClick={() => onChange(t.type)}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activeType === t.type ? '#020B50' : '#E5E7EB',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeType === t.type ? '#020B50' : '#FFFFFF',
            color: activeType === t.type ? '#FFFFFF' : '#4B5563',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {t.type}
          {t.type !== 'Todos' && (
            <span style={{ 
              fontSize: '0.75rem', 
              opacity: 0.8,
              background: activeType === t.type ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
              padding: '2px 6px',
              borderRadius: '6px'
            }}>
              {t.avg}%
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
