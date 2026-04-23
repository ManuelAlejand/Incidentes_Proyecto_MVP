## Why

Actualmente, la disponibilidad se muestra a nivel de proyecto y servicio, pero carece de granularidad para visualizar el estado de los componentes individuales (Bases de Datos, Servidores, Capa Media) que sostienen cada servicio. Este cambio permite a los usuarios profundizar en la disponibilidad técnica de cada servicio de negocio, facilitando la identificación de cuellos de botella específicos por tipo de componente.

## What Changes

- **Integración de Datos de Hoja 2**: El sistema ahora consumirá la hoja "Componentes de Disponibilidad" del Excel para calcular métricas detalladas.
- **Selector de Componentes en Modal**: Se añadirá un sistema de pestañas (Tabs) o botones de selección en el modal de detalle del servicio para alternar entre diferentes tipos de componentes (BD, Windows, Linux, etc.).
- **Visualización Dinámica**: Las gráficas de tendencia y las métricas actuales del modal se actualizarán en tiempo real basándose en el componente seleccionado.
- **Disponibilidad Global**: La tarjeta del header del dashboard principal se actualizará para reflejar el promedio de promedios en general de todos los componentes de todos los servicios y no cambia, aunque se selccione un proyecto especifico.
- **Disponibilidad por Servicio**: La tarjeta del header del dashboard de servicios se actualizará para reflejar el promedio de promedios en general de todos los componentes de todos los servicios por proyecto seleccionado y por tipo de componente seleccionado.
- **Disponibilidad por Componente**: La tarjeta del header del dashboard de servicios se actualizará para reflejar el promedio de promedios en general de todos los componentes de todos los servicios por proyecto seleccionado y por tipo de componente seleccionado.

## Capabilities

### New Capabilities
- `component-level-availability`: Capacidad de filtrar y visualizar métricas de disponibilidad a nivel de componentes individuales dentro de un servicio de negocio.
- `availability-trend-generation`: Lógica para generar tendencias históricas basadas en datos reales o variaciones controladas para el MVP.

### Modified Capabilities
- `availability`: Se actualiza la lógica de cálculo global y de servicio para utilizar los datos de componentes detallados.

## Impact

- **Backend**: Nuevo servicio `availability_parser.py`, nuevo router `availability.py` y actualizaciones en `data_repository.py`.
- **Frontend**: Nuevo `ServiceDetailModal.tsx`, `AvailabilityModal.tsx` y actualizaciones en el store de datos y componentes de KPI.
- **Configuración**: Actualización de `config.yaml` para definir tipos de componentes y umbrales de capacidad.
