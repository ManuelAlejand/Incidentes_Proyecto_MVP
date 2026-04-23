from fastapi import APIRouter, HTTPException
from app.repositories.data_repository import get_dataframes
from app.services.availability_parser import parse_availability
import os

router = APIRouter()

import os

# Usar ruta absoluta para el archivo temporal
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMP_FILE = os.path.join(BASE_DIR, "temp_excel.xlsx")

@router.get("/projects/{project_id}/availability")
async def get_project_availability(project_id: str):
    """
    Retorna la disponibilidad detallada de un proyecto.
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
            detail="El archivo Excel no contiene la hoja 'Componentes de Disponibilidad'. Verifica que tu archivo tenga esta hoja."
        )

    # Obtener el mes de reporte desde df_main
    report_month_str = "2026-02"  # Default
    try:
        if "Mes de Reporte" in df_main.columns:
            report_month_str = str(df_main.iloc[0]["Mes de Reporte"])
    except Exception:
        pass  # Usar valor por defecto si hay error

    try:
        result = parse_availability(df_availability, df_main, project_id, report_month_str)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculando disponibilidad para '{project_id}': {str(e)}"
        )

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontraron datos de disponibilidad para el proyecto '{project_id}'. Verifica que el nombre del proyecto en el Excel coincida exactamente."
        )

    return result
