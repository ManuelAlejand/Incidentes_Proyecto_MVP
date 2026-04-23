from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload

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

# Incluir los routers existentes
app.include_router(upload.router, prefix="/api", tags=["Upload"])

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
