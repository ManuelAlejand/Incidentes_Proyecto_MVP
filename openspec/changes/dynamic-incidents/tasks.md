## 1. Servicio Computacional (Parser)
- [x] 1.1 Crear `frontend/src/services/incidentParser.ts` exportando la función `parseIncidentsFrontend(rawExcelData, projectName)` que construya el array identificando regex `/Inc\d+_Servicio/`.
- [x] 1.2 Programar la clasificación heurística `MTTR` (crítico, alto, bajo y sus labels/colores) y la estructuración del análisis de texto libre en dicho servicio.
- [x] 1.3 Adaptar el tipado de retorno a la Interface exacta propuesta en el backend (`IncidentResponse`).

## 2. Modificación App.tsx
- [x] 2.1 Reemplazar la data dura (`modalIncidentesCriticos` u originaria de `data.ts`) en la renderización del Modal, detectando si la fila pre-cargada (`parsedExcelRawData`) está activa.
- [x] 2.2 Usar la función `parseIncidentsFrontend` al activar el modal para calcular los valores *ad hoc* y propagarlos a los componentes de UI.

## 3. UI Reactivity
- [x] 3.1 Garantizar que Recharts procese sin fallos ni deformaciones el Array con las distribuciones de fuentes (Fuentes de Fallas), y que la tabla de registros inferiores liste las columnas dinámicas sin romper el layout.
