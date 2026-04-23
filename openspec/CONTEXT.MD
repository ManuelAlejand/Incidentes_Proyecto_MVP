# Incident Management Platform — Context

## Propósito del sistema

Plataforma centralizada para detectar, analizar y resolver incidentes de software.
Mide la excelencia de servicio de proyectos mediante el cálculo de SLIs compuestos
por indicadores con peso, meta y resultado.

## Modelo de negocio

Cada proyecto tiene un conjunto de indicadores agrupados en cinco dimensiones:

- **Observabilidad**
- **Eficiencia**
- **Gestión de Incidentes**
- **Gestión de Cambios**
- **Continuidad de Servicio**

Cada indicador tiene: nombre, peso (puntos posibles), meta, resultado real,
y puntos obtenidos (0 si no cumple la meta, peso completo si la cumple).
El SLI total es la suma de puntos obtenidos sobre el total posible.

## Fuente de datos (MVP)

Un archivo Excel (.xlsx) cargado manualmente por el usuario interno.
Columnas esperadas por proyecto:

- Nombre del proyecto
- Equipo responsable
- Mes de reporte
- Total SLAs
- SLAs Cumplidos
- SLAs Comprometidos
- Incidentes Críticos Totales
- MTTR (Mean Time to Repair, en minutos)
- MTBF (Mean Time Between Failures, en horas)
- Tiempo Total de Operación (en horas)
- Número de Fallas
- Tiempo de Solución por Ticket (promedio, en minutos)
- Incidentes Recurrentes
- Incidentes por Error Operativo
- Brechas Cerradas
- Disponibilidad (porcentaje)
- Meta de Disponibilidad (porcentaje)

## Restricción crítica de escalabilidad

El sistema debe estar diseñado desde el día 1 para que la fuente de datos
sea intercambiable. El frontend NUNCA llama directamente al archivo Excel.
Solo consume endpoints de la API REST. El backend abstrae la fuente de datos
detrás de una interfaz de repositorio (Repository Pattern).

Cuando en el futuro se reemplace el Excel por una DB o API externa,
solo se modifica la capa de repositorio del backend. El frontend no cambia.

## Arquitectura de datos

El backend expone los datos normalizados. No importa si vienen de Excel,
DB o API: el contrato de la respuesta JSON es siempre el mismo.

## Usuarios del sistema

- **Usuarios internos (workers):** Suben el Excel y administran los datos.
- **Vista futura:** Clientes/proyectos filtrados por equipo o cliente.

## Secciones del dashboard (en orden de implementación)

1. Importación de Excel (base del sistema)
2. Incidentes
3. Disponibilidad Global
4. Tiempos de Respuesta
5. Servicios de Negocio
6. Desempeño SLA
7. Resiliencia

## Reglas de negocio críticas

- Los datos mostrados en el frontend NUNCA son hardcodeados.
- Cada gráfica se regenera a partir de los datos del Excel activo.
- El histórico de 6 meses se calcula desde los registros de meses anteriores
  en el mismo Excel (o en la futura DB).
- Si cambia el Excel, cambian todas las vistas automáticamente al recargar.

## Convenciones de desarrollo

- Backend: snake_case, FastAPI, Pydantic para validación, Repository Pattern
- Frontend: camelCase, React + TypeScript, Zustand para estado global
- API: REST, prefijo /api/v1, respuestas en JSON
- Commits: convencional (feat:, fix:, chore:)