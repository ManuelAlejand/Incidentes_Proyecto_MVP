import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { read, utils } from 'xlsx';

export const UploadZone = () => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setUploadData = useDataStore((state) => state.setUploadData);

  const MAX_SIZE_MB = 5;
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
      setError("Formato inválido. Por favor, sube un archivo .xlsx o .xls");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Tamaño de archivo supera los 5MB.");
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
         setError("El archivo de Excel está vacío o no contiene filas válidas.");
         setIsLoading(false);
         return;
      }

      const firstRow: any = jsonData[0];

      // Tarea 6.2: Detectar esquema antiguo (Inc1_*, Inc2_*)
      const hasOldSchema = Object.keys(firstRow).some(k => /Inc\d+_/i.test(k));
      if (hasOldSchema) {
        setError("Esquema desactualizado: usa la plantilla v3");
        setIsLoading(false);
        return;
      }

      // Tarea 6.1: Validar columnas requeridas V3 (las 16 de resumen)
      const requiredKeys = [
        "Nombre del Proyecto",
        "Equipo Responsable",
        "Mes de Reporte",
        "Total SLAs",
        "SLAs Cumplidos",
        "SLAs Comprometidos",
        "Incidentes Críticos Totales",
        "MTTR Promedio (minutos)",
        "MTBF (horas)",
        "Tiempo Total de Operación (horas)",
        "Número de Fallas",
        "Tiempo de Solución por Ticket (minutos)",
        "Incidentes Recurrentes",
        "Incidentes por Error Operativo",
        "Incidentes por Base de Datos",
        "Incidentes por API Gateway",
      ];
      const missingKeys = requiredKeys.filter(key => !(key in firstRow));

      if (missingKeys.length > 0) {
        setError(`Faltan columnas requeridas en el Excel: ${missingKeys.join(", ")}`);
        setIsLoading(false);
        return;
      }

      // Extraer nombres únicos de proyectos
      const projectNames = [...new Set(jsonData.map((r: any) => r["Nombre del Proyecto"]).filter(Boolean))];

      // Payload JSON estático inyectado como dummy mock del MVP 
      const mockResult = {
        "2026-02": [
          { id: "1", servicio: "Portal Clientes", disponibilidad: 99.98, incidentes: 2, despliegues: { current: 8, max: 8 }, capacidad: 0 },
          { id: "2", servicio: "Core Bancario", disponibilidad: 99.99, incidentes: 1, despliegues: { current: 4, max: 4 }, capacidad: 1 },
          { id: "3", servicio: "App Móvil", disponibilidad: 98.5, incidentes: 8, despliegues: { current: 10, max: 12 }, capacidad: 3 },
          { id: "4", servicio: "Sistema de Nómina", disponibilidad: 99.65, incidentes: 3, despliegues: { current: 5, max: 6 }, capacidad: 1 },
          { id: "5", servicio: "E-commerce", disponibilidad: 99.7, incidentes: 5, despliegues: { current: 14, max: 15 }, capacidad: 2 },
        ]
      };
      
      // Enviamos también 'jsonData' y 'projectNames' como parámteros extra a Zustand
      setUploadData(mockResult, jsonData, projectNames as string[]);
      setIsLoading(false);

    } catch(err) {
      setError("Error leyendo el archivo. Asegúrate de que sea un Excel válido.");
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
    <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
      <div 
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--color-info)' : 'var(--color-border)'}`,
          backgroundColor: dragActive ? '#eff6ff' : 'var(--color-card-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: '4rem 2rem',
          cursor: isLoading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
        
        <UploadCloud size={48} color={dragActive ? "var(--color-info)" : "var(--color-text-muted)"} />
        
        {isLoading ? (
          <div>
            <div className="font-bold text-lg" style={{ color: 'var(--color-info)' }}>Procesando archivo...</div>
            <div className="text-sm text-muted mt-2">Por favor espera, estamos validando la información.</div>
          </div>
        ) : (
          <>
            <div className="font-bold text-lg" style={{ color: 'var(--color-header-bg)' }}>
              Arrastra tu archivo Excel aquí o haz clic para seleccionar
            </div>
            <div className="text-sm text-muted">
              Formato requerido: .xlsx (Máximo 5MB)
            </div>
          </>
        )}
      </div>

      {error && (
        <div style={{ 
          marginTop: '2rem', 
          backgroundColor: '#fef2f2', 
          borderLeft: '4px solid var(--color-danger)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'left',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <AlertCircle size={20} />
          <span className="font-bold">{error}</span>
        </div>
      )}
    </div>
  );
};
