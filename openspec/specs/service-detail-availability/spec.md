# Spec: Service Detail Modal — Gráfico de Torta por Tipo de Componente

## Estado: ACTIVO
## Versión: 1.0.0
## Tipo: ADDITIVE — sin cambios a backend, contratos ni lógica existente
## Depende de: specs/availability/spec.md

---

## Alcance estricto

PERMITIDO:
- Agregar gráfico de torta en ServiceDetailModal.tsx
- Crear componente reutilizable AvailabilityPieChart.tsx
- Leer datos que ya existen en el JSON del endpoint actual

NO PERMITIDO:
- Modificar GET /api/v1/projects/{id}/availability
- Modificar availability_parser.py
- Modificar ningún modelo Pydantic
- Tocar las métricas actuales, la gráfica de tendencia,
  alertas de capacidad, historial de despliegues ni análisis
- Cambiar el orden de las secciones existentes del modal

---

## Posición en el modal

El modal queda así — las secciones existentes no se mueven,
la torta se inserta entre "Detalle del tipo activo" y
"Tendencia de Disponibilidad":
[Métricas Actuales]                     ← sin cambios
[Tabs de tipo: Base de Datos | Capa Media | SO Linux]  ← sin cambios
[Detalle del tipo activo + componentes]  ← sin cambios
─────────────────────────────────────────
[NUEVO: Gráfico de torta]               ← se inserta aquí
─────────────────────────────────────────
[Tendencia de Disponibilidad + PeriodToggle + SlotSelector] ← sin cambios
[Alertas de Capacidad]                  ← sin cambios
[Historial de Despliegues]              ← sin cambios
[Análisis de Incidentes]                ← sin cambios

---

## Fuente de datos

Los datos ya existen en el JSON que devuelve
GET /api/v1/projects/{id}/availability.
No se necesita ninguna llamada nueva al backend.

El campo `by_type_summary` del contrato ya tiene exactamente
lo que necesita la torta:

```json
"by_type_summary": [
  { "type": "Base de Datos", "avg": 88.47 },
  { "type": "SO Linux",      "avg": 90.80 },
  { "type": "Capa Media",    "avg": 88.70 },
  { "type": "SO Windows",    "avg": 92.80 }
]
```

El componente recibe este array y lo transforma para Recharts.
Cero lógica de negocio nueva — solo transformación visual.

---

## Lógica de transformación para la torta

Cada porción representa el promedio de disponibilidad de ese tipo.
Como los valores son porcentajes (0-100), se pasan directamente
como `value` al PieChart de Recharts.

```typescript
const pieData = by_type_summary.map((item, index) => ({
  name: item.type,
  value: item.avg,                    // ej: 88.47
  displayValue: `${item.avg}%`,       // ej: "88.47%"
  color: PIE_COLORS[index % PIE_COLORS.length],
  meetsTarget: item.avg >= meta,
}))
```

### Colores de la torta

Colores fijos por posición en el array, no por nombre del tipo.
Igual que el gráfico de torta de incidentes — mismo sistema.
Escalable: agregar un tipo nuevo en el Excel → recibe el
siguiente color del array automáticamente.

```typescript
// frontend/src/config/chartColors.ts  (archivo nuevo compartido)
export const PIE_COLORS = [
  '#4F81BD',  // azul
  '#70AD47',  // verde
  '#00B0F0',  // celeste
  '#FF6B35',  // naranja
  '#9B59B6',  // púrpura
  '#E74C3C',  // rojo
  '#F39C12',  // amarillo
  '#1ABC9C',  // teal
]
```

Este archivo reemplaza los colores hardcodeados que existen
actualmente en el gráfico de torta de incidentes.
Ambos gráficos importan de la misma fuente — consistencia visual.

---

## Diseño del gráfico

Replicar exactamente el estilo del gráfico de torta de
Detalle de Incidentes del Mes. Mismo componente base,
misma librería (Recharts PieChart), misma proporción visual.

┌─────────────────────────────────────────────────────┐
│ Disponibilidad por Tipo de Componente               │
│                                                     │
│         ╭──────╮    ● Base de Datos   88.47%        │
│       ╱          ╲  ● SO Linux        90.80%        │
│      │    torta   │ ● Capa Media      88.70%        │
│       ╲          ╱  ● SO Windows      92.80%        │
│         ╰──────╯                                    │
│                                                     │
│  * Porcentaje = promedio de disponibilidad del tipo │
└─────────────────────────────────────────────────────┘
Especificaciones visuales exactas:
- Título de sección: "Disponibilidad por Tipo de Componente"
  mismo estilo tipográfico que "Incidentes por Fuente de Falla"
- PieChart: mismo tamaño que el de incidentes
- Leyenda a la derecha: color + nombre del tipo + porcentaje
  Formato: `"Base de Datos  88.47%"`
