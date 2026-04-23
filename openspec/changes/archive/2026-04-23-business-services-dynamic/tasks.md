## 1. Procesamiento de Datos y Tipos

- [x] 1.1 Actualizar `incident.ts` para incluir las nuevas interfaces `ServiceSummary` y `ProjectIncident` (con soporte para Servicio y Fuente).
- [x] 1.2 Extender `incidentParser.ts` para realizar la agrupación por `Servicio del Incidente` dentro de cada proyecto.
- [x] 1.3 Implementar la lógica de clasificación de impacto (Crítico, Alto, Bajo) basada en las reglas compuestas del spec.
- [x] 1.4 Desarrollar la fórmula de disponibilidad mensual por servicio (MTTR vs Tiempo Operación) en el parser.

## 2. Tabla de Servicios de Negocio (UI Principal)

- [x] 2.1 Crear o actualizar la sección de "Servicios de Negocio" en `App.tsx` para que consuma los datos dinámicos.
- [x] 2.2 Implementar la barra de progreso para "Despliegues" con la lógica hardcoded (Verde/Amarillo/Rojo).
- [x] 2.3 Añadir indicadores visuales para "Capacidad" e "Impacto" siguiendo la semaforización definida.
- [x] 2.4 Asegurar que la tabla responda al cambio de proyecto en el selector global.

## 3. Modal de Detalle del Servicio

- [x] 3.1 Implementar la estructura del `ServiceDetailModal` con el header y las 5 secciones (Métricas, Tendencia, Capacidad, Despliegues, Análisis).
- [x] 3.2 Integrar Recharts para mostrar la gráfica de tendencia de disponibilidad de los últimos 6 meses (con variaciones realistas).
- [x] 3.3 Programar los mensajes dinámicos de la sección de Alertas de Capacidad.
- [x] 3.4 Implementar el Análisis de Incidentes que identifique la causa raíz más frecuente (Moda de la Fuente).

## 4. Pulido y Estilos Premium

- [x] 4.1 Aplicar estilos premium consistentes con el resto del dashboard (bordes suaves, sombras, tipografía limpia).
- [x] 4.2 Asegurar que el modal tenga una interacción fluida (cierre con clic fuera, botón X, etc.).
- [x] 4.3 Validar la visualización con los datos de "Claro Red Core" y "App Éxito Digital" del Excel de referencia.
- [x] 4.4 Se debe seguir con el mismo diseño del frontend existente.

