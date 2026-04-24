## 1. Backend Implementation

- [x] 1.1 Create `backend/app/models/trend.py` with Pydantic models (TrendPoint, TrendResponse).
- [x] 1.2 Create `backend/app/services/trend_builder.py` with logic for monthly and intraday simulation.
- [x] 1.3 Create `backend/app/routers/availability_trend.py` with the GET endpoint.
- [x] 1.4 Register the new router in `backend/app/main.py`.

## 2. Frontend Infrastructure & Shared Components

- [x] 2.1 Define types in `frontend/src/types/trend.ts`.
- [x] 2.2 Create `frontend/src/services/trendService.ts` for API calls.
- [x] 2.3 Implement `frontend/src/hooks/useAvailabilityTrend.ts` with AbortController.
- [x] 2.4 Create `TrendChart.tsx` (line chart with meta line).
- [x] 2.5 Create `PeriodToggle.tsx` (6M, 3M, HOY).
- [x] 2.6 Create `SlotSelector.tsx` (Intraday slots).
- [x] 2.7 Create `ComponentTypeTabs.tsx` (Dynamic component tabs).

## 3. UI Implementation & Refactoring

- [x] 3.1 Redesign `AvailabilityGlobalModal.tsx` using the new shared components.
- [x] 3.2 Update `App.tsx` if necessary to trigger the new modal correctly (ensure no dashboard changes).
- [ ] 3.3 Refactor `ServiceDetailModal.tsx` (Revertido: El usuario prefiere mantener la lógica y diseño original para este modal).

## 4. Verification

- [x] 4.1 Verify trend endpoints return expected simulated data.
- [x] 4.2 Test period switching in global modal.
- [x] 4.3 Test component type filtering in global modal.
- [x] 4.4 Verify design parity between global and service modals.
