## ADDED Requirements

### Requirement: Selector Global en Header
El sistema SHALL mostrar un dropdown en el header del dashboard que permita seleccionar el proyecto activo de entre todos los nombres de proyectos únicos encontrados en el Excel cargado.

#### Scenario: Cambio de proyecto global
- **WHEN** el usuario selecciona un nuevo proyecto en el header
- **THEN** todas las cards del dashboard (Incidentes y Tiempos de Respuesta) se actualizan simultáneamente para mostrar los datos de ese proyecto

### Requirement: Persistencia del proyecto seleccionado
El sistema SHALL mantener el proyecto seleccionado en el store global (Zustand) para asegurar la consistencia entre componentes y modales.

#### Scenario: Consistencia en modal
- **WHEN** el usuario cambia el proyecto en el header y abre el modal de incidentes
- **THEN** el modal muestra la información detallada del proyecto seleccionado en el header
