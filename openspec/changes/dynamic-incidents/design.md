## Context

Actualmente el modal de incidentes carga su analítica, sus gráficas Recharts de pastel y sus colores duro desde `data.ts`. La nueva funcionalidad requiere interpretar dinámicamente un Excel parseado para generar ese mismo volumen de datos en una estructura TypeScript idéntica, permitiéndo a los componentes mapear la realidad sin modificar el layout.

## Goals / Non-Goals

**Goals:**
- Traducir la lógica de validación de incidentes y cálculos de MTTR especificada para Python/FastAPI (`specs/incidents/spec.md`) a TypeScript plano en el cliente.
- Procesar arrays dinámicos identificando las columnas cuyo string coincida con `regex(/Inc\d+_Servicio/)`.
- Respetar cada condicional de color ('Crítico' -> 'red', 'Alto' -> 'orange', etc.) para los badges e inyectarlo sobre el HTML sin destruir o deformar las tablas.

**Non-Goals:**
- Almacenar esta metadata en el Storage de forma persistente como un estado inmenso. Puesto que es una vista derivada de un click, los cálculos dinámicos de JSON a `IncidentResponse` sucederán bajo demanda cada vez que alguien dé clic al Servicio seleccionado.

## Decisions

- **incidentParser.ts Service:** Esta utilidad pura extraerá la fila correcta del `parsedExcelRawData` en Zustand basada en el ID del proyecto y retornará un objecto `IncidentResponse` que la UI asimilará.
- **Transversalidad de Colores:** A diferencia de colores embebidos en el CSS como tokens, inyectaremos clases o variables `style` en base a los enums "red", "orange", "green" pasados por el parser ya que el requisito indica inyección estricta del modelo y preservación de interfaz.

## Risks / Trade-offs

- Re-calcular sobre un excel extremadamente grande puede congelar la UI unos microsegundos.
  - *Mitigación:* Se espera no tener más de 10-20 filas por proyecto en los archivos típicos MVP. El filtrado será O(N) muy ligero dentro del marco de JSON.
