## MODIFIED Requirements

### Requirement: Selector de proyecto en el modal de incidentes
El modal de incidentes SHALL NOT tener un selector interno de proyectos. En su lugar, el sistema SHALL utilizar el proyecto seleccionado en el selector global del header para filtrar y mostrar los datos detallados.

#### Scenario: Sincronización con el header
- **WHEN** el usuario selecciona un proyecto en el header y abre el modal de incidentes
- **THEN** el modal muestra automáticamente el detalle del proyecto activo sin necesidad de selección adicional interna
