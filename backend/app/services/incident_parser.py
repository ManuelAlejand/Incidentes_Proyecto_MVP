"""
incident_parser.py — V3 (una fila por incidente)
Lee filas de detalle del DataFrame agrupado por proyecto.
"""
import pandas as pd
from typing import List, Dict, Any


CHART_COLORS = [
    "#4F81BD", "#70AD47", "#00B0F0", "#FF6B35",
    "#9B59B6", "#E74C3C", "#F39C12", "#1ABC9C"
]


def format_minutes(minutes: float) -> str:
    """Formatea minutos a string legible."""
    if not minutes or minutes == 0:
        return "0min"
    if minutes < 60:
        return f"{int(minutes)}min"
    h = int(minutes // 60)
    m = int(minutes % 60)
    if m == 0:
        return f"{h}h"
    return f"{h}h {m}min"


def classify_impact(mttr: float) -> Dict[str, str]:
    """Clasifica el impacto según el MTTR."""
    if mttr > 180:
        return {"impact": "Crítico", "impact_color": "red"}
    elif mttr >= 60:
        return {"impact": "Alto", "impact_color": "orange"}
    return {"impact": "Bajo", "impact_color": "green"}


def parse_incidents(summary: pd.Series, incident_rows: pd.DataFrame) -> Dict[str, Any]:
    """
    Construye la respuesta de incidentes para un proyecto.

    Args:
        summary: Primera fila del proyecto (datos de resumen).
        incident_rows: DataFrame filtrado con filas de detalle de incidentes.

    Returns:
        dict compatible con IncidentResponse (contrato JSON del endpoint).
    """
    incidents = []

    for i, row in enumerate(incident_rows.itertuples(index=False), start=1):
        mttr = float(getattr(row, "MTTR_del_Incidente__minutos_", 0) or 0)
        # pandas renombra los espacios a _ en namedtuples, usamos getattr con nombre real
        mttr_raw = incident_rows.iloc[i - 1].get("MTTR del Incidente (minutos)", 0)
        mttr = float(mttr_raw) if mttr_raw else 0

        classification = classify_impact(mttr)

        incidents.append({
            "index": i,
            "service": str(incident_rows.iloc[i - 1].get("Servicio del Incidente", "")).strip(),
            "description": str(incident_rows.iloc[i - 1].get("Descripción del Incidente", "Sin descripción")).strip(),
            "mttr_minutes": mttr,
            "recovery_formatted": format_minutes(mttr),
            "source": str(incident_rows.iloc[i - 1].get("Fuente del Incidente", "Sin clasificar")).strip(),
            "impact": classification["impact"],
            "impact_color": classification["impact_color"],
            "date": str(incident_rows.iloc[i - 1].get("Fecha del Incidente", "")).strip(),
        })

    # Ordenar por fecha descendente
    incidents.sort(key=lambda x: x["date"], reverse=True)

    # MTTR promedio: desde filas de detalle si existen, fallback al resumen
    if incidents:
        avg_mttr = incident_rows["MTTR del Incidente (minutos)"].astype(float).mean()
    else:
        avg_mttr = float(summary.get("MTTR Promedio (minutos)", 0) or 0)

    # Servicios afectados
    services_affected = incident_rows["Servicio del Incidente"].nunique() if not incident_rows.empty else 0

    # Total de incidentes
    total_from_summary = float(summary.get("Incidentes Críticos Totales", 0) or 0)
    final_total = len(incidents) if incidents else int(total_from_summary)

    # Pie chart — agrupar por fuente dinámica
    by_source = []
    if incidents:
        by_source_df = (
            incident_rows.groupby("Fuente del Incidente")
            .size()
            .reset_index(name="count")
            .sort_values("count", ascending=False)
        )
        total_inc = len(incident_rows)
        for idx, src_row in enumerate(by_source_df.itertuples()):
            count = int(src_row.count)
            by_source.append({
                "name": src_row._1 if hasattr(src_row, '_1') else str(getattr(src_row, 'Fuente_del_Incidente', '')),
                "source": str(incident_rows.iloc[0].get("Fuente del Incidente", "")),
                "count": count,
                "percentage": round((count / total_inc) * 100, 1),
                "value": count,
                "color": CHART_COLORS[idx % len(CHART_COLORS)],
            })
    elif final_total > 0:
        # Fallback: columnas de resumen agregadas
        agg_fields = [
            ("Críticos", "Incidentes Críticos Totales"),
            ("Recurrentes", "Incidentes Recurrentes"),
            ("Error Operativo", "Incidentes por Error Operativo"),
            ("Base de Datos", "Incidentes por Base de Datos"),
            ("API Gateway", "Incidentes por API Gateway"),
        ]
        color_idx = 0
        for name, key in agg_fields:
            count = int(float(summary.get(key, 0) or 0))
            if count > 0:
                by_source.append({
                    "name": name, "source": name, "count": count,
                    "percentage": round((count / final_total) * 100, 1),
                    "value": count,
                    "color": CHART_COLORS[color_idx % len(CHART_COLORS)],
                })
                color_idx += 1

    # Análisis automático
    action_required = False
    if final_total == 0:
        message = "No se registraron incidentes críticos en el mes actual."
    else:
        message = f"Se han registrado {final_total} incidente(s) en el mes. "
        if by_source:
            message += f"Causa principal: {by_source[0]['name']}. "
        if avg_mttr > 180:
            message += "MTTR alto — se recomienda revisar tiempos de respuesta."
            action_required = True
        elif avg_mttr >= 60:
            message += "MTTR en rango medio — se recomienda monitoreo continuo."
        elif avg_mttr > 0:
            message += "MTTR bajo — buen desempeño operativo."
        if len(by_source) > 3:
            message += " Múltiples fuentes de falla — estandarizar procesos."
            action_required = True
        if final_total > 5:
            action_required = True

    return {
        "project_id": str(summary.get("Nombre del Proyecto", "unknown")),
        "summary": {
            "total": final_total,
            "avg_recovery_minutes": round(avg_mttr, 2),
            "avg_recovery_formatted": format_minutes(avg_mttr),
            "services_affected": services_affected,
        },
        "by_source": by_source,
        "incidents": incidents,
        "analysis": {
            "message": message.strip(),
            "action_required": action_required,
        },
    }
