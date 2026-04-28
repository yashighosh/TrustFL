from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PrescriptionBase(BaseModel):
    medication_name: str
    dosage: Optional[str] = None
    duration_days: Optional[int] = None


class LabTestBase(BaseModel):
    test_type: Optional[str] = None
    test_result: Optional[str] = None


class MedicalRecordBase(BaseModel):
    patient_id: str
    doctor_id: Optional[str] = None
    diagnosis: Optional[str] = None
    symptoms: Optional[str] = None


class MedicalRecordCreate(MedicalRecordBase):
    record_id: str = ""  # Ignored — ID is generated server-side
    prescriptions: Optional[List[PrescriptionBase]] = []


class PrescriptionOut(PrescriptionBase):
    prescription_id: str

    class Config:
        from_attributes = True


class MedicalRecordOut(MedicalRecordBase):
    record_id: str
    visit_date: datetime
    prescriptions: List[PrescriptionOut] = []

    class Config:
        from_attributes = True
