## 1. Foundation & Shared Logic

- [x] 1.1 Create `frontend/src/config/impactLevels.ts` with impact configurations and helpers.
- [x] 1.2 Create `frontend/src/hooks/useTableFilters.ts` with generic multi-axis filtering logic.
- [x] 1.3 Create `frontend/src/components/shared/TableFilterBar.tsx` reusable UI component.

## 2. Dashboard Card Update

- [x] 2.1 Identify Incident Card location in `App.tsx`.
- [x] 2.2 Refactor card to calculate impact counts from store data.
- [x] 2.3 Implement the three-column breakdown UI for Critical, High, and Low impacts.
- [x] 2.4 Apply dynamic color styling to the total count based on dominant severity.

## 3. Incident Modal Refactoring

- [x] 3.1 Identify Incident Modal table section in `App.tsx`.
- [x] 3.2 Integrate `useTableFilters` hook using `impact`, `service`, and `source` as axes.
- [x] 3.3 Inject `TableFilterBar` above the incident table.
- [x] 3.4 Update table rendering to use the `filteredData` from the hook.

## 4. Polishing & Verification

- [ ] 4.1 Verify collapsible behavior of the filter bar.
- [ ] 4.2 Verify "Pills vs Dropdown" logic with more than 5 items.
- [ ] 4.3 Ensure Pie Chart and Analytics remain unaffected by table filters.
- [ ] 4.4 Final design check for premium look and feel.
