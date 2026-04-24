import random
import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import List, Optional, Dict, Any
from app.models import TrendPoint, TrendResponse, ByTypeSummary

def clean_numeric(series):
    """Limpia valores numéricos que vienen como strings con comas."""
    if series.dtype == object:
        return pd.to_numeric(series.str.replace(',', '.'), errors='coerce')
    return pd.to_numeric(series, errors='coerce')

def build_trend(
    df_availability: pd.DataFrame,
    project_id: str,
    period: str = "6m",
    component_type: Optional[str] = None,
    service_name: Optional[str] = None
) -> TrendResponse:
    # 1. Limpieza básica (consistente con availability_parser.py)
    df = df_availability.copy()
    df["Disponibilidad (%)"] = clean_numeric(df["Disponibilidad (%)"]).fillna(0)
    df["Meta Disponibilidad (%)"] = clean_numeric(df["Meta Disponibilidad (%)"]).fillna(99.5)
    df["Nombre del Proyecto"] = df["Nombre del Proyecto"].astype(str).str.strip()
    df["Tipo de Componente"] = df["Tipo de Componente"].astype(str).str.strip()
    df["Servicio"] = df["Servicio"].astype(str).str.strip()

    # 2. Filtrar por proyecto
    df_filtered = df[df["Nombre del Proyecto"].str.lower() == project_id.lower()]
    
    # Filtrar por servicio si se solicita
    if service_name:
        df_filtered = df_filtered[df_filtered["Servicio"].str.lower() == service_name.lower()]

    if df_filtered.empty:
        return None

    # 3. Calcular resumen por tipo (antes de filtrar por tipo)
    by_type_summary = []
    types = df_filtered["Tipo de Componente"].unique()
    for t in types:
        avg_t = df_filtered[df_filtered["Tipo de Componente"] == t]["Disponibilidad (%)"].mean()
        by_type_summary.append(ByTypeSummary(type=t, avg=round(float(avg_t), 2)))

    # 4. Filtrar por tipo si se solicita
    if component_type and component_type.lower() != "todos":
        df_filtered = df_filtered[df_filtered["Tipo de Componente"].str.lower() == component_type.lower()]

    # 5. Calcular valor actual y meta
    current_val = float(df_filtered["Disponibilidad (%)"].mean())
    meta_val = float(df_filtered["Meta Disponibilidad (%)"].iloc[0]) if not df_filtered.empty else 99.5

    # 6. Generar puntos de tendencia (Simulado para MVP)
    data_points = []
    now = datetime.now()
    
    # Semilla determinista por proyecto/tipo para que la simulación sea "estable"
    seed_str = f"{project_id}-{component_type or 'all'}"
    random.seed(sum(ord(c) for c in seed_str))

    if period == "day":
        # 4 slots de 6 horas
        slots = ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 24:00"]
        for i, slot in enumerate(slots):
            # Variación para el día
            variation = random.uniform(-0.3, 0.1)
            val = round(max(90.0, min(100.0, current_val + variation)), 2)
            data_points.append(TrendPoint(
                label=slot,
                value=val,
                meets_target=val >= meta_val,
                is_simulated=True
            ))
    else:
        # Meses (3 o 6)
        num_months = 6 if period == "6m" else 3
        for i in range(num_months - 1, -1, -1):
            month_date = now - relativedelta(months=i)
            label = month_date.strftime("%b %Y")
            
            if i == 0:
                # El último mes es el real
                val = round(current_val, 2)
                is_sim = False
            else:
                variation = random.uniform(-1.5, 0.5)
                val = round(max(95.0, min(100.0, current_val + variation)), 2)
                is_sim = True
                
            data_points.append(TrendPoint(
                label=label,
                value=val,
                meets_target=val >= meta_val,
                is_simulated=is_sim
            ))

    return TrendResponse(
        project_id=project_id,
        period=period,
        component_type=component_type,
        meta=round(meta_val, 2),
        current_value=round(current_val, 2),
        data_points=data_points,
        by_type_summary=by_type_summary
    )
