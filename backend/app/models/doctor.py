from sqlalchemy import Column, String, Integer, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Doctor(Base):
    __tablename__ = "doctor"

    doctor_id = Column(String(10), primary_key=True)
    hospital_id = Column(String(10), ForeignKey("hospital.hospital_id", ondelete="CASCADE"), nullable=False)
    doctor_name = Column(String(100), nullable=False)
    specialization = Column(String(100))
    experience_years = Column(Integer)
    contact_number = Column(String(15))
    status = Column(String(20), default="Active")

    __table_args__ = (
        CheckConstraint("experience_years >= 0", name="chk_doctor_experience"),
    )

    # Relationships
    hospital = relationship("Hospital", back_populates="doctors")
    medical_records = relationship("MedicalRecord", back_populates="doctor")
