import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.patient import Patient
from app.models.hospital import Hospital
from app.schemas.patient import PatientCreate, PatientOut
from app.utils.deps import get_current_hospital

router = APIRouter(prefix="/api/patients", tags=["Patients"])


@router.get("/", response_model=List[PatientOut])
def get_patients(
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Get all patients for the currently authenticated hospital"""
    patients = db.query(Patient).filter(Patient.hospital_id == current_hospital.hospital_id).all()
    return patients


@router.post("/", response_model=PatientOut)
def create_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Register a new patient for the hospital"""
    # Generate a globally unique ID server-side to avoid collisions across hospitals
    generated_id = f"P-{uuid.uuid4().hex[:8].upper()}"

    db_patient = Patient(
        patient_id=generated_id,
        hospital_id=current_hospital.hospital_id,
        patient_name=patient_in.patient_name,
        gender=patient_in.gender,
        date_of_birth=patient_in.date_of_birth,
        blood_group=patient_in.blood_group,
        contact_phone=patient_in.contact_phone
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient
