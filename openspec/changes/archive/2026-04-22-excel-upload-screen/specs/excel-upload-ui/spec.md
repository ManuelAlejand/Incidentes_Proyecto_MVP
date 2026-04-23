## ADDED Requirements

### Requirement: Interfaz de carga (Drag and Drop)
El sistema SHALL proveer una interfaz visual principal vacía para que el usuario pueda subir su Excel.

#### Scenario: Pantalla inicial
- **WHEN** el usuario accede al sistema sin datos anteriores persistidos
- **THEN** aparece en pantalla central la opción "Arrastra tu archivo Excel aquí o haz clic para seleccionar".

#### Scenario: Validación de tamaño antes de enviar
- **WHEN** el usuario arrastra un archivo de 7MB
- **THEN** el sistema alerta de inmediato que el límite de 5MB fue excedido sin tan solo conectarse en la red.

### Requirement: Almacén de Estado con Persistencia
El sistema SHALL mantener los datos ingresados ante recargas usando Zustand y sessionStorage.

#### Scenario: Recarga de pantalla
- **WHEN** el usuario ya observaba en el dashboard las métricas extraídas del Excel
- **THEN** al presionar F5/Recargar página, los datos son recuperados automáticamente de la sessionStorage.
