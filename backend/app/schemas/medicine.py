from pydantic import BaseModel
from typing import Optional


class MedicineBase(BaseModel):
    medicine_name: str
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    stock: Optional[int] = 0
    unit: Optional[str] = None


class MedicineCreate(MedicineBase):
    medicine_id: str = ""  # Ignored — ID is generated server-side


class MedicineOut(MedicineBase):
    medicine_id: str
    hospital_id: str

    class Config:
        from_attributes = True
