from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.hospital import Hospital
from app.schemas.auth import HospitalCreate, HospitalOut, LoginRequest, AdminLoginRequest, Token
from app.utils.security import get_password_hash, verify_password, create_access_token
from app.utils.deps import get_current_hospital
from app.config import get_settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
settings = get_settings()


@router.post("/register", response_model=Token)
def register_hospital(hospital_in: HospitalCreate, db: Session = Depends(get_db)):
    # Check if hospital already exists
    hospital = db.query(Hospital).filter(
        (Hospital.hospital_id == hospital_in.hospital_id) | 
        (Hospital.contact_email == hospital_in.contact_email)
    ).first()
    
    if hospital:
        raise HTTPException(status_code=400, detail="Hospital ID or Email already registered")
        
    hashed_password = get_password_hash(hospital_in.password)
    
    db_hospital = Hospital(
        hospital_id=hospital_in.hospital_id,
        hospital_name=hospital_in.hospital_name,
        hospital_location=hospital_in.hospital_location,
        hospital_type=hospital_in.hospital_type,
        contact_email=hospital_in.contact_email,
        contact_phone=hospital_in.contact_phone,
        password_hash=hashed_password
    )
    
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    
    access_token = create_access_token(data={"sub": db_hospital.hospital_id, "role": "hospital"})
    
    return {"access_token": access_token, "token_type": "bearer", "hospital": db_hospital, "role": "hospital"}


@router.post("/login", response_model=Token)
def login_hospital(login_data: LoginRequest, db: Session = Depends(get_db)):
    hospital = db.query(Hospital).filter(Hospital.hospital_id == login_data.hospital_id).first()
    if not hospital or not verify_password(login_data.password, hospital.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect hospital ID or password")
        
    access_token = create_access_token(data={"sub": hospital.hospital_id, "role": "hospital"})
    
    return {"access_token": access_token, "token_type": "bearer", "hospital": hospital, "role": "hospital"}


@router.post("/admin-login", response_model=Token)
def login_superadmin(login_data: AdminLoginRequest):
    if login_data.admin_key != settings.ADMIN_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin key")
        
    access_token = create_access_token(data={"sub": "superadmin", "role": "admin"})
    
    return {"access_token": access_token, "token_type": "bearer", "role": "admin"}


@router.get("/me", response_model=HospitalOut)
def get_me(current_hospital: Hospital = Depends(get_current_hospital)):
    return current_hospital
