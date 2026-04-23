## 1. Utilities and Parser Update

- [x] 1.1 Crear `frontend/src/utils/formatTime.ts` con las funciones `formatMTTR` y `formatMTBF` según las reglas del spec.
- [x] 1.2 Actualizar `frontend/src/services/incidentParser.ts` para extraer `MTTR Promedio (minutos)` y `MTBF (horas)` de la fila de resumen del proyecto.
- [x] 1.3 Modificar el tipo `IncidentResponse` y el retorno del parser para incluir estas métricas.

## 2. UI Refactoring (Project Selector)

- [x] 2.1 Mover la lógica del selector de proyectos desde el modal de incidentes hacia el header principal en `App.tsx`.
- [x] 2.2 Estilizar el selector global para que luzca premium en el header (borde blanco, fondo transparente/blanco, fuente pequeña).
- [x] 2.3 Eliminar el selector interno y cualquier lógica de selección redundante dentro del modal de incidentes en `App.tsx`.

## 3. Dynamic Response Times Card

- [x] 3.1 Actualizar la sección de "Tiempos de Respuesta" en `App.tsx` para que consuma datos de `dynamicIncidents`.
- [x] 3.2 Aplicar las utilidades de formateo (`formatMTTR`, `formatMTBF`) a los valores mostrados en la card.
- [x] 3.3 Asegurar que la card muestre "--" o valores por defecto cuando no hay un Excel cargado.

## 4. Verification

- [x] 4.1 Validar que el selector global sincronice correctamente todas las cards del dashboard.
- [x] 4.2 Verificar que el formateo de MTBF maneje correctamente los decimales (ej: 0.5h -> 30min).
