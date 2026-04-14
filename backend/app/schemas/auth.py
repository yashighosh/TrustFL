from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class HospitalBase(BaseModel):
    hospital_name: str
    hospital_location: Optional[str] = None
    hospital_type: Optional[str] = None
    contact_email: EmailStr
    contact_phone: Optional[str] = None


class HospitalCreate(HospitalBase):
    hospital_id: str
    password: str


class HospitalOut(HospitalBase):
    hospital_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    hospital: Optional[HospitalOut] = None
    role: str = "hospital"


class TokenData(BaseModel):
    id: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    hospital_id: str
    password: str


class AdminLoginRequest(BaseModel):
    admin_key: str
