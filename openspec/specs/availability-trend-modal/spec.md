# Spec: Availability Global Modal — Diseño y Filtros de Tendencia

## Estado: ACTIVO
## Versión: 1.0.0
## Tipo: UI + nuevo endpoint — CERO cambios a lógica existente
## Depende de: specs/availability/spec.md (debe estar completo)
## Deadline: 3 días — prueba con usuarios reales

---

## Alcance estricto

PERMITIDO en este spec:
- Rediseñar el modal de Disponibilidad Global (solo frontend)
- Crear endpoint GET /api/v1/projects/{id}/availability/trend (nuevo)
- Crear componentes reutilizables de filtro de tiempo y gráfica

NO PERMITIDO en este spec:
- Modificar GET /api/v1/projects/{id}/availability
- Modificar availability_parser.py
- Modificar la card de Disponibilidad Global en el dashboard
- Modificar ServiceDetailModal.tsx
- Tocar ningún cálculo de promedios existente

---

## Nuevo endpoint

### GET /api/v1/projects/{project_id}/availability/trend

Query params:
  period = "6m" | "3m" | "day"    (default: "6m")
  slot   = "0-6" | "6-12" | "12-18" | "18-24"  (solo cuando period="day")
  type   = string opcional — filtra por tipo de componente
           ej: "Base de Datos" | "SO Linux" | "Capa Media" | "SO Windows"
           Si no viene: devuelve el consolidado global

### Lógica por período en el backend

```python
def get_trend(project_id, period, slot=None, component_type=None):
    """
    Abstracción de fuente de datos — este método es el único
    que cambia cuando se migra de Excel a API/DB real.
    """
    if period == "6m":
        return build_monthly_trend(project_id, months=6, component_type)
    elif period == "3m":
        return build_monthly_trend(project_id, months=3, component_type)
    elif period == "day":
        return build_intraday_trend(project_id, slot, component_type)
```

### Comportamiento MVP (Excel con un solo mes de datos)

**period=6m y period=3m:**
El backend genera los meses anteriores con variación controlada
alrededor del valor real del mes del Excel.
Esto está documentado como comportamiento MVP explícito.
Cuando haya múltiples meses reales en el Excel o en la DB,
`build_monthly_trend` los usa automáticamente sin cambiar el contrato.

```python
def build_monthly_trend(project_id, months, component_type=None):
    real_availability = get_real_availability(project_id, component_type)
    real_month = get_report_month(project_id)
    result = []

    for i in range(months - 1, 0, -1):
        month = real_month - relativedelta(months=i)
        variation = random.uniform(-0.8, 0.8)
        value = round(max(85.0, min(100.0, real_availability + variation)), 2)
        result.append({
            "label": month.strftime("%b %Y"),  # "Ago 2024"
            "value": value,
            "meets_target": value >= project_meta,
            "is_simulated": True   # flag explícito para el frontend
        })

    # Último punto: dato real
    result.append({
        "label": real_month.strftime("%b %Y"),
        "value": real_availability,
        "meets_target": real_availability >= project_meta,
        "is_simulated": False
    })
    return result
```

**period=day:**
MVP: genera 4 puntos (uno por franja) con variación mínima (±0.1%)
alrededor del valor real. Cuando lleguen datos intradiarios reales
vía API, `build_intraday_trend` los usa sin cambiar el contrato.

```python
SLOTS = {
    "0-6":   "12:00am–6:00am",
    "6-12":  "6:00am–12:00pm",
    "12-18": "12:00pm–6:00pm",
    "18-24": "6:00pm–12:00am"
}

def build_intraday_trend(project_id, slot, component_type=None):
    real_availability = get_real_availability(project_id, component_type)
    if slot:
        # Devuelve solo la franja solicitada
        variation = random.uniform(-0.1, 0.1)
        value = round(max(85.0, min(100.0, real_availability + variation)), 2)
        return [{
            "label": SLOTS[slot],
            "value": value,
            "meets_target": value >= project_meta,
            "is_simulated": True
        }]
    else:
        # Sin slot: devuelve las 4 franjas del día
        return [build_slot(real_availability, s) for s in SLOTS]
```

