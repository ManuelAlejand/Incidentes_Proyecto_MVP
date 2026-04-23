# Spec: Global Availability & Business Services

## Estado: ACTIVO
## Versión: 1.0.0
## Depende de: specs/excel-ingestion/spec.md

---

## Objetivo

Dos secciones que consumen la misma fuente de datos (Hoja 2 del Excel):

1. Card "Disponibilidad Global" en el header — un número consolidado
   del proyecto seleccionado.
2. Tabla "Servicios de Negocio" — detalle por servicio con selector
   de tipo de componente al hacer clic en cada servicio.

---

## Fuente de datos — Hoja 2: "Componentes de Disponibilidad"

Una fila por componente. Columnas:

| Columna                  | Tipo   | Descripción                                    |
|--------------------------|--------|------------------------------------------------|
| Nombre del Proyecto      | string | Clave foránea con Hoja 1                       |
| Servicio                 | string | Ej: Portal Autogestión, Core de Red            |
| Tipo de Componente       | string | Base de Datos / SO Windows / SO Linux / Capa Media |
| Nombre del Componente    | string | Ej: Oracle DB Primary, Windows Server 2022     |
| Disponibilidad (%)       | number | Porcentaje directo del periodo                 |
| Meta Disponibilidad (%)  | number | Objetivo mínimo del periodo                    |

### Tipos de componente válidos en MVP
Definidos en config.yaml — no en el código:

```yaml
availability:
  component_types:
    - "Base de Datos"
    - "SO Windows"
    - "SO Linux"
    - "Capa Media"
```

Para agregar un nuevo tipo en el futuro (ej: "Contenedor Docker"),
solo se agrega al YAML. El parser y el frontend lo manejan
automáticamente porque leen los tipos del config, no los hardcodean.

---

## Lógica de cálculo — Disponibilidad Global

### Paso 1: Agrupar componentes del proyecto por tipo
```python
project_components = df[df["Nombre del Proyecto"] == project_name]

by_type = project_components.groupby("Tipo de Componente")["Disponibilidad (%)"].mean()
# Resultado: {"Base de Datos": 95.2, "SO Windows": 98.1, "SO Linux": 99.3, "Capa Media": 97.8}
```

### Paso 2: Promedio de promedios por bloque
```python
global_availability = by_type.mean().round(2)
# Cada bloque contribuye igual al global, sin importar cuántos componentes tenga
```

### Paso 3: Estado vs meta
```python
project_meta = project_components["Meta Disponibilidad (%)"].iloc[0]
meets_target = global_availability >= project_meta
delta = round(global_availability - project_meta, 2)
```

---

## Lógica de cálculo — Servicios de Negocio

### Agrupación por servicio y tipo
Para cada servicio único del proyecto, calcular disponibilidad
promedio por cada tipo de componente que tenga:

```python
services = project_components.groupby("Servicio")

for service_name, service_df in services:
    # Disponibilidad general del servicio = promedio de todos sus componentes
    service_availability = service_df["Disponibilidad (%)"].mean().round(2)
    service_meta = service_df["Meta Disponibilidad (%)"].iloc[0]

    # Desglose por tipo — para el selector del modal
    by_type = {}
    for tipo, tipo_df in service_df.groupby("Tipo de Componente"):
        by_type[tipo] = {
            "avg_availability": tipo_df["Disponibilidad (%)"].mean().round(2),
            "components": tipo_df[["Nombre del Componente","Disponibilidad (%)"]].to_dict("records"),
            "meets_target": tipo_df["Disponibilidad (%)"].mean() >= service_meta
        }
```

### Columna Capacidad (derivada de incidentes)
Se cruza con los datos de incidentes de la Hoja 1:

```python
incidents_for_service = incident_rows[
    incident_rows["Servicio del Incidente"] == service_name
]
incident_count = len(incidents_for_service)

if incident_count >= 5:
    capacity_status = "alert"
    capacity_count = incident_count
elif incident_count >= 3:
    capacity_status = "warning"
    capacity_count = incident_count
else:
    capacity_status = "ok"
    capacity_count = 0
```

### Lógica de Alertas de Capacidad (modal de servicio)
Se genera automáticamente según el nivel de incidentes. No son datos
del Excel — son mensajes derivados de la cantidad e impacto:

