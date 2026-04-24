import React, { useState } from 'react';
import type { FilterState } from '../../hooks/useTableFilters';

interface FilterAxisDef {
  key: string;
  label: string;
  maxPills?: number;
  getColor?: (value: string) => string;
}

interface TableFilterBarProps {
  filterDefs: FilterAxisDef[];
  filterState: FilterState;
  availableOptions: Record<string, string[]>;
  onToggle: (key: string, value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  totalCount: number;
  defaultExpanded?: boolean;
}

export const TableFilterBar: React.FC<TableFilterBarProps> = ({
  filterDefs,
  filterState,
  availableOptions,
  onToggle,
  onClear,
  hasActiveFilters,
  resultCount,
  totalCount,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div style={{ marginBottom: '1.5rem', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: '0.75rem 1.25rem', 
          background: '#F8FAFC', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-icons" style={{ fontSize: '18px', color: '#64748B' }}>filter_list</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
            Filtros de Tabla
          </span>
          {hasActiveFilters && (
            <span style={{ background: '#020B50', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
              Activos
            </span>
          )}
        </div>
        <span className="material-icons" style={{ color: '#64748B' }}>
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filterDefs.map(axis => {
              const options = availableOptions[axis.key] || [];
              if (options.length === 0) return null;

              const useDropdown = options.length > (axis.maxPills || 5);
              const activeValues = filterState[axis.key] || [];

              return (
                <div key={axis.key} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '80px', paddingTop: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                      {axis.label}:
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                    {useDropdown ? (
                      <select 
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none' }}
                        onChange={(e) => {
                          if (e.target.value) onToggle(axis.key, e.target.value);
                          e.target.value = ""; // Reset
                        }}
                        value=""
                      >
                        <option value="">Seleccionar {axis.label}...</option>
                        {options.map(opt => (
                          <option key={opt} value={opt} disabled={activeValues.includes(opt)}>
                            {opt} {activeValues.includes(opt) ? '(Seleccionado)' : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      options.map(opt => {
                        const isActive = activeValues.includes(opt);
                        const customColor = axis.getColor ? axis.getColor(opt) : '#1F3864';
                        
                        return (
                          <button
                            key={opt}
                            onClick={() => onToggle(axis.key, opt)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              border: '1px solid',
                              borderColor: isActive ? customColor : '#E2E8F0',
                              background: isActive ? customColor : '#F8FAFC',
                              color: isActive ? '#FFFFFF' : '#475569',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s'
                            }}
                          >
                            {opt}
                            {isActive && <span style={{ fontSize: '14px' }}>×</span>}
                          </button>
                        );
                      })
                    )}

                    {/* Active values display for dropdown mode */}
                    {useDropdown && activeValues.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', width: '100%', marginTop: '4px' }}>
                        {activeValues.map(val => (
                          <span 
                            key={val}
                            onClick={() => onToggle(axis.key, val)}
                            style={{
                              padding: '2px 8px', borderRadius: '4px', background: '#F1F5F9', color: '#475569', 
                              fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer'
                            }}
                          >
                            {val} <span style={{ fontSize: '12px' }}>×</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer / Summary */}
          <div style={{ 
            marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Mostrando <strong>{resultCount}</strong> de <strong>{totalCount}</strong> incidentes
            </span>
            
            {hasActiveFilters && (
              <button 
                onClick={onClear}
                style={{ 
                  background: 'none', border: 'none', color: '#64748B', fontSize: '0.8rem', 
                  textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 
                }}
              >
                Limpiar todos los filtros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
