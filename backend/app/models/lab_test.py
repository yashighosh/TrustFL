from sqlalchemy import Column, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class LabTest(Base):
    __tablename__ = "lab_test"

    test_id = Column(String(10), primary_key=True)
    record_id = Column(String(10), ForeignKey("medical_record.record_id", ondelete="CASCADE"), nullable=False)
    test_type = Column(String(100))
    test_result = Column(Text)
    test_date = Column(Date)

    # Relationships
    medical_record = relationship("MedicalRecord", back_populates="lab_tests")
