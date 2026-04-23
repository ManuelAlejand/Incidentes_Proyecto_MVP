# Spec: Response Times Card

## Estado: ACTIVO
## Versión: 1.0.0
## Depende de: specs/excel-ingestion/spec.md

---

## Objetivo

Mostrar una card no interactiva con los tiempos de respuesta MTTR y MTBF
del proyecto actualmente seleccionado en el selector global del dashboard.
La card se actualiza automáticamente cuando cambia el proyecto seleccionado.
No tiene modal ni clic de detalle — es solo visualización de resumen.

---

## Comportamiento

- Al cargar el Excel: muestra los datos del primer proyecto de la lista
- Al cambiar el selector global: muestra los datos del proyecto seleccionado
- No tiene onClick ni modal
- No tiene selector propio — consume selectedProject del store global

---

## Datos que muestra

| Campo | Fuente en Excel                  | Formato mostrado     |
|-------|----------------------------------|----------------------|
| MTTR  | "MTTR Promedio (minutos)"        | formateado (ver regla)|
| MTBF  | "MTBF (horas)"                   | formateado (ver regla)|

### Regla de formateo MTTR (minutos → texto)
< 60 min          → "{N}min"          ej: 45  → "45min"
exacto en horas   → "{N}h"            ej: 120 → "2h"
resto             → "{N}h {M}min"     ej: 93  → "1h 33min"

### Regla de formateo MTBF (horas → texto)
< 1h              → "{N*60}min"       ej: 0.5 → "30min"
exacto en horas   → "{N}h"            ej: 5   → "5h"
con decimales     → "{N}h {M}min"     ej: 5.5 → "5h 30min"

---

## Selector global de proyecto — arquitectura

### MODIFICAR: `frontend/src/store/dataStore.ts`

Agregar al store global de Zustand:

```typescript
// Estado del selector global
selectedProjectId: string | null
setSelectedProject: (projectId: string) => void

// Al cargar el Excel, inicializar con el primer proyecto
// Dentro de la acción uploadExcel, después de guardar los datos:
set((state) => ({
  ...state,
  selectedProjectId: data.projects[0]?.id ?? null
}))
```

### NUEVO: `frontend/src/components/layout/ProjectSelector.tsx`

Selector dropdown que vive en el header del dashboard (no dentro de ninguna card).

Props: ninguna — lee y escribe directamente del store.

Comportamiento:
- Lista todos los proyectos del store (data.projects)
- Valor actual: selectedProjectId del store
- onChange: llama setSelectedProject(projectId)
- Formato de cada opción: "{project.name} — {project.team}"
- Si no hay proyectos cargados: selector deshabilitado con placeholder
  "Carga un archivo Excel para comenzar"

```typescript
const projects   = useDataStore(s => s.data?.projects ?? [])
const selected   = useDataStore(s => s.selectedProjectId)
const setProject = useDataStore(s => s.setSelectedProject)
```

### Cómo lo usan las cards

Cualquier card que necesite datos del proyecto activo hace esto:

```typescript
const selectedId = useDataStore(s => s.selectedProjectId)
const projects   = useDataStore(s => s.data?.projects ?? [])
const project    = projects.find(p => p.id === selectedId)
```

Sin llamadas al backend — los datos ya están en el store desde el upload.
El backend solo se llama para el detalle de incidentes (modal) porque
esa data no viene en el upload inicial.

---

## Contrato de datos

Los datos de MTTR y MTBF ya están en el store desde el momento del upload.
Esta card NO necesita un endpoint propio — consume el store directamente.

Estructura del proyecto en el store (ya definida en excel-ingestion):
```typescript
interface ProjectData {
  id: string
  name: string
  team: string
  reportMonth: string
  mttr: number          // MTTR Promedio (minutos) — del Excel
  mtbf: number          // MTBF (horas) — del Excel
  // ...resto de campos
}
```

---

## Frontend — archivos a crear/modificar

### NUEVO: `frontend/src/components/response-times/ResponseTimesCard.tsx`

Card no clickeable que muestra MTTR y MTBF del proyecto seleccionado.

Estructura visual (Se debe hacer con el prototipo de la card que ya tenemos para esta sección de Tiempos de Respuesta):
┌─────────────────────────────────────┐
│ 🕐 Tiempos de Respuesta             │
│                                     │
│   MTTR          MTBF                │
│   [verde]       [verde]             │
│   93min         5h                  │
│                                     │
│  Mean Time To Repair / Between      │
│  Failures                           │
└─────────────────────────────────────┘

