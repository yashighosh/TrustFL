from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class MedicalRecord(Base):
    __tablename__ = "medical_record"

    record_id = Column(String(10), primary_key=True)
    patient_id = Column(String(10), ForeignKey("patient.patient_id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(String(10), ForeignKey("doctor.doctor_id", ondelete="SET NULL"))
    diagnosis = Column(Text)
    symptoms = Column(Text)
    visit_date = Column(DateTime, server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="medical_records")
    doctor = relationship("Doctor", back_populates="medical_records")
    lab_tests = relationship("LabTest", back_populates="medical_record", cascade="all, delete-orphan")
    prescriptions = relationship("Prescription", back_populates="medical_record", cascade="all, delete-orphan")
