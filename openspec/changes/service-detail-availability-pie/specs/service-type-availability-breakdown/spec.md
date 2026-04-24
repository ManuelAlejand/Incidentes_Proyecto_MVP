## ADDED Requirements

### Requirement: Availability Pie Chart Visualization
The Service Detail Modal must include a pie chart that visualizes the average availability of each component type within the service.

#### Scenario: Multiple Component Types
- **WHEN** a service has more than one component type (e.g., Database and OS).
- **THEN** a pie chart must be displayed between the component tabs and the trend chart.
- **THEN** each slice must represent a component type's average availability.
- **THEN** the legend must show the type name and the availability percentage.

#### Scenario: Color Mapping
- **WHEN** a component type's availability is greater than or equal to the service target (meta).
- **THEN** its percentage in the legend must be displayed in green (#16A34A).
- **WHEN** it is below the target.
- **THEN** its percentage must be displayed in red (#DC2626).

#### Scenario: Single Component Type
- **WHEN** a service has 0 or 1 component types.
- **THEN** the pie chart section must not be rendered.

### Requirement: Centralized Chart Colors
The application must use a centralized configuration for pie chart colors to ensure consistency across different modules (Incident and Availability).

#### Scenario: Incident Modal Refactoring
- **WHEN** the Incident Modal renders its failure source pie chart.
- **THEN** it must use the same color palette as the Availability Pie Chart.
