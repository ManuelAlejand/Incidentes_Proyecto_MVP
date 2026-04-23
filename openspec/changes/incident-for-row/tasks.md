## 1. Validación del endpoint de upload

- [x] 1.1 En `backend/app/routers/upload.py` (o donde resida el endpoint), definir la lista `REQUIRED_COLUMNS_V3` con las 21 columnas exactas de la plantilla V3.
- [x] 1.2 Antes de parsear, detectar si el DataFrame contiene columnas con patrón `Inc\d+_`. Si las hay, retornar HTTP 422: `"Esquema desactualizado: usa la plantilla v3"`.
- [x] 1.3 Validar que todas las columnas de `REQUIRED_COLUMNS_V3` existen en el DataFrame. Si faltan, retornar HTTP 422 listando las faltantes.

## 2. Reescritura de excel_parser.py

- [x] 2.1 Eliminar toda la lógica de detección regex de columnas `Inc\d+_*`.
- [x] 2.2 Implementar función `group_project_data(df: pd.DataFrame, project_name: str) -> dict` que:
  - Filtre `df[df["Nombre del Proyecto"] == project_name]`
  - Tome datos de resumen de `project_rows.iloc[0]`
  - Filtre incidentes con `Servicio del Incidente` no vacío
- [x] 2.3 Iterar sobre `df["Nombre del Proyecto"].unique()` para procesar cada proyecto en el DataFrame completo.

## 3. Reescritura de incident_parser.py

- [x] 3.1 Eliminar el bucle de `incidentKeys` basado en regex `/Inc\d+_Servicio/`.
- [x] 3.2 Implementar parseo por filas: iterar `incident_rows.itertuples()` leyendo las columnas:
  - `Servicio del Incidente`
  - `Descripción del Incidente`
  - `Fuente del Incidente`
  - `MTTR del Incidente (minutos)`
  - `Fecha del Incidente`
- [x] 3.3 Calcular `avg_mttr` desde `incident_rows["MTTR del Incidente (minutos)"].mean()`. Usar `MTTR Promedio (minutos)` del resumen como fallback si no hay filas de detalle.
- [x] 3.4 Construir `by_source` agrupando por `Fuente del Incidente` con `groupby`, calculando count y porcentaje, ordenando de mayor a menor.
- [x] 3.5 Calcular `services_affected` con `incident_rows["Servicio del Incidente"].nunique()`.

## 4. Actualización del modelo Pydantic ProjectSummary

- [x] 4.1 Agregar campo `incidentes_por_base_de_datos: int = 0` al modelo `ProjectSummary`.
- [x] 4.2 Agregar campo `incidentes_por_api_gateway: int = 0` al modelo `ProjectSummary`.
- [x] 4.3 Poblar ambos campos desde `project_rows.iloc[0]["Incidentes por Base de Datos"]` e `...["Incidentes por API Gateway"]` en el parser.

## 5. Frontend — actualizar incidentParser.ts

- [x] 5.1 Reescribir `parseIncidentsFrontend` en `frontend/src/services/incidentParser.ts` para que en lugar de buscar columnas `Inc\d+_Servicio`, itere sobre las filas del array raw asumiendo que **cada objeto del array es un incidente** (o una fila del Excel).
- [x] 5.2 Leer los datos de resumen del **primer elemento** del array agrupado por `"Nombre del Proyecto"`.
- [x] 5.3 Filtrar elementos donde `"Servicio del Incidente"` no esté vacío para construir el array de detalle.
- [x] 5.4 Usar `"Fuente del Incidente"` (no `IncN_Fuente`) para agrupar el pie chart.
- [x] 5.5 Usar `"MTTR del Incidente (minutos)"` (no `IncN_MTTR_min`) para el tiempo de recuperación individual.

## 6. Actualizar UploadZone — validación de columnas

- [x] 6.1 En `frontend/src/components/UploadZone.tsx`, actualizar `REQUIRED_KEYS` para reflejar las 21 columnas V3 (incluyendo las 5 columnas de detalle de incidente).
- [x] 6.2 Agregar detección de columnas antiguas: si el Excel contiene claves que coinciden con `/Inc\d+_/`, mostrar el mensaje `"Esquema desactualizado: usa la plantilla v3"` al usuario.
