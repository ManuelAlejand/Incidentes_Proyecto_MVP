import pandas as pd
import io

def get_dataframes(contents: bytes):
    """
    Lee las dos hojas necesarias del Excel.
    """
    # Leer todo el workbook para acceder a las hojas por nombre
    xlsx = pd.ExcelFile(io.BytesIO(contents))
    
    # Hoja 1: Resumen e Incidentes (asumimos que es la primera o se llama 'Resumen')
    # Para retrocompatibilidad con el código actual que usa el primer df
    df_main = pd.read_excel(xlsx, sheet_name=0)
    
    # Hoja 2: Componentes de Disponibilidad
    df_availability = None
    if "Componentes de Disponibilidad" in xlsx.sheet_names:
        df_availability = pd.read_excel(xlsx, sheet_name="Componentes de Disponibilidad")
    
    return df_main, df_availability
