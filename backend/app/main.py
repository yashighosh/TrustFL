from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import get_settings
import os
import traceback

settings = get_settings()

app = FastAPI(
    title="TrustFL Backend API",
    description="Backend API for TrustFL federated learning database.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler — ensures CORS headers are sent even on 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "traceback": traceback.format_exc()
        },
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )


from app.routers import auth, doctors, patients, records, medicines, admin, fl, blockchain

@app.get("/")
def read_root():
    return {"message": "Welcome to TrustFL API"}

@app.get("/health")
def health_check():
    """Diagnostic endpoint to check DB connectivity and table existence."""
    from sqlalchemy import inspect, text
    from app.database import engine
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            db_ok = result.scalar() == 1
        return {
            "status": "ok",
            "database_connected": db_ok,
            "tables_found": tables,
            "table_count": len(tables),
            "database_url_prefix": settings.DATABASE_URL[:30] + "..."
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        }

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(patients.router)
app.include_router(records.router)
app.include_router(medicines.router)
app.include_router(admin.router)
app.include_router(fl.router)
app.include_router(blockchain.router)

