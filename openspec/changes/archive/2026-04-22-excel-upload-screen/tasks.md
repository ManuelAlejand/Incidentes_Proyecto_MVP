## 1. Setup State Management

- [x] 1.1 Configurar e instalar Zustand con el middleware `persist` persistiendo a `sessionStorage`.
- [x] 1.2 Crear el store `useDataStore` en `frontend/src/store/dataStore.ts` guardando el contrato JSON agrupado por meses.

## 2. UploadZone Componente UI

- [x] 2.1 Construir la estructura visual HTML/CSS del componente `UploadZone.tsx` en estilo "Drag & Drop".
- [x] 2.2 Agregar lógica de control de fichero en `UploadZone`, restringiendo sólo achivos `.xlsx` y límite duro de 5MB. 
- [x] 2.3 Simular la integración de la llamada a la pseudo API (`/api/v1/upload`), actualizando Zustand si el resultado es éxito de la subida o alertando localmente sí falla a nivel tamaño.

## 3. Integración en el Dashboard y Transición

- [x] 3.1 Actualizar `App.tsx` para interceptar la vista con `UploadZone` si Zustand está vacío, y cambiar al dashboard principal tan pronto caigan los primeros datos importados.
- [x] 3.2 Modificar la generación de las tablas para alimentarse de la memoria que importó el componente.
