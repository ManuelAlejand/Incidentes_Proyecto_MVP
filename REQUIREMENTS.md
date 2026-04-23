# Requisitos del Proyecto

Este documento resume las dependencias necesarias para ejecutar tanto el Frontend como el Backend.

## 🐍 Backend (Python)
Ubicación: `./backend/`

Para instalar las dependencias, asegúrate de tener activado tu entorno virtual y ejecuta:
```bash
pip install -r backend/requirements.txt
```

### Dependencias Principales:
- **fastapi**: Framework para el API.
- **uvicorn**: Servidor ASGI para ejecutar FastAPI.
- **pandas**: Procesamiento de datos del Excel.
- **openpyxl**: Motor para lectura de archivos .xlsx.
- **python-multipart**: Necesario para la carga de archivos en el API.

---

## ⚛️ Frontend (Node.js)
Ubicación: `./frontend/`

Para instalar las dependencias, ejecuta:
```bash
cd frontend
npm install
```

### Dependencias Principales:
- **react / react-dom**: Biblioteca base de la interfaz.
- **lucide-react**: Iconografía.
- **recharts**: Visualización de gráficas.
- **xlsx (SheetJS)**: Procesamiento de archivos Excel en el cliente.
- **zustand**: Gestión del estado global (persistido en sessionStorage).
- **vite**: Herramienta de construcción y servidor de desarrollo.

---

## 🚀 Guía Rápida de Ejecución

### Backend
```bash
cd backend
# Para ejecutar el servidor:
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```
