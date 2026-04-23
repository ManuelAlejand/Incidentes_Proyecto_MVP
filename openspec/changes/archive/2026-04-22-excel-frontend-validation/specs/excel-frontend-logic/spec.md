## ADDED Requirements

### Requirement: Parseo de hojas de cálculo
El sistema SHALL leer binarios de excel cargados temporalmente en el cliente con SheetJS o nativo, transformando filas en objetos JSON dict.

#### Scenario: Subida XLSX
- **WHEN** el usuario dropea un archivo excel al componente
- **THEN** la app parsea sus columnas.

### Requirement: Validación simulada de reglas fuertes de negocio (Backend logic temporal)
El sistema SHALL validar si están las columnas que en el backend serían obligatorias. Además, asumirá nulos como 0 temporalmente, reportará error si no tiene suficientes datos.

#### Scenario: Validador detecta mala estructura
- **WHEN** el excel parseado no contiene las llaves esperadas de "Incidentes Críticos Totales".
- **THEN** retorna error en el frontend cortando la tabla.
