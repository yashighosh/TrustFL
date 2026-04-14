from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medicine import Medicine
from app.models.hospital import Hospital
from app.schemas.medicine import MedicineCreate, MedicineOut
from app.utils.deps import get_current_hospital

router = APIRouter(prefix="/api/medicines", tags=["Medicines"])


@router.get("/", response_model=List[MedicineOut])
def get_medicines(
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Get all medicines for the currently authenticated hospital"""
    medicines = db.query(Medicine).filter(Medicine.hospital_id == current_hospital.hospital_id).all()
    return medicines


@router.post("/", response_model=MedicineOut)
def create_medicine(
    medicine_in: MedicineCreate,
    db: Session = Depends(get_db),
    current_hospital: Hospital = Depends(get_current_hospital)
):
    """Register a new medicine for the hospital"""
    if db.query(Medicine).filter(Medicine.medicine_id == medicine_in.medicine_id).first():
        raise HTTPException(status_code=400, detail="Medicine ID already exists")

    db_medicine = Medicine(
        medicine_id=medicine_in.medicine_id,
        hospital_id=current_hospital.hospital_id,
        medicine_name=medicine_in.medicine_name,
        category=medicine_in.category,
        manufacturer=medicine_in.manufacturer,
        stock=medicine_in.stock,
        unit=medicine_in.unit
    )
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine
