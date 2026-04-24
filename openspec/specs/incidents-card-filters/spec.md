# Spec: Incidents Card — Resumen por Impacto + Filtros de Tabla

## Estado: ACTIVO
## Versión: 1.0.0
## Tipo: ADDITIVE — sin cambios a lógica de backend ni contrato de API
## Depende de: specs/incidents/spec.md (debe estar completo)

---

## Alcance estricto

PERMITIDO:
- Modificar la card de Incidentes en el dashboard (solo visual)
- Modificar IncidentModal.tsx — agregar filtros a la tabla
- Crear componente reutilizable de filtros de tabla
- Crear hook reutilizable useTableFilters

NO PERMITIDO:
- Modificar GET /api/v1/projects/{id}/incidents
- Modificar incident_parser.py
- Modificar los modelos Pydantic de incidentes
- Tocar el gráfico de torta, resumen de métricas ni análisis del modal

---

## Parte 1 — Card del dashboard: resumen por impacto

### Comportamiento
Al cargar el Excel y seleccionar un proyecto, la card muestra
inmediatamente el desglose por impacto sin clic adicional.
Los números se derivan de los datos ya en el store de Zustand
— sin llamada extra al backend.

### Cálculo del desglose (frontend, desde el store)
Los incidentes ya tienen `impact` calculado por el backend
según MTTR. El frontend agrupa:

```typescript
const impactCounts = incidents.reduce((acc, inc) => {
  acc[inc.impact] = (acc[inc.impact] || 0) + 1
  return acc
}, {} as Record<string, number>)

// Resultado: { "Crítico": 3, "Alto": 2, "Bajo": 1 }
```

### Diseño de la card actualizada
┌─────────────────────────────────────┐
│ ⚠ Incidentes                        │
│                                     │
│  Totales          8                 │
│                                     │
│  Críticos    Altos    Bajos         │
│  [rojo] 3   [narj] 2  [vrd] 3       │
│                                     │
│       Click para ver detalle        │
└─────────────────────────────────────┘

