## ADDED Requirements

### Requirement: Extracción dinámica de tiempos de respuesta
El sistema SHALL extraer los valores de `MTTR Promedio (minutos)` y `MTBF (horas)` de la fila de resumen correspondiente al proyecto seleccionado en el Excel.

#### Scenario: Visualización de datos tras carga
- **WHEN** el usuario carga un Excel válido y selecciona un proyecto
- **THEN** la card de Tiempos de Respuesta muestra los valores de MTTR y MTBF de ese proyecto

### Requirement: Formateo de MTTR (Minutos)
El sistema SHALL formatear el MTTR siguiendo estas reglas:
- Menos de 60 min: "{N}min"
- Exacto en horas: "{N}h"
- Otros: "{N}h {M}min"

#### Scenario: Formateo de 93 minutos
- **WHEN** el valor de MTTR es 93
- **THEN** el sistema muestra "1h 33min"

### Requirement: Formateo de MTBF (Horas)
El sistema SHALL formatear el MTBF siguiendo estas reglas:
- Menos de 1h: "{N*60}min"
- Exacto en horas: "{N}h"
- Otros: "{N}h {M}min"

#### Scenario: Formateo de 5.5 horas
- **WHEN** el valor de MTBF es 5.5
- **THEN** el sistema muestra "5h 30min"
