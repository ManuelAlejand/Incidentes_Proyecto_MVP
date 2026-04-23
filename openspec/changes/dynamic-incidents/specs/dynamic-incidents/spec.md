## ADDED Requirements

### Requirement: Modal de Incidentes Embebidas
El sistema SHALL calcular en cliente el objeto dinámico `IncidentResponse` dictado en `specs/incidents/spec.md` cuando se visualice un componente asociado a incidencias.

#### Scenario: Parseo Dinámico O-Demand
- **WHEN** el UI levanta el Modal de un proyecto cargado
- **THEN** el helper busca las columnas `IncN_*` sobre la fila respectiva y construye array formatizado (MTTR horas/min, impactos de color).

### Requirement: Consumo de estado nativo
El modal SHALL dibujar los datos respetando la estrcutura intacta original de colores Rechart e Iconografía.

#### Scenario: Visualización del Panel
- **WHEN** el cálculo de los incidentes enlista 2 orígenes distintos
- **THEN** Recharts absorbe ese array pintando 2 segmentos, y la tabla inferior lista 2 filas bajo el formato requerido sin desfigurarse.
