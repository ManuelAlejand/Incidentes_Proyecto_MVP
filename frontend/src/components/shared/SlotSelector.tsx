import React from 'react';

interface SlotSelectorProps {
  slots: string[];
  activeSlot: string;
  onChange: (slot: string) => void;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({ slots, activeSlot, onChange }) => {
  if (!slots.length) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
      <span style={{ 
        fontSize: '10px', 
        textTransform: 'uppercase', 
        fontWeight: 700, 
        color: '#9CA3AF', 
        width: '100%', 
        marginBottom: '4px' 
      }}>
        Seleccionar Franja Horaria (Intraday)
      </span>
      {slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onChange(slot)}
          style={{
            padding: '6px 12px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 600,
            border: '1px solid',
            transition: 'all 0.2s',
            cursor: 'pointer',
            backgroundColor: activeSlot === slot ? '#020B50' : '#FFFFFF',
            color: activeSlot === slot ? '#FFFFFF' : '#6B7280',
            borderColor: activeSlot === slot ? '#020B50' : '#E5E7EB',
            boxShadow: activeSlot === slot ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};
