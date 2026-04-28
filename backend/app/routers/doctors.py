import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.schemas.doctor import DoctorCreate, DoctorOut, DoctorCreateIn
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
    doctor_in: DoctorCreateIn,
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Register a new doctor for the hospital"""
    # Generate a globally unique ID server-side to avoid collisions across hospitals
    generated_id = f"D-{uuid.uuid4().hex[:8].upper()}"

    db_doctor = Doctor(
        doctor_id=generated_id,
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
