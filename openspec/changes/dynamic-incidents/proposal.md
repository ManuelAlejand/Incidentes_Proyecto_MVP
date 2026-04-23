## Why

Tenemos la especificación formal del módulo de Incidentes (`specs/incidents/spec.md`) pensada para un backend futuro, pero actualmente queremos probar y exhibir estos cálculos visuales en el frontend utilizando la misma metadata parseada desde un Excel cargado en la `UploadZone`. Requerimos conectar los gráficos, alertas y colores que el diseño original contempla, pero poblándolos dinámicamente con la lógica de negocio sin tocar layout ni estructura.

## What Changes

- Crearemos un servicio local temporal (`frontend/src/services/incidentParser.ts`) que replicará la lógica de negocio exigida en el backend según el specification:
  - Detección escalar de columnas `IncN_*`
  - Algoritmo de cálculo de impacto a través del MTTR -> ('Crítico', 'Alto', 'Bajo') con colores asociados ('red', 'orange', 'green').
  - Agrupación por fuente y conteos.
  - Lógica heurística del mensaje de análisis experto de recuperación.
- El `App.tsx` y su Modal de Incidentes se modificarán para consumir este objeto derivado proveniente directamente de la data importada de Zustand, preservando las mismas dimensiones e iterando las filas necesarias.

## Capabilities

### New Capabilities
- `dynamic-incidents-logic`: Emulación en Typescript cliente de la lógica propuesta para backend en `specs/incidents/spec.md`.

### Modified Capabilities
- `incident-modal-ui`: Modificado para consumir los colores inyectados, renderizar el gráfico dinámico de Recharts y alternar los banners de "Acciones Requeridas" según la inteligencia del Parser en lugar de datos hardcodeados.

## Impact
- `frontend/src/services/incidentParser.ts` -> NUEVO archivo para encapsular esta lógica sin ensuciar la UI.
- `frontend/src/App.tsx` -> Re-conexión del estado del modal.
- `frontend/src/components/UploadZone.tsx` -> Posibles retoques menores si hay que almacenar más contexto.
