from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Medicine(Base):
    __tablename__ = "medicine"

    medicine_id = Column(String(10), primary_key=True)
    hospital_id = Column(String(10), ForeignKey("hospital.hospital_id", ondelete="CASCADE"), nullable=False)
    medicine_name = Column(String(100), nullable=False)
    category = Column(String(100))
    manufacturer = Column(String(100))
    stock = Column(Integer, default=0)
    unit = Column(String(50))

    # Relationships
    hospital = relationship("Hospital", back_populates="medicines")
