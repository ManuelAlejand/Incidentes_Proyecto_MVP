# Dashboard de Gestión de Incidentes y Operaciones (MVP)

Este proyecto es un dashboard interactivo de alto nivel diseñado para la visualización de métricas críticas de servicios IT, niveles de servicio (SLA), resiliencia operativa y eficiencia basada en automatización. La aplicación permite a los gestores de servicios cargar reportes consolidados en Excel y obtener un análisis dinámico e inmediato del estado de sus proyectos.

---

## 🚀 Tecnologías Utilizadas

- **Frontend**: React.js con TypeScript.
- **Build Tool**: Vite (para una experiencia de desarrollo ultrarrápida).
- **Visualización de Datos**: Recharts (Gráficos dinámicos y responsivos).
- **Procesamiento de Archivos**: SheetJS (XLSX) para el parsing de Excel en el cliente.
- **Iconografía**: Lucide-React y Material Icons.
- **Estilos**: Vanilla CSS con un sistema de variables para diseño premium y modo oscuro/claro optimizado.

---

## 📁 Estructura del Proyecto

```text
proyecto_alertas/
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables (UploadZone, etc.)
│   │   ├── services/         # Lógica de negocio y parsing (incidentParser.ts)
│   │   ├── store/            # Gestión de estado global con Zustand
│   │   ├── types/            # Definiciones de interfaces TypeScript
│   │   ├── utils/            # Funciones de ayuda (formateo de tiempo)
│   │   ├── App.tsx           # Componente principal y lógica de modales
│   │   └── index.css         # Sistema de diseño y estilos globales
│   └── public/               # Activos estáticos (Logos, imágenes)
└── original-desing/          # Prototipo inicial (Referencia de diseño)
```

---

## ⚙️ Instalación e Inicialización

Este proyecto requiere ejecutar tanto el **Backend** como el **Frontend** para funcionar correctamente.

### 1. Inicializar el Backend (FastAPI)
1. Navega a la carpeta: `cd backend`
2. Crea un entorno virtual: `python -m venv venv`
3. Activa el entorno:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Instala dependencias: `pip install -r requirements.txt`
5. Inicia el servidor: `uvicorn app.main:app --reload`
*El backend correrá en http://localhost:8000*

### 2. Inicializar el Frontend (React)
1. Abre una nueva terminal.
2. Navega a la carpeta: `cd frontend`
3. Instala dependencias: `npm install`
4. Inicia el servidor: `npm run dev`
*El frontend correrá en http://localhost:5173*

---

## 📊 Lógica de Cálculos y Métricas

La aplicación automatiza el análisis de datos basándose en las siguientes fórmulas y lógicas:

### 1. Disponibilidad (Uptime)
Se calcula comparando el tiempo total de operación contra el tiempo de indisponibilidad generado por incidentes:
> **Fórmula**: `((Minutos Operativos Totales - Suma de MTTR de Incidentes) / Minutos Operativos Totales) * 100`
*Nota: Los minutos operativos se extraen de la columna "Tiempo Total de Operación (h)".*

### 2. Tiempos de Respuesta (MTTR y MTBF)
- **MTTR (Mean Time To Repair)**: Es el promedio aritmético del tiempo de recuperación de todos los incidentes del proyecto.
- **MTBF (Mean Time Between Failures)**:
> **Fórmula**: `Horas Totales de Operación / Número Total de Fallas`

### 3. Resiliencia y Recurrencia
Determina qué servicios son "Top Offenders" (más inestables):
- **Identificación**: Se prioriza la columna "Incidentes Recurrentes" del Excel. Si no hay datos, el sistema selecciona los 3 incidentes más recientes.
- **Recurrencia %**: `(Cantidad de Incidentes Recurrentes / Total de Incidentes del Proyecto) * 100`.
- **Acciones Correctivas**: Se asignan automáticamente según la fuente:
  - *Base de Datos* ➔ OPTIMIZACIÓN QUERIES
  - *API Gateway* ➔ REFACTORIZAR CÓDIGO DE API
  - *Infraestructura* ➔ ESCALAMIENTO DE RECURSOS
  - *Error Operativo* ➔ CAPACITACIÓN / AUTOMATIZACIÓN

### 4. Capacidad y Alertas
El estado de capacidad de cada servicio se clasifica según el volumen y criticidad de sus incidentes:
- **Crítico (Rojo)**: Más de 5 incidentes o presencia de un incidente de impacto "Crítico".
- **Advertencia (Amarillo)**: Entre 2 y 4 incidentes o presencia de impacto "Alto".
- **Normal (Verde)**: 0-1 incidentes.

---

## 📥 Formato de Datos (Excel V3)

Para que el dashboard funcione correctamente, el archivo Excel debe seguir la plantilla **V3**, que incluye las siguientes columnas clave:
- `Nombre del Proyecto`: Para agrupar y filtrar los datos.
- `Servicio del Incidente`: El componente técnico afectado.
- `Descripción del Incidente`: Detalle de la falla para el análisis RCA.
- `Fuente del Incidente`: Origen del problema (DB, API, Red, etc.).
- `MTTR del Incidente (minutos)`: Tiempo que tomó resolver el incidente.
- `Impacto`: (Opcional) Nivel de criticidad (Crítico, Alto, Bajo).
- `Incidentes Recurrentes`: (Opcional) Cantidad de veces que ha fallado ese servicio específico.

---

## 🎨 Diseño y UX
- **Hover Dinámico**: La tabla de servicios tiene efectos de transición y cambio de cursor para indicar interactividad.
- **Modales Detallados**: Cada sección (SLA, Resiliencia, Eficiencia) cuenta con un modal de análisis profundo.
- **Gestión de Errores**: La zona de carga valida la estructura del archivo y el tamaño (Límite 10MB) antes de procesar.

---
© 2026 Dashboard Operativo. Desarrollado para optimizar la toma de decisiones en servicios críticos.
