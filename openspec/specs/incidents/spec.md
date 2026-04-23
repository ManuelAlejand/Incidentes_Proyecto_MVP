# Spec: Incidents Module

## Estado: ACTIVO
## Versión: 1.0.0
## Depende de: specs/excel-ingestion/spec.md (debe estar completo y funcional)

---

## Objetivo

Mostrar en el dashboard principal una card con el total de incidentes críticos
del proyecto activo. Al hacer clic, abre un modal con: resumen agregado,
gráfico de torta dinámico por fuente de falla, tabla de incidentes individuales
y sección de análisis con acciones requeridas.
Todos los datos provienen del Excel cargado. Cero valores hardcodeados.
El diseño ya se encuentra en el archivo del frontend donde carga todos los datos, solo hay que poner los datos dinamicos.
---

## Estructura del Excel — columnas requeridas

### Columnas base (ya existentes en Hoja 1)
- "Nombre del Proyecto" — identificador del proyecto
- "Incidentes Críticos Totales" — número total, usado en la card del index
- "MTTR Promedio (minutos)" — promedio general del mes

### Columnas nuevas de detalle por incidente (misma hoja)
Por cada incidente se agregan 5 columnas con prefijo IncN_:

  IncN_Servicio      → string  — nombre del servicio afectado
  IncN_Descripcion   → string  — descripción del incidente
  IncN_Fuente        → string  — origen del fallo (libre, dinámico)
  IncN_MTTR_min      → number  — minutos de recuperación de ese incidente
  IncN_Fecha         → string  — formato "YYYY-MM-DD HH:MM"

Donde N va de 1 hasta el máximo de incidentes de cualquier proyecto.
Las filas con menos incidentes dejan esas columnas vacías.
El backend detecta todos los grupos IncN_* leyendo los nombres de columna.
No hay límite hardcodeado de incidentes por proyecto.

Ejemplo para 3 incidentes:
  Inc1_Servicio | Inc1_Descripcion | Inc1_Fuente | Inc1_MTTR_min | Inc1_Fecha
  Inc2_Servicio | Inc2_Descripcion | Inc2_Fuente | Inc2_MTTR_min | Inc2_Fecha
  Inc3_Servicio | Inc3_Descripcion | Inc3_Fuente | Inc3_MTTR_min | Inc3_Fecha

---

## Lógica de negocio


### Agrupación por proyecto
El DataFrame tiene múltiples filas por proyecto.
El parser agrupa por "Nombre del Proyecto" y trabaja así:

```python
project_rows = df[df["Nombre del Proyecto"] == project_name]

# Datos de resumen: vienen de la primera fila (son iguales en todas)
total_incidents     = project_rows.iloc[0]["Incidentes Críticos Totales"]
mttr_promedio       = project_rows.iloc[0]["MTTR Promedio (minutos)"]
incidentes_bd       = project_rows.iloc[0]["Incidentes por Base de Datos"]
incidentes_api      = project_rows.iloc[0]["Incidentes por API Gateway"]
incidentes_op_error = project_rows.iloc[0]["Incidentes por Error Operativo"]

# Detalle de incidentes: una fila por incidente, ignorar filas sin servicio
incident_rows = project_rows[
    project_rows["Servicio del Incidente"].notna() &
    (project_rows["Servicio del Incidente"].str.strip() != "")
]
```



### Cálculo de impacto por MTTR (automático, no viene del Excel)
MTTR > 180 min  → "Crítico"   color: rojo   #DC2626
60 ≤ MTTR ≤ 180 → "Alto"      color: naranja #EA580C
MTTR < 60 min   → "Bajo"      color: verde  #16A34A
MTTR vacío/0    → "Bajo"      color: verde

### Formato de tiempo de recuperación 
minutos == 0           → "0min"
minutos < 60           → "{m}min"            ej: "45min"
minutos % 60 == 0      → "{h}h"              ej: "2h"
minutos >= 60          → "{h}h {m}min"       ej: "1h 35min"

### Gráfico de torta — fuentes dinámicas
Se agrupa por "Fuente del Incidente" de las filas de detalle.
No hay categorías fijas. Lo que venga en el Excel se muestra.
Adicionalmente se pueden usar las columnas de resumen
"Incidentes por Base de Datos", "Incidentes por API Gateway",
"Incidentes por Error Operativo" para validar que el total cuadra.

```python
by_source = (
    incident_rows.groupby("Fuente del Incidente")
    .size()
    .reset_index(name="count")
    .sort_values("count", ascending=False)
)
total = len(incident_rows)
by_source["percentage"] = (by_source["count"] / total * 100).round(1)
```

### Mensaje de análisis automático

"Se han registrado {total} incidente(s) en el mes actual.
Causa principal identificada: {fuente_con_más_incidentes}."

