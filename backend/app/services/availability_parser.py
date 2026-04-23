import pandas as pd
import random
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from typing import List, Dict, Any

def generate_trend(current_availability: float, service_meta: float, report_month: datetime, months: int = 6) -> list:
    """
    MVP: Genera tendencia histórica con variación aleatoria controlada.
    """
    trend = []
    for i in range(months - 1, 0, -1):
        month_date = report_month - relativedelta(months=i)
        variation = random.uniform(-0.5, 0.5)
        historical_value = round(
            max(95.0, min(100.0, current_availability + variation)), 2
        )
        trend.append({
            "month": month_date.strftime("%b %Y"),
            "availability": historical_value,
            "meets_target": historical_value >= service_meta
        })
    
    # El último punto es el mes real
    trend.append({
        "month": report_month.strftime("%b %Y"),
        "availability": current_availability,
        "meets_target": current_availability >= service_meta
    })
    return trend

def clean_numeric(series):
    """Limpia valores numéricos que vienen como strings con comas."""
    if series.dtype == object:
        return pd.to_numeric(series.str.replace(',', '.'), errors='coerce')
    return pd.to_numeric(series, errors='coerce')

def parse_availability(df_components: pd.DataFrame, df_incidents: pd.DataFrame, project_name: str, report_month_str: str) -> Dict[str, Any]:
    """
    Parsea los componentes de disponibilidad y genera la respuesta para el frontend.
    """
    if df_components is None or df_components.empty:
        return {}

    # Limpiar columnas numéricas (manejo de comas decimales)
    df_components["Disponibilidad (%)"] = clean_numeric(df_components["Disponibilidad (%)"])
    df_components["Meta Disponibilidad (%)"] = clean_numeric(df_components["Meta Disponibilidad (%)"])
    
    # Rellenar NaNs con 0 para evitar errores en cálculos
    df_components["Disponibilidad (%)"] = df_components["Disponibilidad (%)"].fillna(0)
    df_components["Meta Disponibilidad (%)"] = df_components["Meta Disponibilidad (%)"].fillna(99.5)

    # Convertir mes de reporte a datetime
    try:
        report_month = datetime.strptime(report_month_str, "%Y-%m")
    except:
        report_month = datetime.now()

    # Filtrar componentes por proyecto (con limpieza de espacios)
    df_components["Nombre del Proyecto"] = df_components["Nombre del Proyecto"].astype(str).str.strip()
    project_components = df_components[df_components["Nombre del Proyecto"].str.lower() == project_name.strip().lower()]
    
    if project_components.empty:
        return {}

    # 1. Disponibilidad Global: promedio aritmético simple de TODOS los componentes del proyecto
    # (No "promedio de promedios" para evitar sesgo por diferente cantidad de componentes por tipo)
    global_availability = round(float(project_components["Disponibilidad (%)"].mean()), 2)
    
    # Desglose por tipo (solo para info en el modal, no afecta el global)
    by_type_global = project_components.groupby("Tipo de Componente")["Disponibilidad (%)"].mean()
    
    # Meta del proyecto (asumimos la misma en todos los componentes para el MVP)
    project_meta = round(float(project_components["Meta Disponibilidad (%)"].iloc[0]), 2)
    meets_target_global = bool(global_availability >= project_meta)
    delta_global = round(float(global_availability - project_meta), 2)

    global_data = {
        "percentage": global_availability,
        "meta": project_meta,
        "meets_target": meets_target_global,
        "delta": delta_global,
        "by_type": [
            {"type": str(t), "avg": round(float(v), 2)} for t, v in by_type_global.items()
        ]
    }

    # 2. Servicios de Negocio
    services_list = []
    services_groups = project_components.groupby("Servicio")
    
    # Obtener incidentes para cruzar con capacidad
    # (Asumimos que df_incidents tiene columna 'Servicio del Incidente')
    
    for service_name, service_df in services_groups:
        service_availability = round(float(service_df["Disponibilidad (%)"].mean()), 2)
        service_meta = round(float(service_df["Meta Disponibilidad (%)"].iloc[0]), 2)
        
        # Desglose por tipo (para el modal)
        by_type_detail = {}
        type_groups = service_df.groupby("Tipo de Componente")
        for tipo, tipo_df in type_groups:
            avg_tipo = round(float(tipo_df["Disponibilidad (%)"].mean()), 2)
            by_type_detail[str(tipo)] = {
                "avg_availability": avg_tipo,
                "meets_target": bool(avg_tipo >= service_meta),
                "components": [
                    {"name": str(row["Nombre del Componente"]), "availability": round(float(row["Disponibilidad (%)"]), 2)}
                    for _, row in tipo_df.iterrows()
                ]
            }

        # Cruzar con incidentes para capacidad
        incident_count = 0
        if df_incidents is not None and not df_incidents.empty:
             # Ajustar nombre de columna según incident_parser.py
             col_name = "Servicio del Incidente" if "Servicio del Incidente" in df_incidents.columns else "Servicio"
             incident_count = int(len(df_incidents[df_incidents[col_name] == service_name]))

        # Estado de capacidad
        if incident_count >= 5:
            capacity_status = "alert"
            capacity_count = incident_count
            cap_items = ["Memoria 92%", "CPU 88%", "Conexiones DB 95%"]
            cap_rec = "Acción inmediata requerida. Escalar recursos o implementar optimizaciones urgentes."
        elif incident_count >= 3:
            capacity_status = "warning"
            capacity_count = incident_count
            cap_items = ["Memoria 78%", "CPU 72%"]
            cap_rec = "Monitorear de cerca. Considerar optimización preventiva."
        else:
            capacity_status = "ok"
            capacity_count = 0
            cap_items = []
            cap_rec = "Todos los recursos operando dentro de parámetros normales."

        # Tendencia (MVP: Simular si no hay datos reales suficientes)
        # Aquí simplificamos: siempre generamos para el MVP
        trend = generate_trend(service_availability, service_meta, report_month)

        # Análisis de incidentes
        if incident_count == 0:
            analysis_msg = "No se registraron incidentes en el mes actual. Operación dentro de parámetros normales."
            analysis_alert = False
        elif incident_count <= 2:
            analysis_msg = f"Se han registrado {incident_count} incidente(s) en el mes actual, dentro de los parámetros normales de operación."
            analysis_alert = False
        else:
            # Encontrar causa principal (Fuente) si existe
            main_cause = "Desconocida"
            if df_incidents is not None and not df_incidents.empty:
                col_source = "Fuente del Incidente" if "Fuente del Incidente" in df_incidents.columns else "Fuente"
                if col_source in df_incidents.columns:
                    service_incidents = df_incidents[df_incidents[col_name] == service_name]
                    if not service_incidents.empty:
                        main_cause = str(service_incidents[col_source].mode()[0])

            analysis_msg = f"Alerta: Se han registrado {incident_count} incidentes en el mes actual, superando el umbral aceptable. Causa principal identificada: {main_cause}."
            analysis_alert = True

        services_list.append({
            "name": str(service_name),
            "availability": service_availability,
            "meta": service_meta,
            "meets_target": bool(service_availability >= service_meta),
            "incident_count": incident_count,
            "capacity_status": capacity_status,
            "capacity_count": capacity_count,
            "deployments": {
                "period": "Mes Actual",
                "total": 12, "successful": 10, "failed": 2, "success_rate": 83.3 # Mocked for MVP as per spec
            },
            "capacity_alerts": {
                "status": capacity_status,
                "count": len(cap_items),
                "items": cap_items,
                "recommendation": cap_rec
            },
            "by_type": by_type_detail,
            "trend": trend,
            "incident_analysis": {
                "total": incident_count,
                "main_cause": main_cause if incident_count > 2 else None,
                "message": analysis_msg,
                "is_alert": analysis_alert
            }
        })

    return {
        "project_id": str(project_name),
        "global_availability": global_data,
        "services": services_list
    }
