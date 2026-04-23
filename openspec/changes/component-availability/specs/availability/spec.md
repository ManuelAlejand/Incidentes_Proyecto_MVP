## ADDED Requirements

### Requirement: Cálculo de Disponibilidad Global (Hoja 2)
La disponibilidad global debe calcularse como el promedio de los promedios por tipo de componente definidos en la Hoja 2.

#### Scenario: Cálculo con múltiples componentes del mismo tipo
- **WHEN** el proyecto tiene 10 componentes de "SO Linux" y 2 de "Base de Datos"
- **THEN** el global es `(promedio(SO Linux) + promedio(Base de Datos)) / 2`, dando igual peso a cada bloque tecnológico.

### Requirement: Navegación por Tipo de Componente en Modal
El modal de detalle del servicio debe permitir filtrar la información técnica por tipo de componente.

#### Scenario: Visualización de componentes en el modal
- **WHEN** el usuario selecciona la pestaña "Base de Datos"
- **THEN** la gráfica de tendencia muestra solo datos de BD y la lista de componentes muestra solo las bases de datos de ese servicio.

### Requirement: Alertas de Capacidad Dinámicas
Las alertas de capacidad y recomendaciones deben generarse automáticamente basadas en el número de incidentes de la Hoja 1 para ese servicio.

#### Scenario: Umbral de alerta roja
- **WHEN** un servicio tiene 5 o más incidentes en la Hoja 1
- **THEN** el estado de capacidad es "alert", se muestran mensajes de saturación de recursos y se recomienda acción inmediata.

### Requirement: Generación de Tendencia Histórica (MVP)
Si no hay datos reales de meses anteriores, el sistema debe simular la tendencia para visualización.

#### Scenario: Simulación de tendencia
- **WHEN** solo existe el mes actual en el Excel
- **THEN** el sistema genera 5 meses previos con variaciones aleatorias de ±0.5% respecto al valor actual.