### Contrato de respuesta — mismo formato para todos los períodos
### Es un ejemplo de como debe ser la respuesta del frontend y el backend
### No tomar como real los datos, son solo para el ejemplo
### el "type" solo es un ejemplo para pruebas, mas adelante se reemplazara por el filtro real de tipos de componentes
### el "meta" es el objetivo de disponibilidad para el proyecto
### el "current_value" es el valor actual de disponibilidad para el proyecto
### el "data_points" es el array de puntos de disponibilidad para el proyecto

```json
{
  "project_id": "claro-red-core",
  "period": "6m",
  "slot": null,
  "component_type": "Base de Datos",
  "meta": 99.5,
  "current_value": 88.47,
  "data_points": [
    {
      "label": "Ago 2024",
      "value": 87.80,
      "meets_target": false,
      "is_simulated": true
    },
    {
      "label": "Sep 2024",
      "value": 88.20,
      "meets_target": false,
      "is_simulated": true
    },
    {
      "label": "Oct 2024",
      "value": 87.60,
      "meets_target": false,
      "is_simulated": true
    },
    {
      "label": "Nov 2024",
      "value": 88.90,
      "meets_target": false,
      "is_simulated": true
    },
    {
      "label": "Dic 2024",
      "value": 87.40,
      "meets_target": false,
      "is_simulated": true
    },
    {
      "label": "Ene 2025",
      "value": 88.47,
      "meets_target": false,
      "is_simulated": false
    }
  ],
  "by_type_summary": [
    { "type": "Base de Datos", "avg": 88.47 },
    { "type": "SO Linux",      "avg": 91.03 },
    { "type": "Capa Media",    "avg": 88.98 },
    { "type": "SO Windows",    "avg": 92.80 } 
  ]
}
```

El campo `is_simulated: true` permite al frontend mostrar
un indicador sutil (ej: asterisco o tooltip) avisando que
ese punto es estimado y no dato real. Esto es transparencia
hacia el usuario, no un bug.

---

## Backend — archivos a crear

### NUEVO: `backend/app/routers/availability_trend.py`

```python
@router.get("/projects/{project_id}/availability/trend")
async def get_availability_trend(
    project_id: str,
    period: str = Query("6m", regex="^(6m|3m|day)$"),
    slot: Optional[str] = Query(None, regex="^(0-6|6-12|12-18|18-24)$"),
    type: Optional[str] = Query(None)
):
    # Validar que slot solo viene cuando period=day
    if slot and period != "day":
        raise HTTPException(400, "slot solo es válido cuando period=day")

    df = data_repository.get_components_dataframe()
    incidents_df = data_repository.get_dataframe()
    return trend_builder.build(project_id, period, slot, type, df, incidents_df)
```

### NUEVO: `backend/app/services/trend_builder.py`

Clase/módulo con la lógica de construcción de tendencia.
Separado de availability_parser.py para cumplir
Single Responsibility y facilitar el reemplazo futuro.

Métodos públicos:
- `build(project_id, period, slot, component_type, df, incidents_df) → dict`
- `build_monthly_trend(project_id, months, component_type, df) → list`
- `build_intraday_trend(project_id, slot, component_type, df) → list`
- `get_real_availability(project_id, component_type, df) → float`
- `get_project_meta(project_id, df) → float`
- `get_by_type_summary(project_id, df) → list`

### NUEVO: `backend/app/models/trend.py`

```python
class TrendPoint(BaseModel):
    label: str
    value: float
    meets_target: bool
    is_simulated: bool

class ByTypeSummary(BaseModel):
    type: str
    avg: float

class TrendResponse(BaseModel):
    project_id: str
    period: str               # "6m" | "3m" | "day"
    slot: Optional[str]       # "0-6" | "6-12" | "12-18" | "18-24" | null
    component_type: Optional[str]
    meta: float
    current_value: float
    data_points: list[TrendPoint]
    by_type_summary: list[ByTypeSummary]
```

### MODIFICAR: `backend/app/main.py`
Registrar el nuevo router:
```python
from app.routers import availability_trend
app.include_router(availability_trend.router, prefix="/api/v1")
```

---

## Frontend — archivos a crear

### NUEVO: `frontend/src/hooks/useAvailabilityTrend.ts`

Hook reutilizable que encapsula toda la lógica de fetching
del endpoint de tendencia. Cualquier componente que necesite
datos de tendencia lo importa — no duplica lógica.

