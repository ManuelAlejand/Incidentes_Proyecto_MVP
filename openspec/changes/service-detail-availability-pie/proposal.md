## Why

The current Service Detail Modal provides detailed metrics and trend analysis but lacks a high-level visual breakdown of availability by component type (e.g., Database, Middleware, OS). Adding a pie chart will allow users to quickly identify which component types are contributing most to the overall service availability status.

## What Changes

1.  **New Configuration**: Create a centralized color palette (`chartColors.ts`) for all pie charts in the application to ensure visual consistency.
2.  **New Component**: Create a reusable `AvailabilityPieChart` component that can visualize availability data by type.
3.  **UI Integration**: Insert the `AvailabilityPieChart` into the `ServiceDetailModal` between the component type detail and the availability trend chart.
4.  **Refactoring**: Update `IncidentModal` to use the new centralized color palette.

## Capabilities

### New Capabilities
- `service-type-availability-breakdown`: Adds a visual pie chart breakdown of availability by component type in the Service Detail Modal.

### Modified Capabilities
- `incident-source-chart`: Refactored to use centralized chart colors.

## Impact

- **Frontend**: New files `chartColors.ts` and `AvailabilityPieChart.tsx`. Modifications to `ServiceDetailModal.tsx` and `IncidentModal.tsx`.
- **Backend**: No changes required. Uses existing `by_type_summary` data.
- **Consistency**: Centralizes color management for charts.
