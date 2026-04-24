import React from 'react';
import { useDataStore } from '../../store/dataStore';
import { useAvailabilityTrend } from '../../hooks/useAvailabilityTrend';
import { TrendChart } from '../shared/TrendChart';
import { PeriodToggle } from '../shared/PeriodToggle';
import { SlotSelector } from '../shared/SlotSelector';
import { ComponentTypeTabs } from '../shared/ComponentTypeTabs';
import type { GlobalAvailability } from '../../types/availability';

interface AvailabilityModalProps {
  data: GlobalAvailability;
  onClose: () => void;
}

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ data, onClose }) => {
  const activeProjectName = useDataStore((state) => state.activeProjectName);
  
  // Hook de tendencia
  const { 
    period, 
    setPeriod, 
    componentType, 
    setComponentType,
    slot,
    setSlot,
    data: trendData, 
    isLoading,
    error 
  } = useAvailabilityTrend(activeProjectName || '');

  // Valores actuales (de los props o del trendData si ya cargó)
  const currentVal = trendData?.current_value ?? data.percentage;
  const metaVal = trendData?.meta ?? data.meta;
  const delta = currentVal - metaVal;
  const meetsTarget = currentVal >= metaVal;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(2, 11, 80, 0.5)', // Navy translúcido
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%', maxWidth: '1100px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header Section */}
        <div style={{
          padding: '2rem 2.5rem',
          background: 'linear-gradient(135deg, #020B50 0%, #04147A 100%)',
          color: 'white',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', right: '1.5rem', top: '1.5rem',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '50%', width: '40px', height: '40px',
              color: 'white', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', transition: 'background 0.2s'
            }}
          >
            <span className="material-icons">close</span>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px', width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-icons">trending_up</span>
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Tendencia de Disponibilidad
              </h2>
              <p style={{ opacity: 0.8, margin: 0, fontSize: '0.95rem' }}>{activeProjectName}</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '2.5rem', overflowY: 'auto', maxHeight: '80vh' }}>
          
          {/* Main Stats Row */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1.5rem', marginBottom: '2.5rem' 
          }}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Disponibilidad Actual</div>
              <div style={{ ...statValueStyle, color: meetsTarget ? '#10B981' : '#EF4444' }}>
                {currentVal.toFixed(2)}%
              </div>
              <div style={statSubStyle}>Meta establecida: {metaVal}%</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Desviación vs Meta</div>
              <div style={{ ...statValueStyle, color: delta >= 0 ? '#10B981' : '#EF4444' }}>
                {delta >= 0 ? '+' : ''}{delta.toFixed(2)}%
              </div>
              <div style={statSubStyle}>Diferencia porcentual</div>
            </div>

            <div style={statCardStyle}>
              <div style={statLabelStyle}>Estado Global</div>
              <div style={{ 
                ...statValueStyle, 
                fontSize: '1.2rem', 
                background: meetsTarget ? '#D1FAE5' : '#FEE2E2',
                color: meetsTarget ? '#065F46' : '#991B1B',
                padding: '0.5rem 1rem',
                borderRadius: '99px',
                marginTop: '0.5rem',
                display: 'inline-block'
              }}>
                {meetsTarget ? 'OBJETIVO CUMPLIDO' : 'BAJO LA META'}
              </div>
              <div style={statSubStyle}>Basado en datos actuales</div>
            </div>
          </div>

          {/* Chart Controls */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Desglose por Infraestructura
              </div>
              <ComponentTypeTabs 
                types={trendData?.by_type_summary || []}
                activeType={componentType}
                onChange={setComponentType}
              />
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Periodo de Visualización
              </div>
              <PeriodToggle activePeriod={period} onChange={setPeriod} />
            </div>
          </div>

          {/* Intraday Slot Selector (only for 'day' period) */}
          {period === 'day' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <SlotSelector 
                slots={["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 24:00"]}
                activeSlot={slot || "00:00 - 06:00"}
                onChange={setSlot} 
              />
            </div>
          )}

          {/* Main Chart Container */}
          <div style={{ 
            position: 'relative', 
            height: '400px', 
            background: '#F9FAFB', 
            borderRadius: '20px', 
            border: '1px solid #E5E7EB',
            padding: '1.5rem',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
            {isLoading && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, borderRadius: '20px'
              }}>
                <div style={{ 
                  width: '40px', height: '40px', border: '3px solid #E5E7EB', 
                  borderTopColor: '#020B50', borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '1rem', color: '#020B50', fontWeight: 600 }}>Procesando datos históricos...</p>
              </div>
            )}

            {error && (
              <div style={{ 
                height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: '#EF4444', textAlign: 'center', padding: '2rem'
              }}>
                <div>
                  <span className="material-icons" style={{ fontSize: '3rem', marginBottom: '1rem' }}>error_outline</span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No se pudieron cargar los datos</p>
                  <p style={{ opacity: 0.8 }}>{error}</p>
                </div>
              </div>
            )}
            
            {!isLoading && !error && trendData && (
              <div style={{ height: '100%' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-icons" style={{ color: '#9b1b30' }}>show_chart</span>
                  <span style={{ fontWeight: 700, color: '#374151' }}>Evolución de Disponibilidad ({period.toUpperCase()})</span>
                </div>
                <TrendChart data={trendData.data_points} meta={metaVal} height={320} />
              </div>
            )}

            {!isLoading && !error && !trendData && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                <p>No hay datos disponibles para este filtro</p>
              </div>
            )}
          </div>

          {/* Legend / Footer */}
          <div style={{ 
            marginTop: '1.5rem', display: 'flex', gap: '2rem', 
            justifyContent: 'center', fontSize: '0.85rem', color: '#6B7280' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#9b1b30' }}></div>
              <span>Disponibilidad Real/Simulada</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '2px', backgroundColor: '#BCBEC2', borderBottom: '1px dashed #BCBEC2' }}></div>
              <span>Meta de Servicio ({metaVal}%)</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Internal styles for stat cards
const statCardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  padding: '1.5rem',
  borderRadius: '20px',
  border: '1px solid #F3F4F6',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  textAlign: 'center'
};

const statLabelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.5rem'
};

const statValueStyle: React.CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 900,
  margin: '0.25rem 0'
};

const statSubStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#9CA3AF',
  marginTop: '0.25rem'
};