```typescript
interface UseTrendParams {
  projectId: string
  period: '6m' | '3m' | 'day'
  slot?: '0-6' | '6-12' | '12-18' | '18-24'
  componentType?: string
}

interface UseTrendResult {
  data: TrendResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useAvailabilityTrend(params: UseTrendParams): UseTrendResult {
  // Llama al endpoint cuando cambian los params
  // Cancela requests anteriores si los params cambian rápido (AbortController)
  // Maneja loading y error states
}
```

Este hook se reutiliza en:
- AvailabilityGlobalModal (este spec)
- ServiceDetailModal (spec anterior — se migra para usar el mismo hook)
- Cualquier nueva sección futura que necesite tendencia

### NUEVO: `frontend/src/components/shared/PeriodToggle.tsx`

Componente reutilizable de selección de período.
Se instancia en cualquier modal que necesite filtro de tiempo.

```typescript
interface PeriodToggleProps {
  value: '6m' | '3m' | 'day'
  onChange: (period: '6m' | '3m' | 'day') => void
  disabled?: boolean
}
```

Visual — tabs/pills horizontales (mismo estilo que ComponentTypeTabs):
┌──────┬──────┬──────┐
│  6M  │  3M  │ HOY  │
└──────┴──────┴──────┘
activo:   fondo azul, texto blanco, mismo estilo visual que
          los tabs de "Base de Datos | Capa Media | SO Linux" (los tabs no deben ser hardcodeados deben ser dinamicos segun el tipo de componente disponible que tenga el proyecto)
inactivo: sin fondo, texto gris, borde sutil
separador: línea vertical entre pills

### NUEVO: `frontend/src/components/shared/SlotSelector.tsx`

Componente reutilizable que aparece SOLO cuando period="day".
Animación de entrada suave (fade in) al aparecer.

```typescript
interface SlotSelectorProps {
  value: '0-6' | '6-12' | '12-18' | '18-24' | 'all'
  onChange: (slot: string) => void
}
```

Visual — 4 pills + opción "Todo el día":
┌──────┬──────┬──────┬──────┬───────┐
│ 12am │ 6am  │ 12pm │ 6pm  │ ALL   │
└──────┴──────┴──────┴──────┴───────┘
activo: fondo verde con check ✅
inactivo: borde gris, sin relleno

Tooltip en cada pill explicando qué representa la franja.

### NUEVO: `frontend/src/components/shared/TrendChart.tsx`

Componente de gráfica reutilizable basado en Recharts LineChart.
Es el mismo gráfico que usa la imagen enviada(La grafica que se usa en Tendencia de disponibilidad por Servicios) — línea roja con
puntos, línea punteada de meta, labels en cada punto, el gráfico debe ser responsivo.

```typescript
interface TrendChartProps {
  dataPoints: TrendPoint[]
  meta: number
  height?: number           // default: 280
  showSimulatedBadge?: boolean  // muestra (*) en puntos simulados
  color?: string            // default: #DC2626 (rojo)
  metaColor?: string        // default: #DC2626 línea punteada
}
```

Características visuales (replicar imagen exactamente):
- Línea continua con puntos circulares en cada dato
- Label del valor encima de cada punto (ej: "91.30%")
- Línea punteada horizontal en el valor de meta
- Eje X: labels de meses o franjas horarias
- Eje Y: rango dinámico — min(valores)-1% hasta 100%
- Si is_simulated: true, el punto muestra tooltip "Dato estimado (MVP)"
- Color de línea: rojo si no cumple meta, verde si cumple
- Grid horizontal sutil

Este componente reemplaza cualquier gráfica de tendencia
ya implementada en ServiceDetailModal — misma lógica, mismo look.

### NUEVO: `frontend/src/components/shared/ComponentTypeTabs.tsx`

Tabs de tipo de componente reutilizables (como en la imagen:
"Base de Datos | Capa Media | SO Linux").
Reemplaza cualquier implementación ad-hoc en ServiceDetailModal.

```typescript
interface ComponentTypeTabsProps {
  types: string[]           // ["Base de Datos", "SO Linux", "Capa Media"]
  activeType: string
  onTypeChange: (type: string) => void
  summary: ByTypeSummary[]  // para mostrar avg debajo del tab activo
}
```

Visual (replicar imagen):
- Tab activo: fondo azul, texto blanco, borde bottom azul
- Tab inactivo: sin fondo, texto gris
- Debajo del tab activo: "avg: 88.47%" en texto pequeño
- Si solo hay un tipo: no renderiza nada (null)

