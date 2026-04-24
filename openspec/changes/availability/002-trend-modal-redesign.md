# Change 002: Rediseño modal disponibilidad + endpoint de tendencia

## Tipo: ADDITIVE — sin cambios a código existente

## Nuevo endpoint
GET /api/v1/projects/{id}/availability/trend
Manejado por: availability_trend.py + trend_builder.py

## Nuevos componentes shared
TrendChart, PeriodToggle, SlotSelector, ComponentTypeTabs
Ubicación: frontend/src/components/shared/

## Nuevo hook
useAvailabilityTrend — encapsula fetching y estado

## Refactorización pendiente
ServiceDetailModal debe migrar a usar los componentes shared
en un paso posterior sin afectar funcionalidad.

## Nada tocado
availability_parser.py — intacto
GET /api/v1/projects/{id}/availability — intacto
Card del dashboard — intacta

## Decisión de diseño
PeriodToggle usa el mismo sistema visual que ComponentTypeTabs.
Ambos comparten la misma clase base CSS/Tailwind.
Diferencia: PeriodToggle siempre tiene exactamente 3 opciones fijas.
ComponentTypeTabs tiene N opciones dinámicas según el proyecto.