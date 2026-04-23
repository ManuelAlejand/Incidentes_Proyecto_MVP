# Walkthrough: Dynamic Response Times & Global Project Selector

Se ha implementado el selector global de proyectos y la visualización dinámica de MTTR/MTBF.

## Cambios Realizados

### 1. Store & Lógica de Datos
- **Parser**: `incidentParser.ts` ahora extrae `MTTR Promedio (minutos)` y `MTBF (horas)`.
- **Utilidades**: Nueva función en `formatTime.ts` para formatear duraciones siguiendo las reglas de negocio.

### 2. Interfaz de Usuario (UI)
- **Selector Global**: Ubicado en el header. Permite cambiar el proyecto activo para todo el dashboard.
- **Card de Tiempos de Respuesta**: Ahora muestra valores dinámicos formateados.
- **Sincronización**: Al cambiar el proyecto en el header, todas las métricas y el modal de incidentes se actualizan automáticamente.

## Verificación Realizada

### Casos de Prueba:
- [x] **MTTR 93 min** → Muestra `1h 33min`.
- [x] **MTBF 0.5 h** → Muestra `30min`.
- [x] **Cambio de Proyecto** → Las métricas de incidentes y tiempos cambian al unísono.
- [x] **Sin Datos** → Muestra `--` o valores por defecto.

## Pantallas / Capturas
*(El usuario puede verificar visualmente el selector en el header de color azul oscuro con borde sutil)*
