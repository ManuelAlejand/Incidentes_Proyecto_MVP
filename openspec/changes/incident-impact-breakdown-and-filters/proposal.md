## Why

The current incident card only shows total counts, which doesn't give immediate visibility into the severity of the situation. Users have to open the modal to see if there are critical issues. Additionally, the incident table in the modal can become large and difficult to navigate without filtering options by impact, service, or source.

## What Changes

1.  **Dashboard**: The Incident Card will now display a breakdown of incidents by impact level (Crítico, Alto, Bajo) using color-coded metrics. The total count color will also dynamically update to reflect the highest current severity.
2.  **Incident Modal**: A new generic filtering system will be added above the incident table. This includes a collapsible filter bar with pills for low-cardinality filters and dropdowns for high-cardinality filters.
3.  **Infrastructure**: Introduction of a generic `useTableFilters` hook and `TableFilterBar` component to ensure consistency and reusability across future features (like Business Services or Resilience tables).

## Capabilities

### New Capabilities
- `incidents-card-filters`: Visual breakdown of incidents by impact on the dashboard card and multi-axis filtering for the detail table.

### Modified Capabilities
- `incidents`: The underlying incident data remains the same, but the presentation and interaction requirements are extended to include impact-based categorization and filtering.

## Impact

- `App.tsx`: UI changes to the dashboard grid and incident modal sections.
- `useDataStore`: No changes needed as it already provides the necessary incident data.
- `incidentParser`: No changes needed as it already calculates the `impact` field.
- New components and hooks in `frontend/src/components/shared` and `frontend/src/hooks`.
