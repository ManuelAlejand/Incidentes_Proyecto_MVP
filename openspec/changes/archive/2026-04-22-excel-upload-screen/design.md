## Context

Según la especificación `excel-integration`, el sistema carga un archivo Excel y la API responde con un JSON normalizado. Actualmente el frontend en React muestra los datos del dashboard hardcodeados. Este flujo requiere incorporar la UI para subir archivos (`UploadZone`) y usar Zustand con `sessionStorage` para mantener este estado persistido.

## Goals / Non-Goals

**Goals:**
- Pantalla inicial con área de drag & drop para aceptar el archivo.
- Consumo simulado del endpoint de la API (`/api/v1/upload`), por ahora pudiendo mapear estáticamente un mockup o simplemente integrando la lógica local de simulación para abrir el dashboard.
- Manejo de UI: "vacío", "cargando", "error" y "tablero con datos" al completar.

**Non-Goals:**
- Implementar el backend (FastAPI/Pandas) físico, esto es solo UI.
- Parseo nativo de XLSX en JS. Confiaremos y delegaremos en el endpoint backend (aunque mokeado).

## Decisions

- **Manejo de Estado (Zustand):** Zustand es la mejor opción frente a Context API por razones de rendimiento y conveniencia. Para cumplir la limitación de perder la información en el F5, se usará middleware de `persist` para usar `sessionStorage`.
- **Componente UploadZone Independiente:** Se creará un componente separado para mantener `App.tsx` limpio y fácilmente mantenible.

## Risks / Trade-offs

- **Risk:** Límite real de 5MB puede ser sobrepasado si el usuario sube basura u otro formato pesado. → **Mitigación:** Subsanar este caso validando en frontend el file.type o y el tamaño (`file.size`) antes de incluso intentar lanzar la petición, dando advertencia inmediata al usuario.
