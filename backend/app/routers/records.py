import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medical_record import MedicalRecord
from app.models.prescription import Prescription
from app.models.patient import Patient
from app.models.hospital import Hospital
from app.schemas.medical_record import MedicalRecordCreate, MedicalRecordOut
from app.utils.deps import get_current_hospital

router = APIRouter(prefix="/api/records", tags=["Records"])


@router.get("/", response_model=List[MedicalRecordOut])
def get_records(
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Get all medical records for the currently authenticated hospital"""
    # Join with Patient to ensure we only get records for this hospital's patients
    records = db.query(MedicalRecord).join(Patient).filter(Patient.hospital_id == current_hospital.hospital_id).all()
    return records


@router.post("/", response_model=MedicalRecordOut)
def create_record(
    record_in: MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Create a new medical record along with associated prescriptions"""
    # Verify patient belongs to this hospital
    patient = db.query(Patient).filter(Patient.patient_id == record_in.patient_id).first()
    if not patient or patient.hospital_id != current_hospital.hospital_id:
        raise HTTPException(status_code=403, detail="Patient not found or unauthorized")

    # Generate a globally unique ID server-side to avoid collisions across hospitals
    generated_record_id = f"R-{uuid.uuid4().hex[:8].upper()}"

    db_record = MedicalRecord(
        record_id=generated_record_id,
        patient_id=record_in.patient_id,
        doctor_id=record_in.doctor_id,
        diagnosis=record_in.diagnosis,
        symptoms=record_in.symptoms
    )
    db.add(db_record)
    
    # Add prescriptions if any
    for pres in record_in.prescriptions:
        db_pres = Prescription(
            prescription_id=f"PR-{uuid.uuid4().hex[:6]}",
            record_id=db_record.record_id,
            medication_name=pres.medication_name,
            dosage=pres.dosage,
            duration_days=pres.duration_days
        )
        db.add(db_pres)

    db.commit()
    db.refresh(db_record)
    return db_record
