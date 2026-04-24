from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import upload, availability, availability_trend

app = FastAPI(
    title="Proyecto Alertas API",
    description="API para el procesamiento de incidentes y SLAs desde archivos Excel",
    version="1.0.0"
)

# Configuración de CORS
# Permite que el frontend (usualmente en http://localhost:5173) acceda al backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos en desarrollo. Cambiar a dominios específicos en producción.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handler global de excepciones no capturadas
# CRÍTICO: Sin esto, un 500 interno NO incluye los headers CORS y el browser bloquea la respuesta
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Error interno del servidor: {str(exc)}"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Incluir los routers existentes
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(availability.router, prefix="/api", tags=["Availability"])
app.include_router(availability_trend.router, prefix="/api/v1", tags=["Trend"])


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Proyecto Alertas API is running",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # Comando para ejecutar manualmente: python -m app.main
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
