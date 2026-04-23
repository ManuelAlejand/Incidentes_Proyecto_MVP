## MODIFIED Requirements

### Requirement: Interfaz de carga (Drag and Drop) no invasiva
El sistema SHALL proveer una interfaz visual principal para que el usuario pueda subir su Excel, conviviendo con el resto del tablero.

#### Scenario: Visualización combinada
- **WHEN** un usuario accede a la plataforma principal
- **THEN** observa el componente de UploadZone en la cima de la pantalla.
- **AND THEN** observa debajo todos los gráficos del Dashboard con información default.

### Requirement: Tabla de pre-validación de carga
El sistema SHALL mostrar transparentemente la estructura de datos procesada al subir el archivo, inyectando un bloque visual específico.

#### Scenario: Subida procesada correcta
- **WHEN** el payload del archivo pasa la validación y parser.
- **THEN** se renderiza temporalmente una tabla arriba de todos los gráficos que expone renglón tras renglón lo que extrajo el sistema.