```python
# Si capacity_status == "alert" (>= 5 incidentes):
alerts = [
    "Memoria 92%",    # hardcoded en MVP
    "CPU 88%",
    "Conexiones DB 95%"
]
recommendation = "Acción inmediata requerida. Escalar recursos o implementar optimizaciones urgentes."

# Si capacity_status == "warning" (3-4 incidentes):
alerts = ["Memoria 78%", "CPU 72%"]
recommendation = "Monitorear de cerca. Considerar optimización preventiva."

# Si capacity_status == "ok" (0-2 incidentes):
alerts = []
recommendation = "Todos los recursos operando dentro de parámetros normales."
```

NOTA ESCALABILIDAD: En el futuro, estas alertas vendrán de un sistema
de monitoreo real (Prometheus, Datadog, etc.) vía API. El contrato
JSON del endpoint ya incluye la estructura para recibirlas.

### Tendencia de Disponibilidad — últimos 6 meses
En el MVP con un solo mes de datos, el backend genera los 5 meses
anteriores con variación aleatoria controlada (±0.5% máximo)
alrededor del valor real del mes actual. Esto se documenta como
comportamiento MVP explícito.

```python
import random
def generate_trend(current_availability: float, months: int = 6) -> list:
    trend = []
    for i in range(months - 1, 0, -1):
        month_date = report_month - relativedelta(months=i)
        variation = random.uniform(-0.5, 0.5)
        historical_value = round(
            max(95.0, min(100.0, current_availability + variation)), 2
        )
        trend.append({
            "month": month_date.strftime("%b %Y"),
            "availability": historical_value,
            "meets_target": historical_value >= service_meta
        })
    # El último punto es el mes real
    trend.append({
        "month": report_month.strftime("%b %Y"),
        "availability": current_availability,
        "meets_target": current_availability >= service_meta
    })
    return trend
```

Cuando el Excel tenga múltiples meses, el backend usa los datos
reales en lugar de generar la variación. Detección automática:

```python
project_months = df[df["Nombre del Proyecto"] == project_name]["Mes de Reporte"].unique()
if len(project_months) >= 6:
    # Usar datos reales de los últimos 6 meses
else:
    # MVP: generar meses anteriores con variación controlada
```

### Historial de Despliegues
Viene de las columnas de Hoja 1: Despliegues Totales, Exitosos, Fallidos.
Se muestra como "Mes Actual" con esos valores reales del Excel.

```python
deployments = {
    "period": "Mes Actual",
    "total":      project_summary["Despliegues Totales"],
    "successful": project_summary["Despliegues Exitosos"],
    "failed":     project_summary["Despliegues Fallidos"],
    "success_rate": round(
        project_summary["Despliegues Exitosos"] /
        project_summary["Despliegues Totales"] * 100, 1
    ) if project_summary["Despliegues Totales"] > 0 else 0
}
```

### Análisis de Incidentes (texto automático)
```python
total_incidents = len(incident_rows_for_service)
main_cause = incident_rows_for_service["Fuente del Incidente"].mode()[0] \
             if total_incidents > 0 else None

if total_incidents == 0:
    message = "No se registraron incidentes en el mes actual. Operación dentro de parámetros normales."
    is_alert = False
elif total_incidents <= 2:
    message = f"Se han registrado {total_incidents} incidente(s) en el mes actual, dentro de los parámetros normales de operación."
    is_alert = False
else:
    message = f"Alerta: Se han registrado {total_incidents} incidentes en el mes actual, superando el umbral aceptable. Causa principal identificada: {main_cause}."
    is_alert = True
```

---

## Contrato de API

### GET /api/v1/projects/{project_id}/availability

