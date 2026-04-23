001-component-availability

# Change 001: Disponibilidad basada en componentes

## Tipo: BREAKING CHANGE en cálculo de disponibilidad

## Qué cambió
La disponibilidad ya NO se calcula con la fórmula:
((Minutos Totales - Minutos Caídos) / Minutos Totales) * 100

Ahora viene directamente de la Hoja 2 "Componentes de Disponibilidad".
El cálculo global es promedio de promedios por tipo de componente.

## Archivos eliminados/modificados
- La columna "Disponibilidad (%)" de Hoja 1 ya no se usa para el global
- Se agrega Hoja 2 "Componentes de Disponibilidad" al Excel
- availability_parser.py reemplaza cualquier cálculo anterior