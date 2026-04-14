from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.hospital import Hospital
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.medical_record import MedicalRecord
from app.models.model_update import ModelUpdate
from app.models.contribution import ContributionScore
from app.schemas.auth import TokenData
from app.utils.deps import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/network-overview")
def get_network_overview(
    db: Session = Depends(get_db),
    admin: TokenData = Depends(get_current_admin)
):
    """Get aggregated stats for all hospitals"""
    hospitals = db.query(Hospital).all()
    
    network_data = []
    total_doctors = 0
    total_patients = 0
    total_records = 0
    
    for h in hospitals:
        doctors_count = db.query(func.count(Doctor.doctor_id)).filter(Doctor.hospital_id == h.hospital_id).scalar()
        patients_count = db.query(func.count(Patient.patient_id)).filter(Patient.hospital_id == h.hospital_id).scalar()
        
        # Patients assigned to this hospital
        h_patients = db.query(Patient.patient_id).filter(Patient.hospital_id == h.hospital_id).subquery()
        records_count = db.query(func.count(MedicalRecord.record_id)).filter(MedicalRecord.patient_id.in_(h_patients)).scalar()
        
        # Calculate FL stats
        avg_acc = db.query(func.avg(ModelUpdate.accuracy)).filter(ModelUpdate.hospital_id == h.hospital_id).scalar() or 0
        reputation = db.query(func.avg(ContributionScore.reputation_score)).filter(ContributionScore.hospital_id == h.hospital_id).scalar() or 0
        
        total_doctors += doctors_count
        total_patients += patients_count
        total_records += records_count
        
        network_data.append({
            "id": h.hospital_id,
            "name": h.hospital_name,
            "location": h.hospital_location,
            "type": h.hospital_type,
            "doctors": doctors_count,
            "patients": patients_count,
            "records": records_count,
            "accuracy": f"{avg_acc * 100:.1f}%" if avg_acc <= 1 else f"{avg_acc:.1f}%",
            "reputation": round(float(reputation), 2),
            "status": "active",
            "registeredAt": h.created_at.strftime("%Y-%m-%d") if h.created_at else ""
        })
        
    return {
        "hospitals": network_data,
        "summary": {
            "total_hospitals": len(hospitals),
            "total_doctors": total_doctors,
            "total_patients": total_patients,
            "total_records": total_records
        }
    }


@router.get("/doctors")
def get_all_doctors(
    db: Session = Depends(get_db),
    admin: TokenData = Depends(get_current_admin)
):
    doctors = db.query(Doctor).all()
    results = []
    for d in doctors:
        hospital = db.query(Hospital).filter(Hospital.hospital_id == d.hospital_id).first()
        results.append({
            "id": d.doctor_id,
            "name": d.doctor_name,
            "specialization": d.specialization,
            "experience": d.experience_years,
            "hospital": d.hospital_id,
            "hospitalName": hospital.hospital_name if hospital else "Unknown"
        })
    return results


@router.get("/patients")
def get_all_patients(
    db: Session = Depends(get_db),
    admin: TokenData = Depends(get_current_admin)
):
    patients = db.query(Patient).all()
    results = []
    for p in patients:
        hospital = db.query(Hospital).filter(Hospital.hospital_id == p.hospital_id).first()
        results.append({
            "id": p.patient_id,
            "name": p.patient_name,
            "age": 30, # Simplified for demo since DB has date_of_birth
            "blood": p.blood_group,
            "hospital": p.hospital_id,
            "hospitalName": hospital.hospital_name if hospital else "Unknown"
        })
    return results
