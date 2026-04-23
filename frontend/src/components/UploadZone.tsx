import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { read, utils } from 'xlsx';

export const UploadZone = () => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setUploadData = useDataStore((state) => state.setUploadData);

  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = async (file: File) => {
    setError(null);
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError("Formato inválido. Por favor, sube un archivo Excel (.xlsx o .xls)");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`El archivo es demasiado grande. El límite es de ${MAX_SIZE_MB}MB.`);
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
         setError("El archivo de Excel está vacío.");
         setIsLoading(false);
         return;
      }

      const firstRow: any = jsonData[0];

      // Validar esquema V3
      const hasOldSchema = Object.keys(firstRow).some(k => /Inc\d+_/i.test(k));
      if (hasOldSchema) {
        setError("Esquema desactualizado detectado. Por favor usa la plantilla V3.");
        setIsLoading(false);
        return;
      }

      const requiredKeys = ["Nombre del Proyecto", "Incidentes Críticos Totales"];
      const missingKeys = requiredKeys.filter(key => !(key in firstRow));

      if (missingKeys.length > 0) {
        setError(`Estructura inválida. Faltan columnas críticas: ${missingKeys.join(", ")}`);
        setIsLoading(false);
        return;
      }

      const projectNames = [...new Set(jsonData.map((r: any) => r["Nombre del Proyecto"]).filter(Boolean))];
      
      // Enviar el archivo al backend para guardar temp_excel.xlsx
      // (necesario para que el endpoint de disponibilidad pueda procesarlo)
      try {
        const formData = new FormData();
        formData.append('file', file);
        const backendResponse = await fetch('http://localhost:8000/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!backendResponse.ok) {
          console.warn('[UploadZone] Backend upload respondió con error:', backendResponse.status);
        }
      } catch (backendErr) {
        // El backend no está disponible — los incidentes seguirán funcionando
        // pero la disponibilidad no estará disponible
        console.warn('[UploadZone] No se pudo conectar al backend:', backendErr);
      }

      // Mock result (MVP requirement)
      const mockResult = { "2026-02": [] };
      
      setTimeout(() => {
        setUploadData(mockResult, jsonData, projectNames as string[]);
        setIsLoading(false);
      }, 800);

    } catch(err) {
      setError("Error al procesar el archivo. Inténtalo de nuevo.");
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="upload-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      width: '100%',
      padding: '2rem'
    }}>
      <div className="upload-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--navy)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Importar Datos del Servicio
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Carga tu reporte consolidado para generar el análisis operativo
        </p>
      </div>

      <div 
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        style={{
          width: '100%',
          maxWidth: '650px',
          background: 'var(--surface)',
          border: `2px dashed ${dragActive ? 'var(--blue)' : 'var(--border)'}`,
          borderRadius: '24px',
          padding: '4rem 2rem',
          cursor: isLoading ? 'wait' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: dragActive ? '0 20px 40px rgba(0, 80, 246, 0.1)' : '0 10px 30px rgba(0,0,0,0.05)',
          transform: dragActive ? 'scale(1.02)' : 'scale(1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'var(--blue)',
          opacity: 0.03,
          borderRadius: '50%'
        }}></div>

        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
        
        <div style={{
          width: '80px',
          height: '80px',
          background: dragActive ? 'var(--blue)' : 'rgba(0, 80, 246, 0.05)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}>
          <UploadCloud size={40} color={dragActive ? "#FFF" : "var(--blue)"} />
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid var(--gray)', 
              borderTopColor: 'var(--blue)', 
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem'
            }}></div>
            <div style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '1.25rem' }}>Procesando Reporte...</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Estamos validando la estructura de tus datos</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.75rem' }}>
              {dragActive ? '¡Suéltalo ahora!' : 'Selecciona tu archivo de Excel'}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '350px', margin: '0 auto 2rem' }}>
              Arrastra y suelta tu archivo aquí o haz clic para explorar en tu equipo
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontSize: '0.8rem', 
                color: 'var(--text-muted)',
                background: '#F8F9FB',
                padding: '0.5rem 1rem',
                borderRadius: '100px',
                border: '1px solid var(--border)'
              }}>
                <FileSpreadsheet size={14} />
                Formatos: .xlsx, .xls
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontSize: '0.8rem', 
                color: 'var(--text-muted)',
                background: '#F8F9FB',
                padding: '0.5rem 1rem',
                borderRadius: '100px',
                border: '1px solid var(--border)'
              }}>
                <ShieldCheck size={14} />
                Seguro & Privado
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ 
          marginTop: '2rem', 
          background: '#FFF5F5', 
          borderLeft: '4px solid #f44336',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: '#8b0000',
          borderRadius: '12px',
          maxWidth: '650px',
          width: '100%',
          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.1)'
        }}>
          <AlertCircle size={22} color="#f44336" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>Atención</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{error}</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
