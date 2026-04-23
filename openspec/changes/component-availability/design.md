## Context

La aplicación actual muestra la disponibilidad a nivel general en el dashboard. El usuario requiere visualizar el detalle técnico de los componentes que conforman cada "Servicio de Negocio". Estos datos residen en la "Hoja 2" del archivo Excel. El diseño debe permitir navegar entre tipos de componentes dentro de un modal sin alterar la estética actual de la tabla principal.

## Goals / Non-Goals

**Goals:**
- Implementar el cálculo de "Disponibilidad Global" como un promedio de promedios por tipo de componente.
- Crear un sistema de pestañas (Tabs) en el modal de detalle del servicio.
- Asegurar que la tabla "Servicios de Negocio" en el dashboard principal permanezca idéntica en apariencia.
- Implementar la lógica de "Alertas de Capacidad" basada en el conteo de incidentes de la Hoja 1.
- Generar tendencias de 6 meses (reales o simuladas para el MVP).

**Non-Goals:**
- No se modificará la estructura visual de la tarjeta "Servicios de Negocio" en el dashboard principal.
- No se implementará integración con APIs de monitoreo externas en esta fase (se mantiene basado en Excel).

## Decisions

- **UI del Modal**: Las pestañas de selección de componente se ubicarán debajo de la sección de "Métricas Actuales" y arriba de la gráfica de tendencia. Se utilizará un estilo de "Segmented Control" o "Pills" para mantener la estética premium.
- **Lógica de Cálculo Global**: Se adoptará el método de "promedio de promedios" para evitar que un tipo de componente con muchos elementos sesgue el resultado global.
- **Agrupación en Frontend**: El componente `ServiceDetailModal` manejará un estado local `activeType` para filtrar los datos de `by_type` recibidos del backend.
- **Detección de Tipos**: Los tipos de componentes se leerán dinámicamente de `config.yaml` y de los datos presentes en el Excel.

## Risks / Trade-offs

- **Dependencia de Hoja 2**: Si el usuario sube un Excel sin la Hoja 2, el sistema debe manejar el error graciosamente o mostrar un estado vacío informativo.
- **Datos de Tendencia Simulados**: Para el MVP, la tendencia simulada (±0.5%) podría no reflejar la realidad técnica exacta hasta que se carguen múltiples periodos.
- **Consistencia de Nombres**: Los nombres de proyectos y servicios deben coincidir exactamente entre la Hoja 1 y la Hoja 2 para que el cruce de datos sea efectivo.
