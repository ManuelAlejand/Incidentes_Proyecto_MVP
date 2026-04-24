## Context

The availability dashboard currently shows a list of services and their details in a modal. The `ServiceDetailModal` contains multiple sections: metrics, tabs by component type, detail of components, trend charts, capacity alerts, and deployment history. The data returned by the backend already includes a `by_type_summary` array which is currently underutilized in the UI.

## Goals / Non-Goals

**Goals:**
- Provide a visual breakdown of availability by component type using a pie chart.
- Ensure visual consistency with the existing Incident Modal pie chart.
- Centralize chart color configuration to avoid hardcoded values across multiple components.
- Implement a robust, reusable component that handles edge cases (e.g., empty data, single data point).

**Non-Goals:**
- Modifying backend endpoints or data structures.
- Changing the existing logic for trend charts or capacity alerts.
- Adding new data fetching calls.

## Decisions

- **Centralized Colors**: Move hardcoded colors from `IncidentModal.tsx` to a new `src/config/chartColors.ts`. Use a modulo-based access helper to support any number of categories gracefully.
- **Reusable Component**: `AvailabilityPieChart` will be created in `src/components/shared/`. It will be a functional component using `recharts`' `PieChart`, `Cell`, `Tooltip`, and `Legend`.
- **Conditional Rendering**: The pie chart will hide itself if there are fewer than 2 component types, as a single-slice pie chart adds no value over the existing summary metrics.
- **Positioning**: The chart will be inserted precisely between the component detail section and the trend chart section to provide a bridge between granular component status and historical trends.

## Risks / Trade-offs

- **Layout Complexity**: Adding a new section to an already dense modal might increase vertical scrolling. The chart height will be kept at 220px (consistent with incidents) to mitigate this.
- **Color Collision**: If a service has many types, colors might repeat. However, the `by_type_summary` typically has 3-6 types, well within the 8-color palette.
