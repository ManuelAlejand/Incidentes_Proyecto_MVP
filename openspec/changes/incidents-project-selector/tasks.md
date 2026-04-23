## 1. Store Update (Zustand)

- [x] 1.1 Modificar `frontend/src/store/dataStore.ts` para agregar `projectNames: string[]` y `activeProjectName: string | null` al estado.
- [x] 1.2 Agregar la acción `setActiveProjectName: (name: string | null) => void` al store.
- [x] 1.3 Asegurarse de que `resetData` limpie también estos nuevos campos.

## 2. Service Update (incidentParser.ts)

- [x] 2.1 Actualizar la constante `SUMMARY_COLUMNS` en `frontend/src/services/incidentParser.ts` con las 6 columnas de resumen.
- [x] 2.2 Modificar la lógica de cálculo de `totalFromSummary` para que sea la suma de los valores de las 6 columnas especificadas.
- [x] 2.3 Validar que el fallback de `finalTotal` use esta suma correctamente cuando no hay incidentes de detalle.

## 3. Upload Component Update (UploadZone.tsx)

- [x] 3.1 Modificar `validateAndProcessFile` en `frontend/src/components/UploadZone.tsx` para extraer nombres únicos de proyectos del `jsonData`.
- [x] 3.2 Actualizar la llamada a `setUploadData` para incluir la lista de proyectos y establecer el primero como activo.

## 4. UI Update (App.tsx)

- [x] 4.1 Modificar la lógica de obtención de `dynamicIncidents` en `App.tsx` para usar `activeProjectName` del store.
- [x] 4.2 Agregar un dropdown `<select>` dentro del modal de incidentes que permita cambiar el `activeProjectName`.
- [x] 4.3 Asegurarse de que el dropdown solo se muestre cuando haya más de un proyecto disponible.
- [x] 4.4 Verificar que la card del dashboard se actualice reactivamente al cambiar el proyecto en el modal.
