## 1. Modificar Layout y Zustand
- [x] 1.1 Modificar `App.tsx` para eliminar la condicional `!hasData` y apilar los componentes `UploadZone` justo antes de los `DashboardGrid`.
- [x] 1.2 Extender el interface `useDataStore` para retener las listas planas puras decodificadas de las filas de excel (independientes del mockup default del dashboard).

## 2. Lógica de Parseo
- [x] 2.1 Instalar la dependencia `xlsx` usando bash.
- [x] 2.2 Modificar `UploadZone.tsx` para interceptar la subida válida (`MAX_SIZE_MB`), parsear de Uint8Array el workbook con `xlsx` y volcar cada JSON dentro de la lógica del state store con Zustand.
- [x] 2.3 Implementar control y verificación local de llaves obligatorias requeridas en la cabecera.

## 3. Visualización 
- [x] 3.1 Construir un bloque intermedio `ParsedDataTable` en `App.tsx` que itere cada una de las llaves del row parseado desde Zustand y los dibuje en una tabla sencilla de filas y columnas, justo entre la zona de subida y el dashboard nativo hardcodeado.
