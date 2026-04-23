"""
upload.py — Endpoint de upload V3
Valida el Excel contra el esquema V3 antes de procesarlo.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

from app.services.excel_parser import validate_columns, group_project_data, get_all_projects
from app.services.incident_parser import parse_incidents

router = APIRouter()


@router.post("/upload")
async def upload_excel(file: UploadFile = File(...)):
    """
    Endpoint de carga de Excel V3.
    Valida columnas, detecta esquema antiguo y procesa cada proyecto.
    """
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=422, detail="Formato inválido. Solo se aceptan archivos .xlsx o .xls")

    contents = await file.read()

    try:
        df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Error leyendo el archivo Excel: {str(e)}")

    # Tarea 1.2 y 1.3: Validar esquema (detecta antiguo y columnas faltantes)
    try:
        validate_columns(df)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Procesar cada proyecto
    projects = get_all_projects(df)
    results = []

    for project_name in projects:
        grouped = group_project_data(df, project_name)
        incident_data = parse_incidents(grouped["summary"], grouped["incidents"])
        results.append(incident_data)

    return {"projects": results, "total_projects": len(results)}