```json
{
  "project_id": "claro-red-core",
  "global_availability": {
    "percentage": 90.32,
    "meta": 99.5,
    "meets_target": false,
    "delta": -9.18,
    "by_type": [
      { "type": "Base de Datos", "avg": 88.47 },
      { "type": "SO Windows",    "avg": 92.80 },
      { "type": "SO Linux",      "avg": 91.03 },
      { "type": "Capa Media",    "avg": 88.98 }
    ]
  },
  "services": [
    {
      "name": "Core de Red",
      "availability": 89.52,
      "meta": 99.5,
      "meets_target": false,
      "incident_count": 2,
      "capacity_status": "ok",
      "capacity_count": 0,
      "deployments": {
        "period": "Mes Actual",
        "total": 12, "successful": 10, "failed": 2, "success_rate": 83.3
      },
      "capacity_alerts": {
        "status": "alert",
        "count": 3,
        "items": ["Memoria 92%", "CPU 88%", "Conexiones DB 95%"],
        "recommendation": "Acción inmediata requerida. Escalar recursos o implementar optimizaciones urgentes."
      },
      "by_type": {
        "Base de Datos": {
          "avg_availability": 86.97,
          "meets_target": false,
          "components": [
            { "name": "Oracle RAC Nodo1", "availability": 85.30 },
            { "name": "Oracle RAC Nodo2", "availability": 87.10 },
            { "name": "Oracle RAC Nodo3", "availability": 88.50 }
          ]
        },
        "SO Linux": {
          "avg_availability": 90.80,
          "meets_target": false,
          "components": [
            { "name": "RHEL 8 - Core01", "availability": 90.20 },
            { "name": "RHEL 8 - Core02", "availability": 91.40 }
          ]
        },
        "Capa Media": {
          "avg_availability": 88.70,
          "meets_target": false,
          "components": [
            { "name": "WebLogic 12c Cluster", "availability": 88.70 }
          ]
        }
      },
      "trend": [
        { "month": "Sep 2024", "availability": 89.90, "meets_target": false },
        { "month": "Oct 2024", "availability": 90.10, "meets_target": false },
        { "month": "Nov 2024", "availability": 89.40, "meets_target": false },
        { "month": "Dic 2024", "availability": 90.80, "meets_target": false },
        { "month": "Ene 2025", "availability": 89.20, "meets_target": false },
        { "month": "Feb 2025", "availability": 89.52, "meets_target": false }
      ],
      "incident_analysis": {
        "total": 2,
        "main_cause": "Infraestructura",
        "message": "Se han registrado 2 incidentes en el mes actual, dentro de los parámetros normales de operación.",
        "is_alert": false
      }
    }
  ]
}
```

---

## Backend — archivos a crear/modificar

### NUEVO: `backend/app/services/availability_parser.py`
Responsabilidades:
- Leer Hoja 2 del Excel ("Componentes de Disponibilidad")
- Calcular disponibilidad global (promedio de promedios por tipo)
- Calcular disponibilidad por servicio
- Generar desglose by_type para el selector del modal
- Generar tendencia de 6 meses (real si hay datos, simulada si no)
- Cruzar con datos de incidentes para capacity_status
- Generar mensajes de análisis automáticos

### NUEVO: `backend/app/routers/availability.py`
- GET /api/v1/projects/{project_id}/availability

### MODIFICAR: `backend/app/repositories/data_repository.py`
- Agregar método `get_components_dataframe() → pd.DataFrame`
  Lee la Hoja 2 del Excel ("Componentes de Disponibilidad")

### MODIFICAR: `backend/app/routers/upload.py`
- Validar que el Excel tiene las dos hojas requeridas
- Si falta "Componentes de Disponibilidad": error 422 con mensaje claro

### MODIFICAR: `config.yaml`
Agregar sección:
```yaml
availability:
  component_types:
    - "Base de Datos"
    - "SO Windows"
    - "SO Linux"
    - "Capa Media"
  capacity_thresholds:
    alert: 5       # >= 5 incidentes → alerta roja
    warning: 3     # >= 3 incidentes → alerta amarilla
  trend_months: 6
  mvp_trend_variation: 0.5  # variación máxima en % para meses simulados
```

---

## Frontend — archivos a crear/modificar

### MODIFICAR: Card "Disponibilidad Global" en el header
Cambiar fuente de datos: ya no usa `project.availability` de la Hoja 1.
Ahora usa `availabilityData.global_availability.percentage` del endpoint.

```typescript
// Color del porcentaje:
// meets_target === true  → verde (#16A34A)
// meets_target === false → rojo (#DC2626)

// Subtexto: "Meta: {meta}%"
// Clic: abre modal con gráfico de barras de la tendencia
```

### MODIFICAR: Tabla "Servicios de Negocio"
Columna Disponibilidad: usar `service.availability` del endpoint
(promedio de todos sus componentes), no el campo de Hoja 1.

Color del punto:
- Verde si `meets_target === true`
- Rojo si `meets_target === false`

### MODIFICAR: Modal de servicio — agregar selector de tipo
Cuando el usuario hace clic en una fila de la tabla y se abre el modal,
el modal muestra en la parte superior un selector tipo tab/pill con
los tipos de componente disponibles para ese servicio:
[ Base de Datos ] [ SO Linux ] [ Capa Media ]

