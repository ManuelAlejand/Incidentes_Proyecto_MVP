## ADDED Requirements

### Requirement: Validación estricta de columnas V3
El endpoint de carga debe validar que el Excel contiene exactamente las 21 columnas definidas en la plantilla V3.

#### Scenario: Excel con columnas del esquema antiguo (Inc1_*)
- **WHEN** el usuario sube un Excel que contiene columnas con el patrón `Inc\d+_*`
- **THEN** el endpoint retorna HTTP 422 con mensaje `"Esquema desactualizado: usa la plantilla v3"`

#### Scenario: Excel con columnas faltantes
- **WHEN** el usuario sube un Excel al que le faltan una o más de las 21 columnas requeridas
- **THEN** el endpoint retorna HTTP 422 listando las columnas faltantes

#### Scenario: Excel válido V3
- **WHEN** el usuario sube un Excel con exactamente las 21 columnas requeridas
- **THEN** el endpoint acepta el archivo y procede con el parseo

---

### Requirement: Agrupación por proyecto con pandas groupby
El parser debe agrupar filas por `Nombre del Proyecto` y separar datos de resumen de datos de detalle.

#### Scenario: Proyecto con múltiples incidentes
- **WHEN** el DataFrame contiene N filas para el mismo proyecto con `Servicio del Incidente` no vacío
- **THEN** el parser construye una lista de N objetos `IncidentDetail` con los datos de cada fila

#### Scenario: Proyecto sin incidentes
- **WHEN** el DataFrame contiene una sola fila para el proyecto con `Servicio del Incidente` vacío
- **THEN** el parser retorna `incidents: []` y usa los datos de resumen del proyecto normalmente

#### Scenario: Datos de resumen consistentes
- **WHEN** el proyecto tiene múltiples filas
- **THEN** los datos de resumen (Total SLAs, MTTR Promedio, etc.) se leen de `project_rows.iloc[0]`

---

### Requirement: Nuevos campos en modelo ProjectSummary
El modelo Pydantic `ProjectSummary` debe incluir los campos de desglose por tipo de incidente.

#### Scenario: Campos de BD y API Gateway presentes
- **WHEN** el Excel contiene las columnas `Incidentes por Base de Datos` e `Incidentes por API Gateway`
- **THEN** el modelo `ProjectSummary` expone `incidentes_por_base_de_datos` e `incidentes_por_api_gateway` en la respuesta JSON

---

### Requirement: MTTR promedio calculado desde filas de detalle
El MTTR promedio del modal de incidentes se calcula desde las filas individuales, no desde el campo de resumen.

#### Scenario: Proyectos con detalle de incidentes
- **WHEN** existen filas con `MTTR del Incidente (minutos)` no nulo
- **THEN** `avg_mttr` se calcula como la media de esos valores (`incident_rows["MTTR del Incidente (minutos)"].mean()`)

#### Scenario: Proyecto sin filas de detalle
- **WHEN** no hay filas de detalle disponibles
- **THEN** se usa el campo `MTTR Promedio (minutos)` del resumen como fallback

---

### Requirement: Gráfico de torta con fuentes dinámicas
Los datos de la torta se construyen agrupando por `Fuente del Incidente` de las filas de detalle.

#### Scenario: Múltiples fuentes de falla
- **WHEN** las filas de detalle tienen distintos valores en `Fuente del Incidente`
- **THEN** el parser agrupa por texto exacto (case-insensitive), calcula count y porcentaje, y ordena de mayor a menor
