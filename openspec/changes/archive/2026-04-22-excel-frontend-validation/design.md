## Context

El objetivo es permitir que la lógica de validación de Excel descrita en `excel-integration` (que originalmente reside en el backend) sea implementada al 100% en el frontend con el fin de probarla iterativamente y sin demoras. Al subir el Excel, el UI no ocultará el dashboard actual (los datos hardcodeados continúan visibles), sino que anclará la zona de subida en la sección superior y desplegará una tabla de datos procesados. 

## Goals / Non-Goals

**Goals:**
- Mostrar `UploadZone` en la parte superior sin alterar las cards existentes.
- Leer e instanciar bibliotecas en frontend (como `xlsx`) para extraer la data proveniente de los sheets de Excel.
- Realizar las validaciones exactas del backend temporalmente en el cliente (que incluya detección de columnas como Nombre del Proyecto, SLA, Tiempo, Incidentes).
- Desplegar una tabla inyectada entre el UploadZone y el Dashboard Principal con los datos procesados.

**Non-Goals:**
- Conectar todo el dashboard hardcodeado a estos datos (los mantendremos separados para la depuración actual bajo solicitud estricta de no tocar datos hardcodeados del dashboard).
- Crear el código final en Python/FastAPI. Este hito es 100% frontend.

## Decisions

- **Parser de Excel:** Utilizar `xlsx` (SheetJS) como la herramienta local preferida para transformar binarios `.xlsx` en Arrays de JSON dentro del navegador. 
- **Layout Management:** Eliminaremos el ternario de renderizado entre UploadZone y el Main Content, apilando `UploadZone` > `Tabla Validada` > `DashboardCards` linealmente conservando un layout único en `App.tsx`.
- **Estructura temporal:** El componente `UploadZone` retendrá localmente su propio parseo. La tabla se pintará directamente leyendo el estado de Zustand exportado, simulando que recibimos el JSON válido.

## Risks / Trade-offs

- **Risk:** Implementar lógica de validación en Cliente que después deba re-hacerse en Backend. → **Mitigación:** Es un paso de validación transitorio según los flujos de "Propose Workflow", el costo se asume para validar la estructura rápidamente.
