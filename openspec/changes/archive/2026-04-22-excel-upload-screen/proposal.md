## Why

Actualmente el dashboard muestra datos hardcodeados. El objetivo de este cambio es dar el primer paso hacia una aplicación dinámica al permitir al usuario cargar un archivo Excel para alimentar el sistema. Esto responde a la especificación activa de la plataforma donde la fuente de datos (MVP) es un archivo `.xlsx`.

## What Changes

- Añadir un área de "Arrastrar y Soltar" (UploadZone) justo debajo del navbar en el index (`App.tsx`).
- Al hacer clic o arrastrar un archivo, se enviará el archivo a la validación/lógica (en este punto inicial, se conecta con la lógica para parsear o al menos generar la visualización).
- Al importar válidamente el Excel, la pantalla transicionará o generará una tabla mostrando la información del Excel transformada, lista para su manipulación.
- Modificar el estado inicial de la aplicación: Estado vacío (mostrar UploadZone) y Estado exitoso (mostrar tabla con datos importados).

## Capabilities

### New Capabilities
- `excel-upload-ui`: Interfaz de usuario para cargar un archivo Excel (UploadZone, manejo de estados de carga, error y éxito) y previsualización de datos importados en una tabla.

### Modified Capabilities
- `excel-integration`: La especificación actual cubre el backend. Aquí estamos implementando su impacto en el frontend (envío del archivo, guardado en Zustand, manejo del 422 vs 200). Se asume como un refinamiento o cumplimiento de la especificación existente en UI.

## Impact

- `frontend/src/App.tsx`: Será modificado para incorporar el estado condicional de upload.
- `frontend/src/components/UploadZone.tsx`: Componente nuevo para carga.
- Estado Global (Zustand): Se requiere crear el store para persistir el JSON y las sesiones (usando sessionStorage).