### NUEVO: `frontend/src/components/availability/AvailabilityGlobalModal.tsx`

Modal completo rediseñado. Reemplaza el modal actual que no tiene diseño.

#### Layout completo del modal:
┌─────────────────────────────────────────────────────────┐
│ Tendencia de Disponibilidad Global              [X]     │
│ Portal Bancolombia · Enero 2025                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DISPONIBILIDAD ACTUAL        META          ESTADO      │
│  [grande, color por estado]   99.5%         ✓ Cumple    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Por tipo de componente:                                │
│  [ Base de Datos ] [ SO Linux ] [ Capa Media ]          │
│   avg: 88.47%                                           │
├─────────────────────────────────────────────────────────┤
│  DETALLE: BASE DE DATOS    Componentes:                 │
│  91.30%  [rojo]            MongoDB 6.0: 91.3%  [pill]   │
│                            Oracle RAC: 88.5%   [pill]   │
├─────────────────────────────────────────────────────────┤
│  Período:  [ 6M ] [ 3M ] [ HOY ]                       │
│  (si HOY): [ Todo el día | 12am-6am | 6am-12pm | ... ] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Gráfica TrendChart — línea con puntos]                │
│                                                         │
│  100.0% ·····································meta        │
│                                                         │
│   91.0% ●────●────●────●────●────●                     │
│                                                         │
│  Ago 24  Sep 24  Oct 24  Nov 24  Dic 24  Ene 25        │
│                                                         │
│  * Los puntos anteriores al mes actual son estimados    │
│    basados en el dato real disponible (MVP)             │
└─────────────────────────────────────────────────────────┘

#### Lógica del componente:

```typescript
export function AvailabilityGlobalModal({ projectId, onClose }) {
  const [period, setPeriod]   = useState<'6m'|'3m'|'day'>('6m')
  const [slot, setSlot]       = useState<string | undefined>(undefined)
  const [activeType, setActiveType] = useState<string | undefined>(undefined)

  // Hook reutilizable — se llama cuando cambian period, slot o activeType
  const { data, isLoading, error } = useAvailabilityTrend({
    projectId,
    period,
    slot: period === 'day' ? slot : undefined,
    componentType: activeType
  })

  // Cuando llegan los datos, inicializar activeType con el primer tipo
  useEffect(() => {
    if (data?.by_type_summary?.length && !activeType) {
      setActiveType(data.by_type_summary[0].type)
    }
  }, [data])

  // Cuando el usuario cambia de tipo: nueva llamada al hook
  // Cuando el usuario cambia de período: nueva llamada al hook
  // El hook maneja el AbortController internamente
}
```

#### Sección de detalle del tipo activo:

Debajo de los tabs de componente, mostrar:
- Porcentaje promedio del tipo activo en grande y en color
- Lista de componentes individuales como pills/badges:
  `MongoDB 6.0: 91.3%` — color rojo si < meta, verde si >= meta
- Si hay más de 5 componentes: mostrar 5 y botón "Ver todos (+N)"

#### Estados de la gráfica:
Loading:  skeleton de la gráfica (mismo tamaño, animación pulse)
Error:    "No se pudieron cargar los datos de tendencia. [Reintentar]"
Vacío:    "Sin datos para el período seleccionado"
HOY sin datos intradiarios reales:
Mostrar la gráfica simulada con banner amarillo:
"⚠ Los datos intradiarios estarán disponibles cuando el
sistema reciba información en tiempo real vía API"

### NUEVO: `frontend/src/services/trendService.ts`

```typescript
export interface TrendParams {
  projectId: string
  period: '6m' | '3m' | 'day'
  slot?: string
  componentType?: string
}

export async function fetchTrend(
  params: TrendParams,
  signal?: AbortSignal
): Promise<TrendResponse> {
  const url = new URL(
    `/api/v1/projects/${params.projectId}/availability/trend`,
    window.location.origin
  )
  if (params.period)        url.searchParams.set('period', params.period)
  if (params.slot)          url.searchParams.set('slot', params.slot)
  if (params.componentType) url.searchParams.set('type', params.componentType)

  const res = await fetch(url.toString(), { signal })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
```

### NUEVO: `frontend/src/types/trend.ts`

