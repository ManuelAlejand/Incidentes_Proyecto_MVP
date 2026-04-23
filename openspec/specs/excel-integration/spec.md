# Spec: Excel Ingestion

## Estado: ACTIVO
## Versión: 1.0.0
## Prioridad: P0 — Bloquea todo lo demás

---

## Objetivo

Permitir al usuario interno cargar un archivo .xlsx con datos de múltiples proyectos.
El backend parsea, valida y normaliza los datos. El frontend los almacena en estado
global y los pone disponibles para todas las secciones del dashboard.

---

## Flujo completo

1. Usuario arrastra o selecciona un archivo .xlsx en la UI
2. Frontend valida que la extensión sea .xlsx o .xls
3. Frontend envía el archivo via POST multipart/form-data a /api/v1/upload
4. Backend recibe el archivo en memoria (no lo guarda en disco en el MVP)
5. Backend parsea con pandas, valida columnas con Pydantic
6. Si hay error de validación: devuelve 422 con detalle de qué columna falla
7. Si es válido: normaliza, calcula métricas derivadas, devuelve JSON
8. Frontend guarda el JSON en el store de Zustand (persistido en sessionStorage para evitar pérdida al recargar)
9. Dashboard se renderiza con los datos del store

---

## Contrato de API

### POST /api/v1/upload

**Request:** multipart/form-data, campo `file` con el .xlsx

**Response 200:**
```json
{
  "status": "success",
  "projects_loaded": 3,
  "months_available": ["2025-01", "2025-02", "2025-03"],
  "data": {
    "projects_by_month": {
      "2025-01": [ ...ver modelo abajo... ],
      "2025-02": [ ...ver modelo abajo... ],
      "2025-03": [ ...ver modelo abajo... ]
    }
  }
}
```

**Response 422:**
```json
{
  "status": "error",
  "error_type": "validation_error",
  "message": "Columna 'MTTR' no encontrada en la hoja",
  "missing_columns": ["MTTR", "Brechas Cerradas"]
}
```

---

## Modelo de datos normalizado (por proyecto)

## Columnas del Excel — estructura definitiva

### Columnas de resumen del proyecto (se repiten en cada fila del mismo proyecto)
| Columna                              | Tipo    | Notas                              |
|--------------------------------------|---------|------------------------------------|
| Nombre del Proyecto                  | string  | Identificador principal            |
| Equipo Responsable                   | string  |                                    |
| Mes de Reporte                       | string  | Formato YYYY-MM                    |
| Total SLAs                           | number  |                                    |
| SLAs Cumplidos                       | number  |                                    |
| SLAs Comprometidos                   | number  |                                    |
| Incidentes Críticos Totales          | number  | Total del mes                      |
| MTTR Promedio (minutos)              | number  | Promedio general del proyecto      |
| MTBF (horas)                         | number  |                                    |
| Tiempo Total de Operación (horas)    | number  |                                    |
| Número de Fallas                     | number  |                                    |
| Tiempo de Solución por Ticket (min)  | number  |                                    |
| Incidentes Recurrentes               | number  | Incidentes repetidos (mismo error) |
| Incidentes por Error Operativo       | number  |                                    |
| Incidentes por Base de Datos         | number  |                                    |
| Incidentes por API Gateway           | number  |        

---
### Columnas de detalle del incidente (una fila por incidente único)
| Columna                     | Tipo    | Notas                                      |
|-----------------------------|---------|--------------------------------------------|
| Servicio del Incidente      | string  | Vacío si el proyecto no tuvo incidentes    |
| Descripción del Incidente   | string  |                                            |
| Fuente del Incidente        | string  | Valor libre — se agrupa dinámicamente      |
| MTTR del Incidente (minutos)| number  | De este incidente específico               |
| Fecha del Incidente         | string  | Formato YYYY-MM-DD HH:MM                  |

## Regla de filas

- Si un proyecto tiene 0 incidentes: 1 sola fila, columnas de detalle vacías
- Si un proyecto tiene N incidentes distintos: N filas, cada una con su detalle
- Si el mismo error se repite: NO se agrega otra fila, se suma en "Incidentes Recurrentes"
- Las columnas de resumen se repiten idénticas en cada fila del mismo proyecto

