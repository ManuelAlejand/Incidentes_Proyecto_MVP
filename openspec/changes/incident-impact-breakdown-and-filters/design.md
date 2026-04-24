## Context

The application currently parses incident data from Excel and displays it in a card and a modal. While the data is dynamic, the presentation is static and lacks high-level summaries or interactive exploration tools.

## Goals / Non-Goals

**Goals:**
- Provide a clear, color-coded breakdown of incident impact on the dashboard.
- Enable multi-axis filtering in the incident modal without additional backend requests.
- Create generic, reusable frontend patterns (hooks/components) for future filtering needs.
- Maintain a premium, consistent look and feel with the rest of the dashboard.

**Non-Goals:**
- Modifying backend APIs or data parsing logic.
- Changing the existing incident MTTR calculation.
- Redesigning the pie charts or analytics sections of the modal.

## Decisions

- **Generic Hook Strategy**: Use a `useTableFilters` hook that manages the filtering logic centrally. This keeps components clean and makes the pattern reusable for any data list.
- **Dynamic Configuration**: Use an `IMPACT_LEVELS` configuration object to define colors and ordering, allowing for easy addition of new severity levels (e.g., Level 4, Level 5) without code changes in the components.
- **Pills vs Dropdown**: Implement an automatic switch in `TableFilterBar`. If a filter axis has more than 5 options, it transforms into a dropdown to prevent UI clutter.
- **Local Filtering**: All filtering happens on the frontend data already loaded in the store to ensure near-instant feedback and zero network overhead.

## Risks / Trade-offs

- **Memory Usage**: Filtering large lists (e.g., thousands of rows) in memory might have a slight performance impact, but for the current scale (hundreds of rows), it's the most efficient approach.
- **Consistency**: If the backend introduces new impact labels that aren't in the frontend config, they will default to a neutral gray style until added to the config.