- Tooltip al hover: `"Base de Datos: 88.47% de disponibilidad promedio"`
- Si un tipo tiene avg >= meta: el texto del porcentaje en la
  leyenda va en verde (#16A34A)
- Si un tipo tiene avg < meta: el texto del porcentaje en la
  leyenda va en rojo (#DC2626)
- Sin label dentro de la porción (queda muy pequeño) —
  la información está en la leyenda
- Nota al pie en gris pequeño:
  "* Porcentaje = promedio de disponibilidad del tipo de componente"

### Estado sin datos
Si `by_type_summary` está vacío o tiene un solo tipo:
- No renderizar el gráfico de torta (no tiene sentido con un solo valor)
- No mostrar nada — la sección desaparece silenciosamente
- El modal sigue funcionando con solo la gráfica de tendencia

---

## Archivos a crear/modificar

### NUEVO: `frontend/src/config/chartColors.ts`

```typescript
// Paleta centralizada para todos los gráficos de torta
// Agregar colores aquí cuando se necesiten más categorías
export const PIE_COLORS = [
  '#4F81BD',
  '#70AD47',
  '#00B0F0',
  '#FF6B35',
  '#9B59B6',
  '#E74C3C',
  '#F39C12',
  '#1ABC9C',
]

// Helper para obtener color por índice (maneja más items que colores)
export function getPieColor(index: number): string {
  return PIE_COLORS[index % PIE_COLORS.length]
}
```

### NUEVO: `frontend/src/components/shared/AvailabilityPieChart.tsx`

Componente reutilizable. No sabe que está en ServiceDetailModal.
Puede instanciarse en cualquier lugar que tenga datos by_type.

```typescript
interface AvailabilityPieChartProps {
  data: {
    type: string
    avg: number
    meetsTarget: boolean
  }[]
  meta: number
  height?: number    // default: 220
  title?: string     // default: "Disponibilidad por Tipo de Componente"
}

export function AvailabilityPieChart({
  data,
  meta,
  height = 220,
  title = 'Disponibilidad por Tipo de Componente'
}: AvailabilityPieChartProps) {
  // Si hay 0 o 1 tipos: return null
  if (data.length <= 1) return null

  const pieData = data.map((item, i) => ({
    name: item.type,
    value: item.avg,
    displayValue: `${item.avg.toFixed(2)}%`,
    color: getPieColor(i),
    meetsTarget: item.meetsTarget,
  }))

  return (
    // PieChart de Recharts con leyenda personalizada
    // Mismo estilo que IncidentModal pie chart
  )
}
```

Reutilización futura:
- AvailabilityGlobalModal (vista global de todos los tipos)
- Cualquier reporte de disponibilidad por segmento

### MODIFICAR: `frontend/src/components/incidents/IncidentModal.tsx`

Reemplazar el array de colores hardcodeado que existe hoy
por la importación de `chartColors.ts`:

```typescript
// ANTES (si está hardcodeado así — reemplazar):
const CHART_COLORS = ['#4F81BD', '#70AD47', ...]

// AHORA:
import { getPieColor } from '@/config/chartColors'
// Usar getPieColor(index) donde antes estaba CHART_COLORS[index]
```

Este cambio es de una línea. No afecta el comportamiento visual.

### MODIFICAR: `frontend/src/components/availability/ServiceDetailModal.tsx`

Insertar el componente entre el detalle del tipo activo
y la gráfica de tendencia:

```typescript
import { AvailabilityPieChart } from '@/components/shared/AvailabilityPieChart'

// Dentro del JSX, después del bloque de ComponentTypeTabs y detalle:

<AvailabilityPieChart
  data={serviceData.by_type_summary.map(item => ({
    type: item.type,
    avg: item.avg,
    meetsTarget: item.avg >= serviceData.meta
  }))}
  meta={serviceData.meta}
/>

// Luego continúa la sección de Tendencia de Disponibilidad
// exactamente igual que antes
```

---

## Escalabilidad

Cuando se agregue un nuevo tipo de componente en `config.yaml`
(ej: "Contenedor Docker"), el flujo completo es:

1- Agregar "Contenedor Docker" en config.yaml del backend
2- El Excel tiene componentes de ese tipo
3- El backend los incluye en by_type_summary automáticamente
4- AvailabilityPieChart recibe el nuevo tipo en el array data
5- getPieColor(index) le asigna el siguiente color disponible
6- La torta muestra la nueva porción
CERO cambios al componente AvailabilityPieChart
CERO cambios al componente ServiceDetailModal

---

## Casos borde

- Un solo tipo de componente en el servicio:
  `data.length <= 1` → el componente retorna null silenciosamente
  El modal no muestra esa sección — sin error, sin espacio vacío

- Todos los tipos tienen el mismo porcentaje (ej: todos 99.5%):
  La torta muestra porciones iguales — es correcto matemáticamente
  La leyenda sigue siendo útil para ver los nombres y valores

- Tipo con avg = 0 (servicio completamente caído):
  Se muestra en la torta — es dato real y accionable
  El porcentaje en la leyenda va en rojo

- Más de 8 tipos (más que colores en PIE_COLORS):
  `getPieColor` cicla con módulo — el tipo 9 reutiliza el color 1
  En el futuro se agregan más colores al array si es necesario

- `by_type_summary` undefined o null:
  Guard clause al inicio: `if (!data?.length) return null`

---

## Criterios de aceptación

- [ ] La gráfica de torta aparece entre el detalle del tipo activo
      y la gráfica de tendencia — en esa posición exacta
- [ ] Cada porción representa el promedio de disponibilidad del tipo
- [ ] La leyenda muestra: color + nombre del tipo + porcentaje
- [ ] Porcentaje en verde si avg >= meta, rojo si avg < meta
- [ ] Tooltip al hover muestra nombre del tipo y porcentaje
- [ ] Estilo visual idéntico al gráfico de torta de incidentes
- [ ] Si el servicio tiene un solo tipo: la sección no aparece
- [ ] Cambiar tipo de componente en los tabs NO afecta la torta
      (la torta siempre muestra TODOS los tipos del servicio)
- [ ] Agregar nuevo tipo en Excel → aparece en la torta sin cambios de código
- [ ] El gráfico de incidentes ahora usa chartColors.ts (mismo sistema)
- [ ] Todas las secciones existentes del modal sin cambios visuales