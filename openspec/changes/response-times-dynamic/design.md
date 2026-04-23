## Context

Actualmente, el dashboard tiene una capacidad dinámica para incidentes, pero los tiempos de respuesta (MTTR/MTBF) siguen siendo estáticos. Además, el selector de proyectos está "atrapado" dentro del modal de incidentes, lo que rompe la sincronía visual del dashboard.

## Goals / Non-Goals

**Goals:**
- Centralizar la selección de proyecto en el Header de la aplicación.
- Hacer que la card de "Tiempos de Respuesta" consuma datos reales del Excel.
- Refactorizar el store para que el proyecto activo sea accesible globalmente.

**Non-Goals:**
- No se creará un endpoint nuevo en el backend (los datos ya están en el frontend tras el upload).
- No se modificará el diseño visual de las cards (se mantiene la estética premium actual).

## Decisions

- **Selector Global**: Se moverá el selector `<select>` del modal a `App.tsx` (Header). Esto simplifica la UI y asegura que todo el informe hable del mismo proyecto.
- **Refactor de `incidentParser.ts`**: Se modificará el retorno del parser para incluir `mtbf_hours` y `mttr_minutes` extraídos directamente de las columnas de resumen (`MTTR Promedio (minutos)` y `MTBF (horas)`).
- **Utilidades de Tiempo**: Se crearán funciones de formateo para convertir `93` min en `1h 33min` y `5.5` h en `5h 30min`, siguiendo las reglas del spec.

## Risks / Trade-offs

- **Riesgo**: Proyectos con celdas vacías en el Excel para MTTR/MTBF.
- **Mitigación**: El parser usará `parseFloat(val) || 0` y la UI mostrará `--` si el valor es 0 o no está disponible, informando al usuario que debe cargar datos.
