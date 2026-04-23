# 📊 Guía de Cálculos y Fórmulas del Sistema

Este documento detalla la lógica interna aplicada para procesar los datos del Excel y transformarlos en las métricas visuales del Dashboard.

---

## 1. Disponibilidad (Hoja: 'Componentes de Disponibilidad')

La disponibilidad es el corazón del sistema y se calcula exclusivamente a partir de la segunda hoja del Excel.

### A. Disponibilidad Global del Proyecto
Es el promedio aritmético simple de todos los componentes asociados al proyecto.
*   **Fórmula:** `Promedio(Disponibilidad de todos los componentes del Proyecto)`
*   **Para probar cambios:** Cambia el valor en la columna **"Disponibilidad (%)"** de cualquier fila. Si bajas un valor de 100% a 50%, verás cómo la card principal de "Disponibilidad Global" disminuye proporcionalmente.

### B. Disponibilidad por Servicio de Negocio
Es el promedio de los componentes que pertenecen a un servicio específico.
*   **Fórmula:** `Promedio(Disponibilidad de componentes donde 'Servicio' == X)`
*   **Para probar cambios:** Si el servicio "App Móvil" tiene 3 componentes (Base de Datos, SO, API), la disponibilidad del servicio será la media de esos tres. Modifica uno de ellos para ver el cambio en la tabla de "Servicios de Negocio".

### C. Disponibilidad por Tipo de Componente (Detalle)
Dentro del modal de un servicio, puedes filtrar por tipo (Base de Datos, SO Linux, etc.).
*   **Fórmula:** `Promedio(Disponibilidad de componentes del Servicio X y Tipo Y)`

---

## 2. Tiempos y Rendimiento (Hoja: 'Resumen e Incidentes')

Estos cálculos se basan en la primera hoja del Excel.

### A. MTTR (Mean Time To Repair)
Representa el tiempo promedio que se tarda en solucionar un incidente.
*   **Fórmula:** `Suma(MTTR del Incidente (minutos)) / Total de Incidentes`
*   **Interpretación:** Si tienes dos incidentes de 60min y 120min, el MTTR será de 90min (1h 30min).
*   **Impacto Visual:**
    *   `< 60 min:` Impacto Bajo (Verde).
    *   `60 - 180 min:` Impacto Alto (Naranja).
    *   `> 180 min:` Impacto Crítico (Rojo).

### B. MTBF (Mean Time Between Failures)
Representa la confiabilidad del sistema: cuánto tiempo pasa, en promedio, entre una falla y otra.
*   **Fórmula:** `Tiempo Total de Operación (h) / Número de Fallas`
*   **Para probar cambios:** Aumenta el **"Tiempo Total de Operación"** en el Excel para ver cómo sube el MTBF (un número más alto es mejor, indica mayor estabilidad).

---

## 3. Capacidad y Alertas (Cruce de Hoja 1 y Hoja 2)

La capacidad es una métrica predictiva basada en el volumen de fallas detectadas por servicio.

*   **Lógica de Cálculo:** El sistema cuenta cuántos incidentes tiene un servicio en la Hoja 1.
*   **Escalas:**
    *   **0 a 2 incidentes:** Estado "OK" (0 alertas).
    *   **3 a 4 incidentes:** Estado "Warning" (Simula 2 alertas de recursos: Memoria y CPU).
    *   **5+ incidentes:** Estado "Crítico" (Simula 3 alertas críticas de recursos).
*   **Para probar cambios:** Agrega filas de incidentes para un mismo servicio en la Hoja 1 hasta superar los 3 o 5 registros.

---

## 4. Desempeño (SLA)

Se visualiza en la gráfica de barras de la derecha.
*   **Fórmula del Mes Actual:** `(SLAs Cumplidos / Total SLAs) * 100`
*   **Para probar cambios:** Modifica las columnas **"SLAs Cumplidos"** o **"Total SLAs"** en la primera hoja.

---

## 💡 Resumen: ¿Qué cambiar en el Excel para ver cambios?

| Objetivo | Hoja | Columna a modificar |
| :--- | :--- | :--- |
| **Bajar la Disponibilidad Global** | Componentes | `Disponibilidad (%)` (Pon valores bajos como 80 o 70) |
| **Cambiar el color de un Servicio** | Componentes | `Meta Disponibilidad (%)` (Sube la meta a 99.9 para que el servicio entre en "incumplimiento") |
| **Aumentar el número de Incidentes** | Resumen | Agrega más filas asegurándote de repetir el `Nombre del Proyecto` y `Servicio del Incidente` |
| **Mejorar el MTBF** | Resumen | Aumenta el valor en `Tiempo Total de Operación (h)` |
| **Activar Alertas de Capacidad** | Resumen | Repite un servicio en la lista de incidentes más de 5 veces |

---
*Nota: Siempre que modifiques el Excel, recuerda usar la opción **"Cambiar Archivo"** o **"Re-sincronizar"** en el Dashboard para que el sistema procese los nuevos datos.*
