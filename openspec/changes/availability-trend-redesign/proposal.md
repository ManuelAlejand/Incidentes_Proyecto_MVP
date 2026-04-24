## Why

The current global availability detail view is basic and lacks historical context and technical drill-down capabilities. Users need to see how availability evolves over different time periods (6 months, 3 months, or daily slots) and how specific technical components (Database, OS, etc.) contribute to the overall metric. Additionally, there is a need to standardize UI components across different detail modals to ensure a consistent premium aesthetic.

## What Changes

- **Backend**: Implementation of a new endpoint `GET /api/v1/projects/{id}/availability/trend` that provides time-series data with support for simulated MVP data.
- **Frontend**: Redesign of the `AvailabilityGlobalModal` to include period toggles, intraday slot selectors, and component-type tabs.
- **Shared Components**: Creation of a library of reusable UI components (`TrendChart`, `PeriodToggle`, `SlotSelector`, `ComponentTypeTabs`) and a custom hook `useAvailabilityTrend`.
- **Refactoring**: Updating `ServiceDetailModal` to use the new shared components, ensuring design parity between global and service-specific details.

## Capabilities

### New Capabilities
- `availability-trend-modal`: Implementation of the redesigned global availability modal with time-period filtering and technical component drill-down.

### Modified Capabilities
- None.

## Impact

- **API**: New route `/api/v1/projects/{id}/availability/trend`.
- **Frontend**: `AvailabilityModal.tsx` (redesigned), `ServiceDetailModal.tsx` (refactored), new `src/components/shared/` directory, new `src/hooks/` and `src/services/` additions.
- **Backend Services**: New `trend_builder.py` service.
