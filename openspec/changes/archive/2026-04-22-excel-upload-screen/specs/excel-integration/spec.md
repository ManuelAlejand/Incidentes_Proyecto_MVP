## MODIFIED Requirements

### Requirement: Validación temprana frontend del archivo
El sistema SHALL validar tamaño antes de iniciar el request.

#### Scenario: Subida excede limite localmente
- **WHEN** el payload del archivo supera los 5MB
- **THEN** la recodificación interrumpe el post hacia `/api/v1/upload` previniendo errores 413.
