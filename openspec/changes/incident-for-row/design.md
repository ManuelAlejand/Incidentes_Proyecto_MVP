## Context

El proyecto actualmente cuenta con un sistema de parseo dual, donde el backend y el frontend procesan arreglos horizontales dinámicos (`Inc1_...`, `Inc2_...` en una sola fila por proyecto) provenientes del documento de Excel.
Debido a regulaciones de escalabilidad y un futuro onboarding a base de datos, las cúpulas técnicas decidieron migrar la semántica del Excel a un formato de **"una fila por incidente"**. 

Esto impone que aquellos registros que no refieren directamente al incidente (p.ej "Nombre de Proyecto" y "SLAs") se repitan de manera idéntica en cascada para todas las filas agrupadas que componen a dicho proyecto. 

## Goals / Non-Goals

**Goals:**
- Adaptar `excel_parser.py` para usar `pandas.DataFrame.groupby('Nombre del Proyecto')`.
- Adaptar `incident_parser.py` para iterar mediante filas en lugar de bucles `Regex` de prefijos.
- Fortalecer la validación de schema en el endpoint de carga (`upload_excel`) asegurando un contrato estricto de 21 columnas en lugar de la expansión dinámica.
- Mantener la respuesta JSON idéntica para evitar impactar el Frontend Reactivity.

**Non-Goals:**
- Modificar componentes visuales de React.js de la parte de incidentes.
- Alterar la lógica existente del Dashboard que ya consume la versión `frontend` del parser. (El frontend ya está mapeado).
- Establecer base de datos SQL (solo se agrupa localmente con pandas).

## Decisions

- **Identificador de Grupo**: Se tomará `Nombre del Proyecto` como identificador base para usar `groupby` en pandas.
- **Primera Fila Cíclica**: Para todas las metricas de alto nivel estructurales (Total SLAs, SLAs Cumplidos, SLAs Comprometidos, MTTR Promedio, MTBF, Incidentes de BD/Gateway/Operativo, Incidentes Críticos Totales), se ejecutará `project_rows.iloc[0]` dado que este valor será redundante (idéntico) para todos los incidentes listados que pertenezcan al mismo proyecto.
- **Filtrado Estricto de Incidentes**: Las filas del proyecto original que dispongan la llave `Servicio del Incidente` vacía o como string vacío, no se contabilizarán como incidentes, pero sí aportarán al parseo general de la data agnóstica de resumen del proyecto (caso: proyectos sin incidentes pero con un sólo registro listando sus SLAs cumplidos).

## Risks / Trade-offs

- **Formato Rígido del Dataset**: Al requerir exactamente 21 columnas bajo la validación del endpoint, un usuario podría subir los datos con espacios o typos, y un error 422 paralizaría el flujo sin compasión.
- **Consumo de Memoria Dataframe**: Escalar de 1 fila a "N incidentes" filas incrementa teóricamente la profundidad del `DataFrame`; sin embargo, pandas escala extraordinariamente bien con estos volúmenes y solo afectará positivamente la migración estructurada.
