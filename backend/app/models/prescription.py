from sqlalchemy import Column, String, Integer, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Prescription(Base):
    __tablename__ = "prescription"

    prescription_id = Column(String(10), primary_key=True)
    record_id = Column(String(10), ForeignKey("medical_record.record_id", ondelete="CASCADE"), nullable=False)
    medication_name = Column(String(100), nullable=False)
    dosage = Column(String(50))
    duration_days = Column(Integer)

    __table_args__ = (
        CheckConstraint("duration_days > 0", name="chk_prescription_duration"),
    )

    # Relationships
    medical_record = relationship("MedicalRecord", back_populates="prescriptions")
