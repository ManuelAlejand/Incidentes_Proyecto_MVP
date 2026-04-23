## Context

El frontend actualmente persiste los datos crudos del Excel (`parsedExcelRawData`) en Zustand/sessionStorage. El parser (`incidentParser.ts`) ya puede filtrar por proyecto, pero nadie le pasa el nombre del proyecto activo — siempre toma el primero del array. Además, el total visible en la card es solo el valor de `Incidentes Críticos Totales`, ignorando las otras 5 columnas de resumen que contribuyen al conteo real de incidentes del mes.

## Goals / Non-Goals

**Goals:**
- Sumar correctamente las 6 columnas de resumen para calcular `totalIncidentes` en la card y el modal.
- Extraer la lista de proyectos únicos del Excel al momento de la carga y guardarla en el store.
- Mostrar un dropdown selector de proyecto dentro del modal de incidentes.
- Mantener un `activeProjectName` en el store que sincronice la card con el proyecto seleccionado en el modal.
- No romper ningún otro módulo del dashboard (disponibilidad, SLA, tabla de servicios).

**Non-Goals:**
- Implementar un backend o API real.
- Persistir el proyecto seleccionado entre sesiones (se reinicia al limpiar el archivo).
- Agregar filtros por mes, equipo o cliente en esta iteración.

## Decisions

### 1. Dónde vive el `activeProjectName` — Store de Zustand

**Decisión:** Agregar `projectNames: string[]` y `activeProjectName: string | null` al store existente `dataStore.ts`.

**Alternativas consideradas:**
- Estado local en `App.tsx` con `useState`: descartado porque el `activeProjectName` lo necesitan tanto la card (fuera del modal) como el modal mismo.
- Context de React: innecesario complejidad extra cuando ya existe Zustand.

**Rationale:** El store ya persiste `parsedExcelRawData`. Es coherente que el proyecto activo también viva ahí, con la diferencia de que NO se persiste en sessionStorage (se resetea al recargar, lo cual es el comportamiento correcto).

### 2. Cuándo extraer la lista de proyectos — Al parsear el Excel

**Decisión:** En `UploadZone.tsx`, después de validar las columnas requeridas y antes de llamar `setUploadData`, extraer los nombres únicos con:
```typescript
const projectNames = [...new Set(jsonData.map((r: any) => r["Nombre del Proyecto"]).filter(Boolean))];
```
Y pasar `projectNames` a `setUploadData`.

**Rationale:** El momento de la carga es el único punto donde se lee el archivo completo. Hacerlo en el parser sería redundante.

### 3. Cálculo del total — Suma de 6 columnas

**Decisión:** En `incidentParser.ts`, reemplazar:
```typescript
const totalFromSummary = parseFloat(summaryRow["Incidentes Críticos Totales"]) || 0;
```
Por la suma de las 6 columnas:
```typescript
const SUMMARY_COLUMNS = [
  "Incidentes Críticos Totales",
  "Número de Fallas",
  "Incidentes Recurrentes",
  "Incidentes por Error Operativo",
  "Incidentes por Base de Datos",
  "Incidentes por API Gateway",
];
const totalFromSummary = SUMMARY_COLUMNS.reduce((sum, col) => sum + (parseFloat(summaryRow[col]) || 0), 0);
```

**Rationale:** La solicitud explícita del usuario es que el total sea la suma de estas 6 columnas. El total de incidentes de detalle (`incidents.length`) sigue siendo la fuente primaria si hay filas de detalle; el `totalFromSummary` es el fallback.

### 4. UX del selector — Dropdown dentro del modal

**Decisión:** En el modal de incidentes (`activeModal === 'incidentes'` en `App.tsx`), agregar inmediatamente después del título un `<select>` con los proyectos del store. Al cambiar la selección, se actualiza `activeProjectName` en el store, lo que reactivamente recalcula `dynamicIncidents`.

**Alternativas consideradas:**
- Selector fuera del modal (en el header): afectaría otros módulos del dashboard de forma inesperada.
- Múltiples cards (una por proyecto): cambia el layout actual, fuera de scope.

**Rationale:** El modal es el contexto correcto para explorar proyectos sin afectar la vista principal. La card siempre muestra el proyecto activo seleccionado.

### 5. Recálculo de `dynamicIncidents` — Reactivo al store

**Decisión:** En `App.tsx`, el cálculo de `dynamicIncidents` cambia de:
```typescript
const dynamicIncidents = parsedExcelRawData ? parseIncidentsFrontend(parsedExcelRawData) : null;
```
A:
```typescript
const { parsedExcelRawData, activeProjectName } = useDataStore();
const dynamicIncidents = parsedExcelRawData && activeProjectName
  ? parseIncidentsFrontend(parsedExcelRawData, activeProjectName)
  : parsedExcelRawData && parsedExcelRawData.length > 0
    ? parseIncidentsFrontend(parsedExcelRawData) // primer proyecto por defecto
    : null;
```

## Risks / Trade-offs

- **Columnas vacías o con 0:** Si alguna de las 6 columnas de resumen tiene `NaN` o está ausente, el `parseFloat(...) || 0` la ignora correctamente. No hay riesgo de `NaN` en el total.
- **Proyectos sin filas de detalle:** Si el Excel tiene proyectos con las columnas de resumen pero sin filas de detalle (`Servicio del Incidente` vacío), el modal mostrará tabla vacía y el total vendrá de las columnas de resumen. Esto es el comportamiento correcto según el spec.
- **Orden del dropdown:** Los proyectos aparecen en el orden que están en el Excel. No hay ordenamiento alfabético — trade-off aceptable para MVP.
