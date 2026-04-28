from pydantic import BaseModel
from typing import Optional
from datetime import date


class PatientBase(BaseModel):
    patient_name: str
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    blood_group: Optional[str] = None
    contact_phone: Optional[str] = None


class PatientCreate(PatientBase):
    patient_id: str = ""  # Ignored — ID is generated server-side


class PatientOut(PatientBase):
    patient_id: str
    hospital_id: str
    registration_date: date

    class Config:
        from_attributes = True
