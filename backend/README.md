# Backend - Proyecto Alertas API

Esta es la API construida con **FastAPI** que proporciona servicios de procesamiento de datos y carga de archivos para el Dashboard.

## 🚀 Inicio Rápido

### Requisitos Previos
- Python 3.9 o superior instalado.

### Instalación

1. **Navegar a la carpeta del backend**:
   ```bash
   cd backend
   ```

2. **Crear un entorno virtual** (opcional pero recomendado):
   ```bash
   python -m venv venv
   ```

3. **Activar el entorno virtual**:
   - En Windows:
     ```bash
     venv\Scripts\activate
     ```
   - En macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

### Ejecución

Para iniciar el servidor de desarrollo:
```bash
uvicorn app.main:app --reload
```
La API estará disponible en `http://localhost:8000`. Puedes acceder a la documentación interactiva (Swagger) en `http://localhost:8000/docs`.

---

## 🛠️ Tecnologías
- **FastAPI**: Framework web moderno y rápido.
- **Uvicorn**: Servidor ASGI de alto rendimiento.
- **Pandas & Openpyxl**: Procesamiento eficiente de archivos Excel.
- **Pydantic**: Validación de datos y esquemas.

## 📁 Estructura
- `/app/main.py`: Punto de entrada y configuración de CORS.
- `/app/routers/`: Definición de los endpoints de la API.
- `/app/services/`: Lógica de negocio para el procesamiento de datos.
- `/app/models.py`: Modelos de datos y esquemas de respuesta.