## Lógica de agrupación en el backend

El parser recibe el DataFrame completo y para cada proyecto:
1. Filtra filas donde "Nombre del Proyecto" == project_name
2. Toma los valores de resumen de la PRIMERA fila (son iguales en todas)
3. Lee las filas de detalle ignorando las que tienen "Servicio del Incidente" vacío
4. Con esas filas construye la lista de incidentes individuales

```python
def group_project_data(df: pd.DataFrame, project_name: str) -> dict:
    project_rows = df[df["Nombre del Proyecto"] == project_name]
    summary = project_rows.iloc[0]  # primera fila para datos de resumen
    incidents = project_rows[
        project_rows["Servicio del Incidente"].notna() &
        (project_rows["Servicio del Incidente"] != "")
    ]
    return {"summary": summary, "incidents": incidents}
```


## UI: Componente de carga

### Estado vacío (sin datos)
- Área de drop centrada en pantalla
- Texto: "Arrastra tu archivo Excel aquí o haz clic para seleccionar"
- Subtext: "Formato requerido: .xlsx — Descarga la plantilla"
- Ícono de upload
- Botón secundario para descargar plantilla de ejemplo

### Estado cargando
- Spinner con texto "Procesando archivo..."
- Barra de progreso indeterminada

### Estado error
- Mensaje de error específico (qué columna falta)
- Botón para reintentar
- No borra el estado anterior si ya había datos cargados

### Estado exitoso
- Toast de confirmación: "X proyectos cargados correctamente"
- Badge en el header mostrando el nombre del archivo activo
- Botón para reemplazar el archivo (siempre visible en el header)

---

## Lógica de métricas derivadas (calculadas en el backend)

El backend calcula estas métricas antes de devolver el JSON:

- `availability_delta`: disponibilidad actual - meta (puede ser negativo)
- `sla_compliance_rate`: (slas_cumplidos / slas_total) * 100
- `incident_recurrence_rate`: (incidentes_recurrentes / total_incidentes) * 100
- `operational_error_rate`: (incidentes_error_operativo / total_incidentes) * 100

---

## Casos borde y validaciones

- Tamaño de archivo supera los 5MB: error 413 Payload Too Large
- Archivo vacío: error 400
- Excel con 0 proyectos: error 422 con mensaje específico
- Columnas renombradas o en diferente orden: el parser busca por nombre, no por posición
- Valores nulos en columnas numéricas: se imputan con 0 y se agrega warning en la respuesta
- Proyectos duplicados (mismo nombre + mismo mes): se toma el último registro
- Más de 500 proyectos en un Excel: se acepta pero se agrega header X-Large-Dataset: true

---

## Escalabilidad (notas para el futuro)

El endpoint /api/v1/upload es la implementación MVP del DataRepository.
Cuando se migre a DB, se crea un nuevo DataRepository que lee de PostgreSQL.
El frontend no sabe ni le importa de dónde vienen los datos.
El store de Zustand expone exactamente la misma forma de datos en ambos casos.

---

## Archivos a crear

### Backend
- `backend/app/main.py` — FastAPI app, CORS, router
- `backend/app/routers/upload.py` — endpoint POST /api/v1/upload
- `backend/app/services/excel_parser.py` — lógica de pandas
- `backend/app/services/metrics_calculator.py` — métricas derivadas
- `backend/app/models/project.py` — modelos Pydantic
- `backend/app/repositories/data_repository.py` — interfaz abstracta (para escalar)
- `backend/requirements.txt`

### Frontend
- `frontend/src/store/dataStore.ts` — Zustand store
- `frontend/src/services/api.ts` — cliente HTTP (axios o fetch)
- `frontend/src/components/UploadZone.tsx` — componente de carga
- `frontend/src/types/project.ts` — TypeScript interfaces
- `frontend/src/App.tsx` — router principal con lógica de estado vacío vs dashboard