```typescript
export interface TrendPoint {
  label: string
  value: number
  meets_target: boolean
  is_simulated: boolean
}

export interface ByTypeSummary {
  type: string
  avg: number
}

export interface TrendResponse {
  project_id: string
  period: '6m' | '3m' | 'day'
  slot: string | null
  component_type: string | null
  meta: number
  current_value: number
  data_points: TrendPoint[]
  by_type_summary: ByTypeSummary[]
}
```

---

## Componentes compartidos — dónde se reusan

| Componente            | Este modal | ServiceDetailModal | Futuro SLA | Futuro Resiliencia |
|-----------------------|-----------|-------------------|------------|-------------------|
| `TrendChart`          | ✓         | migrar a este      | ✓          | ✓                 |
| `PeriodToggle`        | ✓         | ✓                 | ✓          | ✓                 |
| `SlotSelector`        | ✓         | ✓                 | ✓          | ✓                 |
| `ComponentTypeTabs`   | ✓         | migrar a este      | —          | —                 |
| `useAvailabilityTrend`| ✓         | migrar a este      | —          | —                 |

ServiceDetailModal debe migrar a usar estos componentes shared
en lugar de sus implementaciones propias. Esto es una refactorización
de frontend puro — sin tocar el backend.

---

## Casos borde

- period=day + sin slot: mostrar las 4 franjas en el eje X
- period=day + slot seleccionado: mostrar solo esa franja,
  el resto del día en gris como contexto
- Tipo de componente que no existe en el proyecto:
  endpoint devuelve 404 con mensaje claro, el tab no aparece
- Cambio rápido de filtros (usuario hace clic varias veces):
  AbortController cancela el request anterior, solo procesa el último
- Modal abierto + usuario cambia proyecto en selector global:
  el modal se cierra automáticamente (efecto en el componente padre)
- Excel con disponibilidad = 100%: la gráfica muestra
  rango 99.0%–100.1% para que la línea no quede pegada al tope

---

## Escalabilidad — migración a datos reales

Cuando los datos intradiarios lleguen vía API real, el único
cambio es en `trend_builder.py`:

```python
def build_intraday_trend(project_id, slot, component_type):
    # ANTES (MVP):
    # return generate_simulated_slots(real_availability)

    # DESPUÉS (datos reales):
    # return query_monitoring_api(project_id, slot, component_type)
    pass
```

El contrato JSON no cambia.
El hook `useAvailabilityTrend` no cambia.
El componente `TrendChart` no cambia.
El componente `SlotSelector` ya existe y está listo.

---

## Orden de implementación
1 frontend/src/types/trend.ts
2 frontend/src/services/trendService.ts
3 backend/app/models/trend.py
4 backend/app/services/trend_builder.py
5 backend/app/routers/availability_trend.py
6 backend/app/main.py  → registrar router
7 frontend/src/hooks/useAvailabilityTrend.ts
8 frontend/src/components/shared/TrendChart.tsx
9 frontend/src/components/shared/PeriodToggle.tsx
10 frontend/src/components/shared/SlotSelector.tsx
11 frontend/src/components/shared/ComponentTypeTabs.tsx
12 frontend/src/components/availability/AvailabilityGlobalModal.tsx
13 Migrar ServiceDetailModal.tsx a usar componentes shared (paso 8-11)


Los pasos 1–6 son backend. Los pasos 7–12 son frontend nuevos.
El paso 13 es refactorización — no agrega funcionalidad,
solo consolida los componentes compartidos.

---

## Criterios de aceptación

- [ ] Modal de Disponibilidad Global tiene diseño claro y completo
- [ ] Botones 6M | 3M | HOY visibles y funcionales
- [ ] Al seleccionar HOY aparece el selector de franjas horarias
- [ ] Gráfica se actualiza al cambiar período sin recargar la página
- [ ] Tabs de tipo de componente funcionan y actualizan la gráfica
- [ ] Detalle del tipo activo muestra avg y componentes individuales como pills
- [ ] Puntos simulados tienen indicador visual y tooltip explicativo
- [ ] Loading state muestra skeleton de la gráfica
- [ ] Error state tiene botón de reintento
- [ ] Cambios rápidos de filtro no generan requests duplicados (AbortController)
- [ ] TrendChart, PeriodToggle, SlotSelector funcionan en ServiceDetailModal
- [ ] Modal se cierra cuando cambia el proyecto seleccionado globalmente
- [ ] CERO cambios al endpoint GET /api/v1/projects/{id}/availability
- [ ] CERO cambios a availability_parser.py

