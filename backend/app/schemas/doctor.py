from pydantic import BaseModel
from typing import Optional


class DoctorBase(BaseModel):
    doctor_name: str
    specialization: Optional[str] = None
    experience_years: Optional[int] = 0
    contact_number: Optional[str] = None
    status: Optional[str] = "Active"


class DoctorCreate(DoctorBase):
    doctor_id: str


# Used for POST requests — ID is now generated server-side
class DoctorCreateIn(DoctorBase):
    pass


class DoctorOut(DoctorBase):
    doctor_id: str
    hospital_id: str

    class Config:
        from_attributes = True
