from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.repositories.data_repository import get_dataframes
from app.services.trend_builder import build_trend
from app.models import TrendResponse
import os

router = APIRouter()

# Usar ruta absoluta para el archivo temporal
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMP_FILE = os.path.join(BASE_DIR, "temp_excel.xlsx")

@router.get("/projects/{project_id}/availability/trend", response_model=TrendResponse)
async def get_availability_trend(
    project_id: str,
    period: str = Query("6m", regex="^(6m|3m|day)$"),
    component_type: Optional[str] = None,
    service_name: Optional[str] = None
):
    """
    Retorna la tendencia de disponibilidad filtrada por periodo, tipo de componente y servicio.
    """
    if not os.path.exists(TEMP_FILE):
        raise HTTPException(status_code=404, detail="No se ha cargado ningún archivo Excel.")

    try:
        with open(TEMP_FILE, "rb") as f:
            contents = f.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error leyendo el archivo temporal: {str(e)}")

    try:
        df_main, df_availability = get_dataframes(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parseando el Excel: {str(e)}")

    if df_availability is None:
        raise HTTPException(
            status_code=400,
            detail="El archivo Excel no contiene la hoja 'Componentes de Disponibilidad'."
        )

    result = build_trend(df_availability, project_id, period, component_type, service_name)

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontraron datos para el proyecto '{project_id}'."
        )

    return result
