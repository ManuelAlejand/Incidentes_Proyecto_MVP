## ADDED Requirements

### Requirement: Availability Trend Endpoint
The system must provide a new endpoint `GET /api/v1/projects/{project_id}/availability/trend` that supports filtering by period (6m, 3m, day), intraday slots, and component type.

#### Scenario: Fetching 6-month trend
- **WHEN** the user requests a 6m period for a project.
- **THEN** the system returns a list of 6 trend points, where the last point is real data and previous points are simulated.

#### Scenario: Fetching Intraday trend
- **WHEN** the user requests a 'day' period.
- **THEN** the system returns 4 data points representing 6-hour slots (0-6, 6-12, 12-18, 18-24).

### Requirement: Shared Trend UI Components
The system must provide reusable components for trend visualization that can be used in both Global and Service detail modals.

#### Scenario: Rendering TrendChart
- **WHEN** data points are provided.
- **THEN** it renders a line chart with labels on each point and a dotted meta line.

#### Scenario: Switching periods
- **WHEN** the user clicks on '3M' in the PeriodToggle.
- **THEN** the `useAvailabilityTrend` hook refetches data and the chart updates immediately.

### Requirement: Technical Component Drill-down
The Global Availability modal must allow users to filter the trend by technical component type.

#### Scenario: Selecting a component type
- **WHEN** the user clicks on 'Base de Datos' tab.
- **THEN** the trend chart and the current availability value update to reflect only that component type.
