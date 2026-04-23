## 1. Backend: Repositorio y Configuración

- [x] 1.1 Modificar `backend/app/repositories/data_repository.py` para leer la Hoja 2 ("Componentes de Disponibilidad").
- [x] 1.2 Actualizar `config.yaml` con las nuevas secciones de `availability` (tipos de componentes y umbrales de capacidad).

## 2. Backend: Parser y Routers

- [x] 2.1 Crear `backend/app/services/availability_parser.py` con la lógica de cálculo global y por servicio.
- [x] 2.2 Implementar la generación de tendencia histórica (real vs simulada).
- [x] 2.3 Crear `backend/app/routers/availability.py` con el endpoint GET /availability.
- [x] 2.4 Actualizar `backend/app/routers/upload.py` para validar la existencia de la Hoja 2.

## 3. Frontend: Servicios y Tipos

- [x] 3.1 Crear `frontend/src/types/availability.ts` con las interfaces del contrato.
- [x] 3.2 Crear `frontend/src/services/availabilityService.ts` para llamadas al API.
- [x] 3.3 Actualizar `frontend/src/store/dataStore.ts` para manejar el estado de disponibilidad.

## 4. Frontend: Componentes y Modales

- [x] 4.1 Actualizar la tarjeta "Disponibilidad Global" en el header para usar los nuevos datos dinámicos.
- [x] 4.2 Crear `frontend/src/components/availability/AvailabilityModal.tsx` para el detalle global.
- [x] 4.3 Rediseñar `ServiceDetailModal.tsx` (o crear `frontend/src/components/availability/ServiceDetailModal.tsx`) para incluir el selector de componentes (Tabs) y las secciones dinámicas.
- [x] 4.4 Integrar el selector de componentes en el modal para filtrar gráficas y tablas de componentes.

## 5. Verificación y Pulido

- [x] 5.1 Verificar que la tabla "Servicios de Negocio" en el dashboard principal no haya cambiado estéticamente.
- [x] 5.2 Validar el cruce de datos entre Hoja 1 e Hoja 2 para las alertas de capacidad.
- [x] 5.3 Asegurar que el cambio de proyecto actualice correctamente todas las métricas de disponibilidad.

