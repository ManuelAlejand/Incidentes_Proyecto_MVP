## Why

El modelo anterior basado en columnas dinámicas para los incidentes (`Inc1_Servicio`, etc.) generaba una escalabilidad horizontal insostenible: con múltiples incidentes, el archivo de Excel se volvería inmanejable por el excesivo ensanchamiento. El nuevo acercamiento promueve una fila por incidente único, donde los datos de resumen del proyecto se repiten por cada registro y los detalles del incidente corren en vertical. Esto es ideal para la posterior migración sistemática a bases de datos.

Se hace necesario reescribir la lógica de validación y de deserialización de backend (python) para ajustarse a las especificaciones V3 del Excel.

## What Changes

1. **Reescritura de `excel_parser.py`**:
   - Implementar agrupación por "Nombre del Proyecto" usando `pandas` de acuerdo a múltiples filas.
   - Leer una sola vez del primer registro agrupado todos los valores resumen de proyecto (que se repiten en cada fila).
   - Validar estrictamente la presencia de las 21 columnas en vez de aplicar regex flexible para prevenir plantillas antiguas (retornará error HTTP 422: "Esquema desactualizado: usa la plantilla v3").

2. **Reescritura de `incident_parser.py` (o afines)**:
   - Descartar Regex (`/Inc\d+_/`) y usar subgrupos de filas.
   - Filtrar ignorando celdas donde la columna "Servicio del Incidente" se encuentre en blanco o nula.

3. **Modificaciones en DTOs Pydantic**:
   - Incorporar `incidentes_por_base_de_datos` e `incidentes_por_api_gateway` dentro de `ProjectSummary`.

## Capabilities

### New Capabilities
- `excel-row-aggregation`: Capacidad de iterar subgrafos verticales (groupby via pandas) separando datos resumen genéricos del proyecto y arrays de incidentes.

### Modified Capabilities
- `incidents`: Se cambia los requerimientos de estructura de extracción, dictamen de MTTR (promedios estáticos vs promedios en array), sumatorias y lógica heurística del modelo de array horizontal a escalar vertical.
- `excel-integration`: El contrato de validación de 21 columnas estáticas en endpoint (versión plantilla V3).

## Impact
- Ficheros Python impactados: `backend/app/services/excel_parser.py`, `backend/app/services/incident_parser.py` y el endpoint principal de upload.
- Clases afectadas: `ProjectSummary` (Pydantic model).
- Dependencias/Frontend: Backend seguirá devolviendo exactamente el MISMO JSON, manteniendo toda la UI front-end compatible con la refactorización reciente.