Especificaciones visuales exactas según la imagen:
- Header: ícono de reloj + "Tiempos de Respuesta"
- Labels "MTTR" y "MTBF": texto pequeño, color verde (#16A34A)
- Valores: texto grande bold, color verde (#16A34A), misma línea
- Subtexto: "Mean Time To Repair / Between Failures" — gris, pequeño, centrado
- Sin botón, sin onClick, sin cursor pointer
- Fondo blanco, borde sutil igual que la card de Incidentes

Lógica del componente:
```typescript
const selectedId = useDataStore(s => s.selectedProjectId)
const projects   = useDataStore(s => s.data?.projects ?? [])
const project    = projects.find(p => p.id === selectedId)

const mttrFormatted = formatMTTR(project?.mttr ?? 0)
const mtbfFormatted = formatMTBF(project?.mtbf ?? 0)
```

Estado sin datos (Excel no cargado):
- Mostrar "--" en lugar de los valores
- Subtexto: "Carga un archivo para ver los datos"

### NUEVO: `frontend/src/utils/formatTime.ts`

Funciones de formateo reutilizables para toda la aplicación.
Estas funciones se usarán también en el modal de Incidentes y en
las secciones futuras de Disponibilidad y Resiliencia.

```typescript
export function formatMTTR(minutes: number): string {
  if (minutes === 0) return '0min'
  if (minutes < 60) return `${Math.round(minutes)}min`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

export function formatMTBF(hours: number): string {
  if (hours === 0) return '0h'
  if (hours < 1) return `${Math.round(hours * 60)}min`
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}
```

### MODIFICAR: `frontend/src/components/incidents/IncidentCard.tsx`

Remover cualquier selector interno de proyecto que haya sido generado.
El project_id para llamar al modal ahora viene del store global:

```typescript
// ANTES (si fue generado así — eliminar):
const [selectedProject, setSelectedProject] = useState(...)

// AHORA — leer del store global:
const selectedId = useDataStore(s => s.selectedProjectId)
// Usar selectedId para llamar fetchIncidents(selectedId)
```

### MODIFICAR: `frontend/src/App.tsx` o layout principal

Agregar el `<ProjectSelector />` en el header del dashboard,
visible en todo momento después de que se cargue el Excel.

```typescript
{hasData && <ProjectSelector />}
```

---

## Ajuste al spec de Incidentes

Documentar en changes/incidents/002-use-global-selector.md:

```markdown
# Change 002: Usar selector global en lugar de selector interno

El modal de incidentes ahora toma el project_id del store global
(selectedProjectId) en lugar de tener su propia lógica de selección.
Esto garantiza que todas las cards siempre muestren el mismo proyecto.

## Cambio en IncidentCard.tsx
- Eliminar estado local de proyecto seleccionado si existe
- Leer selectedProjectId del store de Zustand
- Pasar ese id a fetchIncidents() al abrir el modal
```

---

## Casos borde

- Excel cargado pero todos los proyectos tienen MTTR = 0:
  mostrar "0min" y "0h", no ocultar la card
- MTBF con decimales (ej: 5.5h):
  mostrar "5h 30min"
- Proyecto seleccionado no encontrado en la lista (inconsistencia del store):
  mostrar "--" y loguear warning en consola
- Excel recargado con un archivo nuevo:
  resetear selectedProjectId al primer proyecto del nuevo archivo

---

## Escalabilidad

Cuando en el futuro se agregue filtro por equipo:
- El store tendrá también selectedTeamId
- El ProjectSelector filtrará la lista de proyectos por equipo antes de mostrarlos
- ResponseTimesCard no cambia — sigue leyendo selectedProjectId del store

Cuando los datos vengan de una API en lugar del Excel:
- La card sigue sin endpoint propio
- Los datos de MTTR y MTBF vienen en el payload del proyecto
  igual que ahora — solo cambia la fuente en el backend

---

## Criterios de aceptación

- [ ] Al cargar el Excel, la card muestra el MTTR y MTBF del primer proyecto
- [ ] El selector global aparece en el header después de cargar el Excel
- [ ] Al cambiar el selector, la card se actualiza inmediatamente sin llamada al backend
- [ ] La card de Incidentes también reacciona al cambiar el selector global
- [ ] Los valores se formatean correctamente según las reglas de tiempo
- [ ] Con Excel no cargado, la card muestra "--" en ambos valores
- [ ] El selector muestra nombre del proyecto y equipo en cada opción
- [ ] Recargar con un Excel nuevo resetea el selector al primer proyecto