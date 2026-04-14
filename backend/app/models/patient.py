from sqlalchemy import Column, String, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Patient(Base):
    __tablename__ = "patient"

    patient_id = Column(String(10), primary_key=True)
    hospital_id = Column(String(10), ForeignKey("hospital.hospital_id", ondelete="CASCADE"), nullable=False)
    patient_name = Column(String(100), nullable=False)
    gender = Column(String(10))
    date_of_birth = Column(Date)
    blood_group = Column(String(5))
    contact_phone = Column(String(15))
    registration_date = Column(Date, server_default=func.current_date())

    # Relationships
    hospital = relationship("Hospital", back_populates="patients")
    medical_records = relationship("MedicalRecord", back_populates="patient", cascade="all, delete-orphan")
