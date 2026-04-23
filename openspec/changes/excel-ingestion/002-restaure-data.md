# Change 002: Reestructuración del esquema del Excel

## Fecha: 2025-01
## Tipo: BREAKING CHANGE
## Afecta: excel-ingestion, incidents

## Qué cambió
El Excel pasó de una fila por proyecto con columnas Inc1_*, Inc2_*
a una fila por incidente único. Los campos de resumen del proyecto
se repiten en cada fila. Los incidentes recurrentes (mismo error)
se suman en "Incidentes Recurrentes", no generan nueva fila.

## Por qué
El modelo de columnas dinámicas (Inc1_*, Inc2_*) no escala:
si un proyecto tiene 30 incidentes, el Excel crece horizontalmente
de forma inmanejable. El modelo de filas escala verticalmente
sin límite y es compatible con una futura migración a DB donde
cada fila se convierte directamente en un registro de tabla.

## Columnas eliminadas
Todas las columnas Inc1_Servicio, Inc1_Descripcion, Inc1_Fuente,
Inc1_MTTR_min, Inc1_Fecha ... IncN_* quedan eliminadas.

## Columnas nuevas (al final de cada fila)
- Servicio del Incidente
- Descripción del Incidente
- Fuente del Incidente
- MTTR del Incidente (minutos)
- Fecha del Incidente

## Columnas nuevas en resumen
- Incidentes por Base de Datos
- Incidentes por API Gateway

## Archivos impactados
- backend/app/services/excel_parser.py       → reescribir lógica de agrupación
- backend/app/services/incident_parser.py    → reescribir parseo por filas
- backend/app/repositories/data_repository.py → ajustar get_dataframe
- specs/excel-ingestion/spec.md              → actualizar contrato y columnas
- specs/incidents/spec.md                    → actualizar lógica de parseo