Al cambiar de tab:
- La gráfica de tendencia se actualiza con los datos de ese tipo
- Las métricas de disponibilidad muestran el promedio de ese tipo
- La lista de componentes individuales se actualiza

Si el servicio solo tiene un tipo, no se muestra el selector
(no hay nada que alternar).

```typescript
// Estado local del modal:
const [activeType, setActiveType] = useState<string>(
  Object.keys(serviceData.by_type)[0]  // primer tipo por defecto
)

const activeTypeData = serviceData.by_type[activeType]
```

### NUEVO: `frontend/src/components/availability/AvailabilityModal.tsx`
Modal del clic en la card Disponibilidad Global.
Muestra gráfico de barras (Recharts BarChart) con:
- Eje X: meses (6 barras)
- Barras verdes si meets_target, rojas si no
- Línea punteada horizontal en el valor de la meta
- Leyenda: "Cumple meta" (verde) / "No cumple meta" (rojo) / "Meta (X%)"

### NUEVO: `frontend/src/components/availability/ServiceDetailModal.tsx`
Modal del clic en una fila de Servicios de Negocio.
Secciones (replicar imagen 2 entregada):
1. Métricas Actuales — Disponibilidad, Incidentes, Tasa Éxito Despliegues,
   Alertas de Capacidad
2. Tendencia de Disponibilidad — gráfico de línea 6 meses
3. Alertas de Capacidad — banner amarillo/rojo con lista de alertas
   o banner verde si todo OK
4. Historial de Despliegues — tabla con Mes Actual, Total, Exitosos,
   Fallidos, Tasa de Éxito
5. Análisis de Incidentes — texto automático con color según is_alert

### NUEVO: `frontend/src/services/availabilityService.ts`
```typescript
export async function fetchAvailability(projectId: string): Promise<AvailabilityResponse> {
  const res = await fetch(`/api/v1/projects/${projectId}/availability`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
```

### NUEVO: `frontend/src/types/availability.ts`
Interfaces TypeScript que espejean exactamente el contrato JSON.

### MODIFICAR: `frontend/src/store/dataStore.ts`
```typescript
availabilityData: AvailabilityResponse | null
isLoadingAvailability: boolean
fetchAvailability: (projectId: string) => Promise<void>
```

La acción `fetchAvailability` se dispara automáticamente cuando
cambia `selectedProjectId` — igual que `fetchIncidents`.

---

## Escalabilidad — cómo reemplazar el Excel

Cuando los datos de disponibilidad vengan de una API de monitoreo real
(Prometheus, Datadog, New Relic), el único archivo que cambia es:

`backend/app/repositories/data_repository.py`
→ `get_components_dataframe()` ejecuta una query HTTP en lugar de leer Excel
→ Retorna el mismo DataFrame con las mismas columnas
→ `availability_parser.py` no toca nada
→ El frontend no toca nada

La estructura de la Hoja 2 del Excel es intencionalmente idéntica
al esquema que tendría una tabla de DB:
```sql
CREATE TABLE availability_components (
    project_name    VARCHAR,
    service         VARCHAR,
    component_type  VARCHAR,
    component_name  VARCHAR,
    availability    DECIMAL(5,2),
    meta            DECIMAL(5,2),
    report_month    DATE
);
```

---

## Criterios de aceptación

- [ ] Card Disponibilidad Global muestra promedio de promedios por tipo
- [ ] Color verde/rojo según si cumple la meta del proyecto
- [ ] Clic en card abre modal con gráfico de barras de 6 meses
- [ ] Tabla Servicios de Negocio muestra disponibilidad por servicio
- [ ] Clic en servicio abre modal con todas las secciones de la imagen 2
- [ ] Modal de servicio tiene selector de tipo de componente (tabs/pills)
- [ ] Al cambiar tab, gráfica y métricas se actualizan sin llamada al backend
- [ ] Alertas de capacidad muestran mensaje correcto según nivel de incidentes
- [ ] Historial de despliegues muestra datos reales del Excel
- [ ] Análisis de incidentes muestra causa principal real (Fuente más frecuente)
- [ ] Cambiar proyecto en el selector global actualiza disponibilidad global
- [ ] Cambiar Excel y recargar actualiza todo sin cambiar código
- [ ] Agregar nuevo tipo en config.yaml lo muestra automáticamente

