from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="TrustFL Backend API",
    description="Backend API for TrustFL federated learning database.",
    version="1.0.0"
)

# CORS configuration to allow local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from app.routers import auth, doctors, patients, records, medicines, admin, fl, blockchain

@app.get("/")
def read_root():
    return {"message": "Welcome to TrustFL API"}

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(patients.router)
app.include_router(records.router)
app.include_router(medicines.router)
app.include_router(admin.router)
app.include_router(fl.router)
app.include_router(blockchain.router)
