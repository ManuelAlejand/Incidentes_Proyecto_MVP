"""
excel_parser.py — V3 (fila por incidente)
Agrupa filas por "Nombre del Proyecto" usando pandas groupby.
"""
import re
import pandas as pd
from typing import List

# Columnas obligatorias V3
REQUIRED_COLUMNS_V3 = [
    "Nombre del Proyecto",
    "Equipo Responsable",
    "Mes de Reporte",
    "Total SLAs",
    "SLAs Cumplidos",
    "SLAs Comprometidos",
    "Incidentes Críticos Totales",
    "MTTR Promedio (minutos)",
    "MTBF (horas)",
    "Tiempo Total de Operación (horas)",
    "Número de Fallas",
    "Tiempo de Solución por Ticket (min)",
    "Incidentes Recurrentes",
    "Incidentes por Error Operativo",
    "Incidentes por Base de Datos",
    "Incidentes por API Gateway",
    "Servicio del Incidente",
    "Descripción del Incidente",
    "Fuente del Incidente",
    "MTTR del Incidente (minutos)",
    "Fecha del Incidente",
]

OLD_SCHEMA_PATTERN = re.compile(r"Inc\d+_", re.IGNORECASE)


def validate_columns(df: pd.DataFrame) -> None:
    """
    Valida que el DataFrame contenga exactamente las columnas V3.
    Lanza ValueError con mensaje descriptivo si falla.
    """
    # Detectar esquema antiguo
    old_cols = [c for c in df.columns if OLD_SCHEMA_PATTERN.search(c)]
    if old_cols:
        raise ValueError("Esquema desactualizado: usa la plantilla v3")

    # Validar columnas requeridas
    missing = [c for c in REQUIRED_COLUMNS_V3 if c not in df.columns]
    if missing:
        raise ValueError(f"Faltan columnas requeridas: {', '.join(missing)}")


def group_project_data(df: pd.DataFrame, project_name: str) -> dict:
    """
    Agrupa las filas de un proyecto específico.
    Retorna un dict con:
      - summary: Series con la primera fila (datos de resumen)
      - incidents: DataFrame con las filas de detalle de incidentes
    """
    project_rows = df[df["Nombre del Proyecto"] == project_name].copy()

    # Datos de resumen: primera fila (son idénticos en todas las filas)
    summary = project_rows.iloc[0]

    # Filas de detalle: solo donde "Servicio del Incidente" no esté vacío
    incidents = project_rows[
        project_rows["Servicio del Incidente"].notna() &
        (project_rows["Servicio del Incidente"].str.strip() != "")
    ]

    return {"summary": summary, "incidents": incidents}


def get_all_projects(df: pd.DataFrame) -> List[str]:
    """Retorna la lista de proyectos únicos en el DataFrame."""
    return df["Nombre del Proyecto"].dropna().unique().tolist()
