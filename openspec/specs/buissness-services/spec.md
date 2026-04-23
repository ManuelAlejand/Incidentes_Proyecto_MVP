# Spec: Servicios de Negocio

## Estado: ACTIVO
## Versión: 1.0.0
## Depende de: specs/excel-ingestion/spec.md

---

## Objetivo
Especificación técnica para la sección **Servicios de Negocio**. Cubre el procesamiento de datos desde el Excel, la lógica de clasificación de alertas, la visualización en la tabla principal y el modal detallado de cada servicio.

---

## 1. Modelo de Datos y Extracción (Excel → Estado)

### Requirement: Extracción de datos por servicio
El sistema SHALL agrupar los datos por `Nombre del Proyecto` y `Servicio del Incidente` para generar las métricas de cada fila de la tabla.

#### Scenario: Agrupación de servicios
- **WHEN** el usuario carga un Excel con múltiples servicios para un mismo proyecto (ej: "Claro Red Core")
- **THEN** el sistema genera una fila única en la tabla por cada valor distinto en `Servicio del Incidente`.

### Requirement: Columnas obligatorias del Excel
El sistema SHALL mapear las siguientes columnas para el cálculo de servicios:
- `Nombre del Proyecto`: Clave de agrupación.
- `Servicio del Incidente`: Nombre del componente afectado.
- `Incidentes Críticos Totales`: Conteo global del proyecto.
- `MTTR del Incidente (minutos)`: Tiempo de resolución específico.
- `Tiempo Total de Operación (horas)`: Base para disponibilidad.
- `Fuente del Incidente`: Utilizada para el análisis de causa raíz.

---

## 2. Lógica de Clasificación de Alertas

### Requirement: Clasificación por impacto
El sistema SHALL clasificar cada servicio en un nivel de impacto basado en las siguientes reglas compuestas:

| Nivel | Ícono | Regla |
|-------|-------|-------|
| **Crítico** | 🔴 | `Incidentes Críticos Totales >= 5` OR `MTTR del Incidente >= 480 min` |
| **Alto** | 🟡 | `Incidentes Críticos Totales 2–4` OR `MTTR del Incidente 120–479 min` |
| **Bajo** | 🟢 | `Incidentes Críticos Totales <= 1` AND `MTTR del Incidente < 120 min` |

#### Scenario: Clasificación de impacto crítico
- **WHEN** un proyecto tiene 6 incidentes totales
- **THEN** el servicio se marca como **Crítico** independientemente de su MTTR individual.

### Requirement: Orden de visualización
El sistema SHALL ordenar los servicios de la tabla prioritariamente por Impacto (Crítico > Alto > Bajo) y secundariamente por MTTR descendente.

---

## 3. Tabla de Servicios de Negocio (UI)

### Requirement: Columnas de la tabla principal
La tabla SHALL mostrar las siguientes columnas:
1. **SERVICIO**: Nombre del servicio (o del proyecto si es nulo).
2. **DISPONIBILIDAD**: Porcentaje calculado (Ver sección 5). Verde si ≥ 99%, Rojo si < 99%.
3. **INCIDENTES**: Ícono de triángulo con el conteo de incidentes del servicio en el mes.
4. **DESPLIEGUES**: Barra de progreso con ratio exitosos/total (Lógica hardcoded en sección 4).
5. **CAPACIDAD**: Ícono de check con número de alertas (0=Verde, 1-2=Amarillo, 3+=Rojo).

#### Scenario: Interacción con la tabla
- **WHEN** el usuario hace click en una fila de la tabla
- **THEN** el sistema abre el **Modal de Detalle del Servicio** para ese componente específico.

---

## 4. Modal de Detalle y Lógica Hardcoded

### Requirement: Secciones del Modal de Detalle
El modal SHALL incluir:
- **Sección A (Cards):** Disponibilidad, Total Incidentes, Tasa de Éxito Despliegues, Alertas de Capacidad.
- **Sección B (Gráfica):** Tendencia de disponibilidad de los últimos 6 meses (Recharts).
- **Sección C (Capacidad):** Mensaje dinámico según volumen de incidentes.
- **Sección D (Despliegues):** Tabla de historial del mes actual.
- **Sección E (Análisis):** Identificación de la causa raíz más frecuente (`mode` de Fuente del Incidente).

### Requirement: Lógica Hardcoded de Despliegues y Capacidad
El sistema SHALL aplicar datos realistas basados en el nivel de salud del servicio:

| Nivel | Despliegues (E/T) | Alertas de Capacidad | Mensaje de Capacidad |
|-------|------------------|----------------------|----------------------|
| **Muchos Incidentes (≥5)** | 10 / 12 (83.3%) | 3 Activas | "Acción inmediata requerida. Escalar recursos..." |
| **Medios (2-4)** | 9 / 10 (90%) | 1 Activa | "Monitorear de cerca. Considerar optimización..." |
| **Pocos (≤1)** | 8 / 8 (100%) | 0 Activas | "No hay alertas de capacidad. Recursos operando normal." |

---

## 5. Cálculo de Disponibilidad por Servicio

### Requirement: Fórmula de Disponibilidad
El sistema SHALL calcular la disponibilidad mensual usando la siguiente fórmula:
`Disponibilidad = ((TiempoTotalOp_min - MTTR_acumulado_min) / TiempoTotalOp_min) * 100`

Donde:
- `TiempoTotalOp_min` = `Tiempo Total de Operación (horas)` × 60.
- `MTTR_acumulado_min` = Suma de todos los `MTTR del Incidente (minutos)` de ese servicio.

#### Scenario: Cálculo de disponibilidad real
- **WHEN** Servicio "App Móvil" tiene MTTRs de 210 y 340 min, y un tiempo de operación de 720h
- **THEN** la disponibilidad mostrada es **98.73%**.

---

## 6. Escalabilidad y Abstracción (Interfaces)

### Requirement: Abstracción del DataProvider
La UI SHALL consumir los datos a través de una interfaz `DataProvider` para permitir el cambio futuro de Excel a API o Base de Datos sin modificar los componentes.

```typescript
interface ProjectSummary {
  nombre: string;
  equipo: string;
  mesReporte: string;
  incidentesCriticos: number;
  tiempoTotalOp: number;
  incidentes: ProjectIncident[]; // Detalle por servicio
}
```

---

## 7. Criterios de Aceptación
- [ ] La tabla se actualiza automáticamente al cambiar el selector global de proyecto.
- [ ] Los servicios se ordenan correctamente por nivel de impacto.
- [ ] El modal de detalle muestra la causa raíz más repetida en la sección de análisis.
- [ ] La gráfica de tendencia muestra variaciones realistas según la cantidad de incidentes.
- [ ] Los colores de disponibilidad (rojo/verde) cambian correctamente según el umbral del 99%.
- [ ] Se debe seguir con el mismo diseño del frontend existente.