## Why

Actualmente, la card de "Tiempos de Respuesta" (MTTR/MTBF) muestra datos hardcodeados y no se actualiza al cargar un Excel. Además, el selector de proyectos implementado anteriormente está oculto dentro de un modal, lo que impide una vista coherente de todo el dashboard para un único proyecto seleccionado.

## What Changes

- **Global Project Selector**: Se moverá el selector de proyectos del modal de incidentes al header principal de la aplicación.
- **Dynamic Response Times**: La card de "Tiempos de Respuesta" mostrará datos reales (MTTR y MTBF) extraídos de las columnas de resumen del Excel.
- **Time Formatting**: Implementación de reglas de formateo específicas para minutos (MTTR) y horas (MTBF) para mejorar la legibilidad.
- **Unified State**: Todas las cards del dashboard consumirán el mismo `activeProjectName` del store global.

## Capabilities

### New Capabilities
- `response-times-dynamic`: Capacidad de extraer y visualizar métricas de tiempo de respuesta desde el Excel.
- `global-project-selector`: Interfaz global para alternar entre los proyectos cargados en el sistema.

### Modified Capabilities
- `incidents`: El modal de incidentes ahora responderá al selector global en lugar de tener uno interno.

## Impact

- `App.tsx`: Cambios en el layout para incluir el selector global y actualizar la card de tiempos.
- `dataStore.ts`: Se utilizará como fuente única de verdad para el proyecto activo.
- `incidentParser.ts`: Se actualizará para extraer la métrica de MTBF (horas) además del MTTR.
