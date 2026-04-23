## Why

La sección de "Servicios de Negocio" actualmente es estática y no refleja la realidad operativa de los proyectos cargados. Hacerla dinámica permitirá visualizar la disponibilidad real, el nivel de impacto de los incidentes por servicio y ofrecerá un detalle profundo mediante un modal interactivo, facilitando la toma de decisiones basada en datos reales del Excel.

## What Changes

- **Parsing por Servicio**: El sistema agrupará los incidentes por `Servicio del Incidente` dentro de cada proyecto.
- **Clasificación Dinámica de Alertas**: Implementación de niveles (Crítico, Alto, Bajo) basados en reglas de negocio (Total incidentes vs MTTR).
- **Tabla de Servicios Interactiva**: Visualización en tiempo real de disponibilidad, incidentes, despliegues y capacidad.
- **Modal de Detalle Profundo**: Nueva interfaz con gráficas de tendencia, análisis de causa raíz y recomendaciones automáticas basadas en la salud del servicio.
- **Cálculo de Disponibilidad**: Implementación de la fórmula de disponibilidad basada en el tiempo total de operación y el MTTR acumulado por servicio.

## Capabilities

### New Capabilities
- `business-services-dynamic`: Lógica de agrupación, clasificación y visualización de la tabla de servicios de negocio.
- `service-detail-modal`: Interfaz detallada para el análisis profundo de un servicio específico.

### Modified Capabilities
- `excel-ingestion`: Soporte para procesar las columnas de servicios, fallas y tiempos de operación.

## Impact

- `App.tsx`: Actualización de la tabla principal y manejo del estado del modal de detalle.
- `incidentParser.ts`: Nueva lógica de agregación y cálculo de métricas por servicio.
- `dataStore.ts`: Almacenamiento de los resúmenes de servicios por proyecto.
- `formatTime.ts`: Uso extendido de utilidades de tiempo para los reportes de disponibilidad.
