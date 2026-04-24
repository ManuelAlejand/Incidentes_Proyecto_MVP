## Context

The availability module currently lacks a comprehensive view of historical trends. While the service detail modal has a basic chart, the global availability modal is underspecified. This design addresses the need for a standardized, robust trend visualization system that works for both global and service-specific views, supporting multiple time resolutions.

## Goals / Non-Goals

**Goals:**
- **Standardization**: Create a suite of shared components (`TrendChart`, `PeriodToggle`, etc.) to be used in all detail modals.
- **Flexibility**: Support 6-month, 3-month, and intraday (6-hour slots) trend views.
- **Drill-down**: Allow filtering by technical component types (e.g., Database, OS).
- **MVP Simulation**: Implement a logic in the backend to generate realistic simulated history based on the single month of real data available in the Excel.

**Non-Goals:**
- Changing the layout or metrics of the main dashboard cards.
- Implementing a persistent database for history (stays in memory/filesystem for MVP).
- Modifying the existing `GET /api/projects/{id}/availability` endpoint.

## Decisions

- **Modular Backend**: Create `trend_builder.py` and `availability_trend.py` router to keep the new logic isolated.
- **Unified Contract**: All trend periods will return the same `TrendResponse` structure, using the `label` field to distinguish between months and time slots.
- **Stateless Simulation**: The backend will generate simulated points on-the-fly using a deterministic seed or simple variation logic around the real data point to ensure "stable" simulation during a session.
- **Frontend Hook**: Use `useAvailabilityTrend` as a centralized way to fetch and manage trend state, including `AbortController` support to handle rapid filter changes.

## Risks / Trade-offs

- **Data Accuracy Indicator**: Simulated data might be confused with real history. **Mitigation**: Use the `is_simulated` flag and UI indicators (tooltips/badges) as per spec.
- **Frontend Complexity**: Adding multiple filters (Period, Slot, Type) increases state complexity. **Mitigation**: Encapsulate logic in the custom hook.
