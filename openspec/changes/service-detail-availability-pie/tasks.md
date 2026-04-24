## 1. Foundation & Configuration

- [x] 1.1 Create `src/config/chartColors.ts` with the centralized pie chart palette.
- [x] 1.2 Implement `getPieColor(index)` helper function for color rotation.

## 2. Reusable Component Development

- [x] 2.1 Create `src/components/shared/AvailabilityPieChart.tsx` implementing a Recharts `PieChart`.
- [x] 2.2 Implement custom legend with status-based coloring (green/red vs target).
- [x] 2.3 Add guard clauses for empty data or single-category data.
- [x] 2.4 Ensure consistent styling with the Incident distribution chart.

## 3. Incident Modal Refactoring

- [x] 3.1 Locate the incident distribution chart in `src/App.tsx` (Incident Modal section).
- [x] 3.2 Replace hardcoded colors with imports from `chartColors.ts`.
- [x] 3.3 Verify the visual output remains identical but now uses the centralized system.

## 4. Service Detail Integration

- [x] 4.1 Import `AvailabilityPieChart` in `src/components/availability/ServiceDetailModal.tsx`.
- [x] 4.2 Map `service.by_type_summary` data to the chart component.
- [x] 4.3 Insert the chart component between the component detail cards and the trend chart.
- [x] 4.4 Verify responsiveness and layout integrity of the modal.

## 5. Verification & Polish

- [x] 5.1 Test with services having multiple component types.
- [x] 5.2 Test with services having only one component type (ensure chart is hidden).
- [x] 5.3 Verify tooltip formatting and legend color logic.
- [x] 5.4 Check that adding new types in the Excel/Backend propagates correctly without code changes.