Especificaciones visuales:
- "Totales: N" — número grande, color según severidad dominante:
    si hay Críticos > 0 → rojo (#DC2626)
    si hay Altos > 0 pero Críticos = 0 → naranja (#EA580C)
    si solo Bajos o cero → verde (#16A34A)
- Fila de desglose: tres columnas con label pequeño y número
    Críticos → número en rojo (#DC2626)
    Altos    → número en naranja (#EA580C)
    Bajos    → número en verde (#16A34A)
- Si un nivel tiene 0: se muestra "0" en gris, no se oculta
- Sin incidentes: los tres valores en "0" en gris, total en verde
- "Click para ver detalle" — texto pequeño gris en el footer

### Escalabilidad — niveles de alerta futuros
El desglose usa `Record<string, number>` — no está hardcodeado
para exactamente 3 niveles. Cuando lleguen niveles 4 y 5,
el backend los devuelve en el campo `impact` y el frontend
los muestra automáticamente.

Para controlar el orden de visualización, agregar al config:

```typescript
// frontend/src/config/impactLevels.ts
export const IMPACT_LEVELS: ImpactLevel[] = [
  { key: 'Crítico',  color: '#DC2626', bgColor: '#FEE2E2', order: 1 },
  { key: 'Alto',     color: '#EA580C', bgColor: '#FFF7ED', order: 2 },
  { key: 'Bajo',     color: '#16A34A', bgColor: '#F0FDF4', order: 3 },
  // Futuro:
  // { key: 'Nivel 4', color: '#7C3AED', bgColor: '#F5F3FF', order: 4 },
  // { key: 'Nivel 5', color: '#1D4ED8', bgColor: '#EFF6FF', order: 5 },
]
```

El componente de la card lee de este config para ordenar
y colorear los niveles. Agregar un nivel nuevo = agregar
una línea al array. Sin tocar el componente.

---

## Parte 2 — Modal: filtros de la tabla Detalle de Incidentes

### Comportamiento general
Todo el modal queda exactamente igual excepto la tabla
"Detalle de Incidentes". Encima de esa tabla, a la derecha,
aparece el sistema de filtros. La tabla reacciona
instantáneamente al cambiar cualquier filtro — sin llamada
al backend, filtrando el array `incidents` que ya está
en memoria.

### Los tres ejes de filtro

**Eje 1 — Nivel de Impacto** (toggle pills)
Valores posibles: los que existan en los datos actuales.
Se generan dinámicamente desde los incidentes del proyecto.
No hardcodeados — si en el futuro hay "Nivel 4", aparece solo.

```typescript
const availableImpacts = [...new Set(incidents.map(i => i.impact))]
  .sort((a, b) => getImpactOrder(a) - getImpactOrder(b))
// ["Crítico", "Alto", "Bajo"]
```

**Eje 2 — Servicio** (toggle pills o dropdown si > 5 servicios)
Valores: servicios únicos en los incidentes del proyecto.

```typescript
const availableServices = [...new Set(incidents.map(i => i.service))]
  .sort()
// ["App Móvil", "E-commerce", "Portal Clientes"]
```

**Eje 3 — Fuente** (toggle pills o dropdown si > 5 fuentes)
Valores: fuentes únicas en los incidentes del proyecto.

```typescript
const availableSources = [...new Set(incidents.map(i => i.source))]
  .sort()
// ["API Gateway", "Base de Datos", "Error Operativo", "Servidor Web"]
```

Regla de visualización:
- ≤ 5 opciones → toggle pills horizontales
- > 5 opciones → dropdown multiselect
Esto evita que el área de filtros crezca sin control
cuando haya muchos servicios o fuentes.

### Lógica de filtrado combinado

```typescript
const filteredIncidents = incidents.filter(incident => {
  const matchImpact  = activeImpacts.length === 0
    || activeImpacts.includes(incident.impact)

  const matchService = activeServices.length === 0
    || activeServices.includes(incident.service)

  const matchSource  = activeSources.length === 0
    || activeSources.includes(incident.source)

  return matchImpact && matchService && matchSource
})
```

Regla: array vacío = "todos seleccionados" = sin filtro activo.
Esto es el patrón estándar — más limpio que tener "Todos"
como opción explícita que hay que mantener sincronizada.

### Diseño de la sección de filtros
DETALLE DE INCIDENTES                    [filtros ▼ / ▲ toggle]
──────────────────────────────────────────────────────────────
Impacto:  [Crítico ×] [Alto] [Bajo]
Servicio: [App Móvil ×] [E-commerce] [Portal Clientes]
Fuente:   [Base de Datos ×] [API Gateway] [Error Operativo] [Servidor Web]
[Limpiar filtros]
──────────────────────────────────────────────────────────────
Mostrando 1 de 4 incidentes

Especificaciones visuales:
- Área de filtros colapsable (toggle "filtros ▼/▲") para no
  ocupar espacio innecesario si el usuario no los necesita
- Por defecto: expandida la primera vez que se abre el modal
- Estado recordado durante la sesión del modal
- Pill activo: fondo del color del nivel + texto blanco + [×]
    Crítico activo → fondo rojo, texto blanco
    Alto activo    → fondo naranja, texto blanco
    Bajo activo    → fondo verde, texto blanco
    Servicio/Fuente activos → fondo azul oscuro (#1F3864), texto blanco
- Pill inactivo: fondo gris claro, texto gris oscuro, sin ×
- "Limpiar filtros": aparece solo si hay al menos un filtro activo
  Al hacer clic: resetea los tres ejes simultáneamente
- Contador: "Mostrando N de M incidentes" — actualiza en tiempo real
- Si filteredIncidents.length === 0: mostrar en la tabla
  "Sin incidentes que coincidan con los filtros seleccionados"
  con botón "Limpiar filtros"

---

## Archivos a crear/modificar

### NUEVO: `frontend/src/config/impactLevels.ts`

```typescript
export interface ImpactLevel {
  key: string
  color: string        // texto y borde
  bgColor: string      // fondo del badge/pill
  bgColorActive: string// fondo cuando el pill está activo en filtros
  order: number        // para ordenar de mayor a menor severidad
}

export const IMPACT_LEVELS: ImpactLevel[] = [
  {
    key: 'Crítico',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    bgColorActive: '#DC2626',
    order: 1
  },
  {
    key: 'Alto',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    bgColorActive: '#EA580C',
    order: 2
  },
  {
    key: 'Bajo',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    bgColorActive: '#16A34A',
    order: 3
  },
]

// Función helper usada en toda la app para obtener el color de un nivel
export function getImpactLevel(key: string): ImpactLevel {
  return IMPACT_LEVELS.find(l => l.key === key) ?? {
    key,
    color: '#6B7280',
    bgColor: '#F9FAFB',
    bgColorActive: '#6B7280',
    order: 99
  }
}

// Orden para sort
export function getImpactOrder(key: string): number {
  return getImpactLevel(key).order
}
```

### NUEVO: `frontend/src/hooks/useTableFilters.ts`

Hook genérico reutilizable para cualquier tabla filtrable
en la aplicación. No es específico de incidentes.

```typescript
interface FilterConfig<T> {
  data: T[]
  filterDefs: {
    key: string           // nombre del eje de filtro
    getValue: (item: T) => string  // cómo extraer el valor del item
    sortOrder?: (a: string, b: string) => number  // orden de las opciones
  }[]
}

interface FilterState {
  [key: string]: string[]  // eje → valores activos
}

interface UseTableFiltersResult<T> {
  filteredData: T[]
  filterState: FilterState
  availableOptions: Record<string, string[]>
  toggleFilter: (key: string, value: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  activeCount: number       // total de filtros activos
  resultCount: number       // items después de filtrar
  totalCount: number        // items sin filtrar
}

export function useTableFilters<T>(config: FilterConfig<T>): UseTableFiltersResult<T>
```

Este hook se reutiliza en:
- Tabla de Detalle de Incidentes (este spec)
- Tabla de Servicios de Negocio (spec anterior)
- Tabla de Resiliencia (spec futuro)
- Cualquier tabla nueva que necesite filtros

### NUEVO: `frontend/src/components/shared/TableFilterBar.tsx`

Componente visual del área de filtros. Genérico — no sabe
que está filtrando incidentes. Recibe los datos del hook.

```typescript
interface TableFilterBarProps {
  filterDefs: {
    key: string
    label: string              // "Impacto" | "Servicio" | "Fuente"
    maxPills?: number          // default 5 — si hay más, usa dropdown
    getColor?: (value: string) => string  // color dinámico por valor
  }[]
  filterState: FilterState
  availableOptions: Record<string, string[]>
  onToggle: (key: string, value: string) => void
  onClear: () => void
  hasActiveFilters: boolean
  resultCount: number
  totalCount: number
  defaultExpanded?: boolean    // default true
}
```

Subcomponentes internos (no exportados):
- `FilterPill` — pill individual activo/inactivo
- `FilterDropdown` — dropdown multiselect para > 5 opciones
- `FilterSection` — un eje de filtro completo (label + pills)
- `FilterHeader` — "DETALLE DE INCIDENTES [filtros ▼/▲]"
- `FilterSummary` — "Mostrando N de M incidentes"

### MODIFICAR: `frontend/src/components/incidents/IncidentModal.tsx`

Solo modificar la sección de la tabla. Todo lo demás intacto.

Agregar encima de la tabla:

```typescript
const filters = useTableFilters({
  data: incidents,
  filterDefs: [
    {
      key: 'impact',
      getValue: (inc) => inc.impact,
      sortOrder: (a, b) => getImpactOrder(a) - getImpactOrder(b)
    },
    {
      key: 'service',
      getValue: (inc) => inc.service,
    },
    {
      key: 'source',
      getValue: (inc) => inc.source,
    }
  ]
})

// La tabla usa filters.filteredData en lugar de incidents directamente
// El resto del modal (gráfico, resumen, análisis) sigue usando incidents
```

```typescript
<TableFilterBar
  filterDefs={[
    {
      key: 'impact',
      label: 'Impacto',
      getColor: (value) => getImpactLevel(value).bgColorActive
    },
    { key: 'service', label: 'Servicio', maxPills: 5 },
    { key: 'source',  label: 'Fuente',   maxPills: 5 }
  ]}
  filterState={filters.filterState}
  availableOptions={filters.availableOptions}
  onToggle={filters.toggleFilter}
  onClear={filters.clearFilters}
  hasActiveFilters={filters.hasActiveFilters}
  resultCount={filters.resultCount}
  totalCount={filters.totalCount}
/>

{/* Tabla usa filteredData, no incidents */}
<IncidentTable incidents={filters.filteredData} />
```

IMPORTANTE: El gráfico de torta, el resumen de métricas y el
análisis NO se ven afectados por los filtros de la tabla.
Siempre muestran el total real del proyecto.

### MODIFICAR: `frontend/src/components/incidents/IncidentCard.tsx`

Agregar el desglose por impacto debajo del total.

```typescript
// Datos del store — ya están en memoria
const incidentData = useDataStore(s => s.incidents)
const incidents = incidentData?.incidents ?? []

// Desglose por impacto — ordenado por severidad
const impactCounts = IMPACT_LEVELS.map(level => ({
  ...level,
  count: incidents.filter(i => i.impact === level.key).length
}))

// Color del total según severidad dominante
const dominantColor = impactCounts.find(l => l.count > 0)?.color ?? '#16A34A'
```

---

## Casos borde

- Todos los incidentes son del mismo nivel (ej: todos Críticos):
  Los otros niveles muestran 0 en gris — no se ocultan
- Filtro activo que deja 0 resultados:
  Tabla muestra "Sin incidentes que coincidan" + botón limpiar
  El contador muestra "Mostrando 0 de N incidentes"
- Proyecto sin incidentes:
  Los tres niveles muestran 0 en gris en la card
  El área de filtros no aparece en el modal (no hay qué filtrar)
  La tabla muestra el estado vacío existente
- Usuario filtra por Impacto=Crítico mientras el modal está abierto:
  El gráfico de torta NO cambia — sigue mostrando todos
  Solo la tabla se actualiza
- Modal cerrado y reabierto:
  Los filtros se resetean al estado inicial (sin filtros activos)
  El área de filtros aparece expandida por defecto

---

## Escalabilidad — niveles 4 y 5 de alerta

Cuando el backend empiece a devolver "Nivel 4" y "Nivel 5"
en el campo `impact`:

1. Agregar dos entradas a `IMPACT_LEVELS` en `impactLevels.ts`
2. El backend ya devuelve el campo `impact` como string libre
3. La card del dashboard los muestra automáticamente en orden
4. Los filtros del modal los incluyen automáticamente
5. Los badges de la tabla los colorean con el color del nuevo nivel
6. CERO cambios al hook `useTableFilters`
7. CERO cambios al componente `TableFilterBar`
8. CERO cambios al backend

---

## Orden de implementación
1 frontend/src/config/impactLevels.ts base de todo — colores, orden, helper functions
2 frontend/src/hooks/useTableFilters.ts lógica genérica de filtrado
3 frontend/src/components/shared/TableFilterBar.tsx visual de los filtros
4 frontend/src/components/incidents/IncidentCard.tsx agregar desglose por impacto (modifica existente)
5 frontend/src/components/incidents/IncidentModal.tsx agregar filtros a la tabla (modifica existente)

El paso 1 no depende de nada.
Los pasos 2 y 3 no dependen del backend — se pueden desarrollar
en paralelo con cualquier otro trabajo.
Los pasos 4 y 5 requieren que 1, 2 y 3 estén listos.

---

## Criterios de aceptación

### Card del dashboard
- [ ] Muestra Total de incidentes con color según severidad dominante
- [ ] Muestra desglose Críticos / Altos / Bajos con colores correctos
- [ ] Si un nivel tiene 0: muestra "0" en gris, no lo oculta
- [ ] Sin incidentes: todo en 0, total en verde
- [ ] Al cambiar proyecto en selector global, los números se actualizan

### Modal — filtros de tabla
- [ ] Área de filtros aparece encima de la tabla, alineada a la derecha
- [ ] Está expandida por defecto al abrir el modal
- [ ] Toggle ▼/▲ colapsa y expande el área de filtros
- [ ] Impacto muestra los niveles disponibles en orden de severidad
- [ ] Servicio muestra los servicios únicos del proyecto
- [ ] Fuente muestra las fuentes únicas del proyecto
- [ ] Si > 5 opciones en un eje: muestra dropdown, no pills
- [ ] Clic en pill inactivo lo activa y filtra la tabla
- [ ] Clic en pill activo lo desactiva y quita ese filtro
- [ ] Filtros de distintos ejes son combinables (AND entre ejes)
- [ ] Múltiples valores del mismo eje son combinables (OR dentro del eje)
- [ ] "Limpiar filtros" aparece solo si hay filtros activos
- [ ] "Limpiar filtros" resetea los tres ejes a la vez
- [ ] Contador "Mostrando N de M" actualiza en tiempo real
- [ ] 0 resultados muestra mensaje + botón limpiar en la tabla
- [ ] Gráfico de torta NO cambia al filtrar
- [ ] Resumen de métricas NO cambia al filtrar
- [ ] Análisis y Acciones NO cambia al filtrar
- [ ] Cerrar y reabrir el modal resetea los filtros
- [ ] Agregar nivel de impacto nuevo en config → aparece automáticamente


### Rendimiento
- [ ] El hook `useTableFilters` recálcula solo cuando `data` cambia
- [ ] Las opciones disponibles se memoizan por eje
- [ ] Filtrado en tiempo real, sin lag visible en tablas de hasta 500 filas
- [ ] No hay re-renders innecesarios en componentes hijos