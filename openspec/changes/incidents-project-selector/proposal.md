## Why

El dashboard muestra una card de Incidentes con datos hardcodeados que no se actualizan al cargar un Excel. El número total de incidentes en la card es incorrecto (solo lee una columna en lugar de sumar las 6 columnas de resumen), y el modal no tiene forma de seleccionar entre los múltiples proyectos que puede contener el Excel, por lo que siempre muestra el primer proyecto de la lista o datos vacíos.

## What Changes

- **Fix del cálculo del total de incidentes en la card**: El número mostrado será la suma de las 6 columnas de resumen del Excel (`Incidentes Críticos Totales`, `Número de Fallas`, `Incidentes Recurrentes`, `Incidentes por Error Operativo`, `Incidentes por Base de Datos`, `Incidentes por API Gateway`) para el proyecto activo, no solo la primera columna.
- **Extracción de proyectos únicos al cargar el Excel**: Al subir el archivo, se extraerá la lista de proyectos distintos (por `Nombre del Proyecto`) y se guardará en el store de Zustand.
- **Selector de proyecto dentro del modal de incidentes**: Al abrir el modal se mostrará un dropdown con todos los proyectos del Excel. Al seleccionar uno, se recalcula y muestra toda la información de ese proyecto: resumen, gráfico de torta, tabla de incidentes y análisis.
- **Conexión real entre Excel y card de incidentes**: La card mostrará el total del proyecto seleccionado por defecto (el primero del Excel), actualizándose cuando el usuario cambie de proyecto en el modal.

## Capabilities

### New Capabilities
- `incident-project-selector`: Selector interactivo de proyecto dentro del modal de incidentes, que permite filtrar y visualizar los datos de cada proyecto del Excel cargado.

### Modified Capabilities
- `incidents`: El cálculo de `total` en el resumen cambia: ahora suma las 6 columnas de resumen del Excel en lugar de leer solo `Incidentes Críticos Totales`. La card del dashboard refleja el total del proyecto activo en tiempo real.

## Impact

- `frontend/src/services/incidentParser.ts` — Modificar la lógica de cálculo de `totalIncidentes` para sumar las 6 columnas.
- `frontend/src/store/dataStore.ts` — Agregar `projectNames: string[]` y `activeProjectName: string | null` al estado; extraer lista de proyectos al momento de la carga.
- `frontend/src/components/UploadZone.tsx` — Al parsear el Excel, extraer nombres únicos de proyectos y guardarlos en el store.
- `frontend/src/App.tsx` — La card de incidentes lee `activeProjectName` del store para calcular `dynamicIncidents`; el modal incluye el selector de proyecto.
