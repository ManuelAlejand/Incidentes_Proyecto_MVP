"""
models.py — Modelos Pydantic V3
Incluye los nuevos campos incidentes_por_base_de_datos e incidentes_por_api_gateway.
"""
from pydantic import BaseModel
from typing import Optional


class ProjectSummary(BaseModel):
    nombre_proyecto: str
    equipo_responsable: str
    mes_reporte: str
    total_slas: int
    slas_cumplidos: int
    slas_comprometidos: int
    incidentes_criticos_totales: int
    mttr_promedio_minutos: float
    mtbf_horas: float
    tiempo_total_operacion_horas: float
    numero_fallas: int
    tiempo_solucion_ticket_min: float
    incidentes_recurrentes: int
    incidentes_por_error_operativo: int
    # Campos nuevos V3
    incidentes_por_base_de_datos: int = 0
    incidentes_por_api_gateway: int = 0


class IncidentDetail(BaseModel):
    index: int
    service: str
    description: str
    mttr_minutes: float
    recovery_formatted: str
    source: str
    impact: str
    impact_color: str
    date: str


class IncidentBySource(BaseModel):
    name: str
    source: str
    count: int
    percentage: float
    value: int
    color: str


class IncidentAnalysis(BaseModel):
    message: str
    action_required: bool


class IncidentSummary(BaseModel):
    total: int
    avg_recovery_minutes: float
    avg_recovery_formatted: str
    services_affected: int


class IncidentResponse(BaseModel):
    project_id: str
    summary: IncidentSummary
    by_source: list[IncidentBySource]
    incidents: list[IncidentDetail]
    analysis: IncidentAnalysis