Si total == 0:
    "No se registraron incidentes críticos en el mes actual."

Si el MTTR promedio del proyecto es > 180 min:
  "El MTTR promedio es alto. Se recomienda revisar los tiempos de respuesta y recuperación."

Si el MTTR promedio está entre 60 y 180 min:
  "El MTTR promedio está en rango medio. Se recomienda monitoreo continuo."

Si el MTTR promedio es < 60 min:
  "El MTTR promedio es bajo. Buen desempeño en recuperación de incidentes."

Si hay más de 3 fuentes de falla diferentes:
  "Se detectaron múltiples fuentes de falla. Se recomienda estandarizar procesos."

Si hay más de 5 incidentes en total:
  "Se detectaron varios incidentes. Se recomienda revisar causas raíz."

### Tabla de incidentes individuales

Mostrar todas las filas donde IncN_Servicio no está vacío.
Columnas a mostrar:

- Fecha (IncN_Fecha)
- Servicio (IncN_Servicio)
- Descripción (IncN_Descripcion)
- Fuente (IncN_Fuente)
- MTTR (IncN_MTTR_min + formato "Xh Ymin")
- Impacto (calculado por MTTR)

Orden: por fecha descendente (más reciente primero).

### Métricas del resumen
- Total Incidentes: count de IncN_Servicio no vacíos para ese proyecto
- Tiempo Promedio Recuperación: average de IncN_MTTR_min no vacíos, formateado
- Servicios Afectados: count distinct de IncN_Servicio no vacíos

### Servicios afectados
```python
services_affected = incident_rows["Servicio del Incidente"].nunique()
```

### MTTR promedio del modal
Se calcula desde "MTTR del Incidente (minutos)" de las filas de detalle,
NO desde "MTTR Promedio (minutos)" del resumen (ese es el promedio general).
```python
avg_mttr = incident_rows["MTTR del Incidente (minutos)"].mean()
```

---

## Contrato de API

### GET /api/v1/projects/{project_id}/incidents

Response 200 — proyecto con incidentes:
```json
{
  "project_id": "app-exito-digital",
  "summary": {
    "total": 4,
    "avg_recovery_minutes": 185,
    "avg_recovery_formatted": "3h 5min",
    "services_affected": 3
  },
  "by_source": [
    { "source": "Base de Datos",   "count": 1, "percentage": 25.0 },
    { "source": "API Gateway",     "count": 1, "percentage": 25.0 },
    { "source": "Servidor Web",    "count": 1, "percentage": 25.0 },
    { "source": "Error Operativo", "count": 1, "percentage": 25.0 }
  ],
  "incidents": [
    {
      "index": 1,
      "service":            "App Móvil",
      "description":        "Latencia excesiva en módulo de pagos",
      "mttr_minutes":       210,
      "recovery_formatted": "3h 30min",
      "source":             "Base de Datos",
      "impact":             "Crítico",
      "impact_color":       "red",
      "date":               "2025-01-08T09:15:00"
    }
  ],
  "analysis": {
    "message": "Se han registrado 4 incidentes en el mes actual. Causa principal identificada: Base de Datos.",
    "action_required": true
  }
}
```

Response 200 — proyecto sin incidentes:
```json
{
  "project_id": "portal-bancolombia",
  "summary": {
    "total": 0,
    "avg_recovery_minutes": 0,
    "avg_recovery_formatted": "0min",
    "services_affected": 0
  },
  "by_source": [],
  "incidents": [],
  "analysis": {
    "message": "No se registraron incidentes críticos en el mes actual.",
    "action_required": false
  }
}
```

Response 404 — proyecto no encontrado:
```json
{
  "status": "error",
  "error_type": "project_not_found",
  "message": "No se encontró el proyecto con id: {project_id}"
}
```

---

## Backend — archivos a crear/modificar

### NUEVO: `backend/app/services/incident_parser.py`

Función principal:
```python
def parse_incidents(df: pd.DataFrame, project_name: str) -> dict:
    """
    Recibe el DataFrame completo del Excel y el nombre del proyecto.
    Retorna el dict con la estructura del contrato de API.
    """
```

Responsabilidades internas:
1. Filtrar el DataFrame por "Nombre del Proyecto" == project_name
2. Detectar grupos IncN_* dinámicamente con regex sobre nombres de columna
3. Construir lista de incidentes ignorando filas con IncN_Servicio vacío
4. Calcular impacto por MTTR de cada incidente
5. Formatear tiempos
6. Agrupar por IncN_Fuente y calcular porcentajes
7. Calcular métricas del resumen
8. Construir mensaje de análisis
9. Retornar dict con la estructura exacta del contrato

### NUEVO: `backend/app/routers/incidents.py`

