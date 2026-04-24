# Change 003: Desglose por impacto en card + filtros en tabla modal

## Tipo: ADDITIVE

## Nuevos archivos
- frontend/src/config/impactLevels.ts
- frontend/src/hooks/useTableFilters.ts
- frontend/src/components/shared/TableFilterBar.tsx

## Archivos modificados
- IncidentCard.tsx — agrega desglose visual por impacto
- IncidentModal.tsx — agrega TableFilterBar encima de la tabla

## Sin cambios
- GET /api/v1/projects/{id}/incidents — intacto
- incident_parser.py — intacto
- Gráfico de torta, resumen de métricas, análisis — intactos

## Nota de escalabilidad
useTableFilters y TableFilterBar son genéricos.
Se reutilizan en Servicios de Negocio, Resiliencia y
cualquier tabla futura que necesite filtros.