## Why

Actualmente tenemos el `UploadZone` que oculta el dashboard entero e inyecta información falsa. Queremos testear la lógica de negocio real de carga de Excel descrita en `excel-integration/spec.md` procesando *verdaderamente* el archivo del usuario en el navegador como prueba de concepto para el frontend. Además, el equipo decidió que este validador se mostrará en la parte superior, conservando debajo el dashboard original intacto con todas las tarjetas de información.

## What Changes

- Modificar `UploadZone` para que use una librería de lectura de Excel (por ejemplo, `xlsx`) y procese de verdad el archivo en el navegador en lugar de enviar una falsa simulación.
- Reubicar el componente de carga al tope de la página principal (`App.tsx`), asegurándose de no ocultar ni eliminar ninguna tarjeta o funcionalidad del dashboard de los pantallazos originales.
- Implementar las validaciones descritas en `excel-integration/spec.md` de manera temporal en el frontend (evaluando columnas como: Nombre del proyecto, Total SLAs, Incidentes Críticos Totales, etc.).
- Si las validaciones pasan y la importación de datos es exitosa, se generará una **tabla previa** debajo del UploadZone para mostrar en crudo los datos exportados listos para manipulación. 

## Capabilities

### New Capabilities
- `excel-frontend-logic`: Traslado temporal de la lógica de backend requerida para parsear y validar la integridad de las columnas exigidas en la importación de archivos `.xlsx`.

### Modified Capabilities
- `excel-upload-ui`: Altera su flujo para no ocultar la aplicación principal, permitiendo coexistir como una sección superior destinada a depuración y validación local de integración.

## Impact

- `frontend/package.json`: Nueva dependencia (`xlsx` o similar).
- `frontend/src/App.tsx`: Cambios en la diagramación para restaurar la vista principal e inyectar el nuevo componente encima de los demás.
- `frontend/src/components/UploadZone.tsx`: Lógica extendida de validación real en JavaScript.