```python
@router.get("/projects/{project_id}/incidents")
async def get_incidents(project_id: str):
    df = data_repository.get_dataframe()   # lee del repo activo
    project_name = data_repository.resolve_name(project_id)  # slug → nombre real
    return incident_parser.parse_incidents(df, project_name)
```

### MODIFICAR: `backend/app/repositories/data_repository.py`
Agregar método:
- `get_dataframe() → pd.DataFrame` — devuelve el DataFrame completo en memoria
- `resolve_name(project_id: str) → str` — convierte slug a nombre real del proyecto
  Ejemplo: "app-exito-digital" → "App Éxito Digital"
  Lógica: buscar en el índice de proyectos guardado al momento del upload

### MODIFICAR: `backend/app/models/project.py`
Agregar modelos Pydantic:

```python
class IncidentSummary(BaseModel):
    total: int
    avg_recovery_minutes: float
    avg_recovery_formatted: str
    services_affected: int

class IncidentBySource(BaseModel):
    source: str
    count: int
    percentage: float

class IncidentDetail(BaseModel):
    index: int
    service: str
    description: str
    mttr_minutes: float
    recovery_formatted: str
    source: str
    impact: str          # "Crítico" | "Alto" | "Bajo"
    impact_color: str    # "red" | "orange" | "green"
    date: str

class IncidentAnalysis(BaseModel):
    message: str
    action_required: bool

class IncidentResponse(BaseModel):
    project_id: str
    summary: IncidentSummary
    by_source: list[IncidentBySource]
    incidents: list[IncidentDetail]
    analysis: IncidentAnalysis
```

### MODIFICAR: `backend/app/main.py`
Registrar el nuevo router:
```python
from app.routers import incidents
app.include_router(incidents.router, prefix="/api/v1")
```

---

## Frontend — archivos a crear/modificar

### MODIFICAR: Card de incidentes en el dashboard (index)

El componente card existente debe:
- Mostrar el número de `summary.total` como valor principal
- Subtexto: "incidentes críticos este mes"
- Si total > 0: número en rojo. Si total == 0: número en verde
- onClick: llama fetchIncidents(projectId) y abre IncidentModal
- Estado loading: mostrar skeleton/spinner mientras carga
- El project_id sale del proyecto activo en el store de Zustand

### NUEVO: `frontend/src/components/incidents/IncidentModal.tsx`

Estructura del modal (debe seguir como ya se tiene en el prototipo del frontend cuando se abre la card de los incidentes):
 Incidentes Críticos del Mes          [X]│
├─────────────────────────────────────────┤
│ RESUMEN DE INCIDENTES                   │
│ [Total] [Tiempo Prom. Recuperación] [Servicios Afectados] │
├─────────────────────────────────────────┤
│ INCIDENTES POR FUENTE DE FALLA          │
│  [Gráfico torta]  [Leyenda dinámica]    │
├─────────────────────────────────────────┤
│ DETALLE DE INCIDENTES                   │
│ SERVICIO | DESCRIPCIÓN | TIEMPO | FUENTE/FECHA | IMPACTO │
│ ...filas de la tabla...                 │
├─────────────────────────────────────────┤
│ ANÁLISIS Y ACCIONES                     │
│ [mensaje]                               │
│ [⚠ banner naranja si action_required]   │
└─────────────────────────────────────────┘

#### Sección Resumen
- Total Incidentes: `summary.total` — si > 0 color rojo, si == 0 color verde
- Tiempo Promedio Recuperación: `summary.avg_recovery_formatted` — texto negro bold
- Servicios Afectados: `summary.services_affected` — texto negro bold

#### Sección Gráfico de torta
- Librería: Recharts PieChart
- Datos: `by_source` filtrado donde `count > 0`
- Colores: asignar dinámicamente desde un array de colores predefinidos
  por índice (no por nombre de fuente):
```typescript
  const CHART_COLORS = ['#4F81BD', '#70AD47', '#00B0F0', '#FF6B35',
                         '#9B59B6', '#E74C3C', '#F39C12', '#1ABC9C']
  // color = CHART_COLORS[index % CHART_COLORS.length]
```
- Leyenda al lado derecho con: nombre, count, porcentaje
  Formato: "Base de Datos  1 Incidente (33.3%)"
- Si `by_source` está vacío: mostrar mensaje "Sin incidentes registrados"
  en lugar del gráfico

#### Sección Tabla de detalle
Columnas exactas (mismo orden que la imagen):
1. SERVICIO — `incident.service`
2. DESCRIPCIÓN — `incident.description`
3. TIEMPO DE RECUPERACIÓN — `incident.recovery_formatted`
   - Color rojo si `impact_color === "red"` o `"orange"`
   - Color normal si `impact_color === "green"`
