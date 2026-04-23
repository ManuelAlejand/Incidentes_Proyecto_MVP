## Context

La aplicación ya cuenta con un motor de parsing de Excel, pero la sección de "Servicios de Negocio" no está conectada a este flujo. Necesitamos extender el `incidentParser` para extraer los campos de servicio y calcular métricas granulares que alimenten tanto la tabla principal como el nuevo modal de detalle.

## Goals / Non-Goals

**Goals:**
- Agrupar incidentes por el campo `Servicio del Incidente`.
- Calcular la disponibilidad porcentual por servicio usando MTTR y Tiempo de Operación.
- Implementar un sistema de semaforización (Rojo/Amarillo/Verde) basado en el impacto.
- Renderizar una gráfica de tendencia de 6 meses (simulada según la salud actual).
- Proveer recomendaciones automáticas de capacidad basadas en reglas de negocio.

**Non-Goals:**
- Conexión real con APIs de monitoreo (se mantiene en el ámbito de ingesta de Excel).
- Persistencia de datos históricos de meses anteriores (se calculan/simulan en memoria).

## Decisions

1. **Estructura de Datos en Store**: Se extenderá el estado global para incluir un mapa de servicios procesados del proyecto activo. Esto permite que el Modal de Detalle acceda a la información sin volver a calcularla.
   - *Alternativa*: Cálculos "on-the-fly" en el componente. *Razón*: La lógica de clasificación es compleja y es mejor centralizarla en el parser.
2. **Cálculo de Disponibilidad en Minutos**: Todas las comparaciones se harán convirtiendo horas a minutos para evitar errores de precisión decimal con MTTRs pequeños.
3. **Simulación de Tendencia**: Al no tener el histórico de 6 meses en un solo archivo, se usará el nivel de incidentes actual como "semilla" para generar una curva de tendencia realista (descendente si hay muchos incidentes, estable si hay pocos).
4. **Causa Raíz (Moda)**: Se implementará una función de utilidad para encontrar la `Fuente del Incidente` más frecuente, que se mostrará en el análisis del modal.

## Risks / Trade-offs

- **[Riesgo]** Datos de servicios nulos en el Excel → **[Mitigación]** El sistema agrupará estos incidentes bajo el nombre del Proyecto o una etiqueta "General".
- **[Riesgo]** Rendimiento con cientos de servicios → **[Mitigación]** La tabla tendrá un scroll interno y se optimizará el renderizado de los iconos de impacto.
- **[Trade-off]** Despliegues hardcoded → Se acepta esta limitación por ahora siguiendo el requerimiento, marcándolos claramente en el código para futuras integraciones reales.
