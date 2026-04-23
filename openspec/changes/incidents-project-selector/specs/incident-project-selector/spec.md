## ADDED Requirements

### Requirement: Selector de proyecto en el modal de incidentes
El modal de incidentes SHALL mostrar un dropdown con todos los proyectos únicos extraídos del Excel cargado, permitiendo al usuario cambiar entre proyectos y ver los datos de incidentes de cada uno.

#### Scenario: Modal abre con el primer proyecto seleccionado
- **WHEN** el usuario abre el modal de incidentes por primera vez tras cargar un Excel
- **THEN** el dropdown SHALL mostrar el primer proyecto de la lista como opción activa y el contenido del modal SHALL reflejar los datos de ese proyecto

#### Scenario: Usuario cambia de proyecto en el dropdown
- **WHEN** el usuario selecciona un proyecto diferente en el dropdown del modal
- **THEN** el resumen, el gráfico de torta, la tabla de incidentes y el análisis SHALL actualizarse inmediatamente con los datos del proyecto seleccionado

#### Scenario: Excel con un solo proyecto
- **WHEN** el Excel contiene filas de un único proyecto
- **THEN** el dropdown SHALL mostrar solo ese proyecto y NO SHALL mostrar la opción de cambio (puede mostrarse deshabilitado o como texto estático)

#### Scenario: Excel con múltiples proyectos
- **WHEN** el Excel contiene filas de N proyectos distintos (N > 1)
- **THEN** el dropdown SHALL listar los N proyectos en el orden en que aparecen en el Excel

### Requirement: Extracción de proyectos únicos al cargar el Excel
Al procesar el Excel, el sistema SHALL extraer la lista de valores únicos de la columna `Nombre del Proyecto` y persistirla en el store de estado de la aplicación.

#### Scenario: Carga exitosa de Excel con múltiples proyectos
- **WHEN** el usuario sube un Excel válido con filas de distintos proyectos
- **THEN** el store SHALL contener `projectNames` con la lista deduplicada de proyectos y `activeProjectName` SHALL apuntar al primer proyecto de la lista

#### Scenario: Reset del archivo
- **WHEN** el usuario limpia el archivo cargado
- **THEN** `projectNames` y `activeProjectName` en el store SHALL resetearse a sus valores iniciales (`[]` y `null` respectivamente)