4. FUENTE DE LA FALLA — `incident.source` en negrita
   + `incident.date` formateado debajo en gris (formato: "YYYY-MM-DD HH:MM")
5. IMPACTO — badge con estilos:
Crítico → bg: #FEE2E2, text: #DC2626, border: #DC2626
Alto    → bg: #FFF7ED, text: #EA580C, border: #EA580C
Bajo    → bg: #F0FDF4, text: #16A34A, border: #16A34A

#### Sección Análisis y Acciones
- Mostrar `analysis.message` como texto normal
- Si `analysis.action_required === true`:
  Banner con fondo naranja claro, borde izquierdo naranja, ícono ⚠,
  texto "Acciones Requeridas" — exactamente como la imagen
- Si `analysis.action_required === false`:
  Banner con fondo verde claro, ícono ✓, texto "Sin acciones requeridas"

### NUEVO: `frontend/src/services/incidentService.ts`
```typescript
export async function fetchIncidents(projectId: string): Promise<IncidentResponse> {
  const res = await fetch(`/api/v1/projects/${projectId}/incidents`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
```

### NUEVO: `frontend/src/types/incident.ts`
Interfaces TypeScript que espejean exactamente el contrato JSON:
```typescript
export interface IncidentSummary {
  total: number
  avg_recovery_minutes: number
  avg_recovery_formatted: string
  services_affected: number
}

export interface IncidentBySource {
  source: string
  count: number
  percentage: number
}

export interface IncidentDetail {
  index: number
  service: string
  description: string
  mttr_minutes: number
  recovery_formatted: string
  source: string
  impact: 'Crítico' | 'Alto' | 'Bajo'
  impact_color: 'red' | 'orange' | 'green'
  date: string
}

export interface IncidentAnalysis {
  message: string
  action_required: boolean
}

export interface IncidentResponse {
  project_id: string
  summary: IncidentSummary
  by_source: IncidentBySource[]
  incidents: IncidentDetail[]
  analysis: IncidentAnalysis
}
```

### MODIFICAR: `frontend/src/store/dataStore.ts`
Agregar al store de Zustand:
```typescript
incidents: IncidentResponse | null
isLoadingIncidents: boolean
incidentError: string | null
fetchIncidents: (projectId: string) => Promise<void>
```

La acción `fetchIncidents` debe:
1. Setear `isLoadingIncidents: true`
2. Llamar a `incidentService.fetchIncidents(projectId)`
3. Guardar resultado en `incidents`
4. Setear `isLoadingIncidents: false`
5. En caso de error: guardar en `incidentError` y no romper el dashboard

---

## Casos borde

- Proyecto sin incidentes (todas las celdas IncN_* vacías):
  → total: 0, by_source: [], incidents: [], action_required: false
- IncN_MTTR_min vacío o no numérico:
  → omitir ese incidente del cálculo de promedio, MTTR = 0, impacto = Bajo
- IncN_Descripcion vacía:
  → mostrar "Sin descripción registrada"
- IncN_Fecha vacía o inválida:
  → mostrar "Fecha no registrada"
- IncN_Fuente vacía:
  → agrupar bajo categoría "Sin clasificar"
- Dos proyectos con el mismo nombre en el Excel:
  → tomar la primera fila encontrada y agregar warning en el log del backend
- project_id no coincide con ningún proyecto:
  → 404 con mensaje claro

---

## Escalabilidad

Cuando se migre de Excel a DB o API:
- Solo se modifica `data_repository.get_dataframe()` para ejecutar
  el query equivalente y retornar el mismo DataFrame
- `incident_parser.py` no cambia — opera sobre el DataFrame sin importar origen
- El contrato JSON del endpoint no cambia
- El frontend no toca nada

Cuando se agregue filtro por equipo/proyecto en el futuro:
- El `project_id` ya viene como parámetro del endpoint
- Solo se agrega un parámetro opcional `?team=alpha` al endpoint
  y un filtro adicional en el parser

---

## Criterios de aceptación

- [ ] La card del index muestra el total real de incidentes del Excel
- [ ] Al hacer clic se abre el modal sin errores
- [ ] El gráfico de torta refleja las fuentes reales del Excel (dinámico)
- [ ] Agregar una nueva fuente en el Excel la muestra en el gráfico sin cambiar código
- [ ] La tabla muestra todos los incidentes del proyecto activo
- [ ] Los tiempos en rojo solo cuando impacto es Crítico o Alto
- [ ] Los badges de impacto tienen el color correcto según MTTR
- [ ] El mensaje de análisis nombra correctamente la fuente con más incidentes
- [ ] Cambiar el Excel y recargar actualiza todo el modal automáticamente
- [ ] Proyecto sin incidentes muestra estado vacío sin errores
- [ ] El modal se cierra con el botón X y con clic fuera del modal

