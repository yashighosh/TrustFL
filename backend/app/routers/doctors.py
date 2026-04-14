from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.schemas.doctor import DoctorCreate, DoctorOut
from app.utils.deps import get_current_hospital

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])


@router.get("/", response_model=List[DoctorOut])
def get_doctors(
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Get all doctors for the currently authenticated hospital"""
    doctors = db.query(Doctor).filter(Doctor.hospital_id == current_hospital.hospital_id).all()
    return doctors


@router.post("/", response_model=DoctorOut)
def create_doctor(
    doctor_in: DoctorCreate,
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Register a new doctor for the hospital"""
    # Check if ID exists globally (IDs should ideally be unique or generated)
    if db.query(Doctor).filter(Doctor.doctor_id == doctor_in.doctor_id).first():
        raise HTTPException(status_code=400, detail="Doctor ID already exists")

    db_doctor = Doctor(
        doctor_id=doctor_in.doctor_id,
        hospital_id=current_hospital.hospital_id,
        doctor_name=doctor_in.doctor_name,
        specialization=doctor_in.specialization,
        experience_years=doctor_in.experience_years,
        contact_number=doctor_in.contact_number,
        status=doctor_in.status
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor
