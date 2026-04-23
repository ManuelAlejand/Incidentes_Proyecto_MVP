## MODIFIED Requirements

### Requirement: Cálculo del total de incidentes
El total de incidentes mostrado en la card del dashboard y en el resumen del modal SHALL calcularse como la suma de las siguientes columnas de resumen del Excel para el proyecto activo: `Incidentes Críticos Totales`, `Número de Fallas`, `Incidentes Recurrentes`, `Incidentes por Error Operativo`, `Incidentes por Base de Datos`, `Incidentes por API Gateway`. Si existen filas de detalle (`Servicio del Incidente` no vacío), el conteo de filas de detalle SHALL ser la fuente primaria; la suma de columnas de resumen SHALL ser el fallback cuando no hay filas de detalle.

#### Scenario: Excel con filas de detalle de incidentes
- **WHEN** el proyecto activo tiene filas donde `Servicio del Incidente` no está vacío
- **THEN** el total SHALL ser el conteo de esas filas de detalle

#### Scenario: Excel solo con columnas de resumen (sin filas de detalle)
- **WHEN** el proyecto activo no tiene filas con `Servicio del Incidente` poblado
- **THEN** el total SHALL ser la suma de: `Incidentes Críticos Totales` + `Número de Fallas` + `Incidentes Recurrentes` + `Incidentes por Error Operativo` + `Incidentes por Base de Datos` + `Incidentes por API Gateway`

#### Scenario: Columnas de resumen con valores vacíos o cero
- **WHEN** alguna de las 6 columnas de resumen está vacía o es 0
- **THEN** esa columna SHALL contribuir con 0 al total, sin causar errores

### Requirement: Card del dashboard refleja el proyecto activo
La card de incidentes en el dashboard SHALL mostrar el total calculado del proyecto identificado por `activeProjectName` en el store. Si no hay proyecto activo, SHALL mostrar el dato del primer proyecto del Excel.

#### Scenario: Proyecto activo seleccionado
- **WHEN** `activeProjectName` está definido en el store y hay datos del Excel
- **THEN** la card SHALL mostrar el total de incidentes de ese proyecto específico

#### Scenario: Sin proyecto activo (primera carga)
- **WHEN** se carga el Excel y `activeProjectName` aún no fue seleccionado manualmente
- **THEN** la card SHALL mostrar el total del primer proyecto del Excel
