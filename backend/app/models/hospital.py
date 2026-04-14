from sqlalchemy import Column, String, DateTime, text
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy import func


class Hospital(Base):
    __tablename__ = "hospital"

    hospital_id = Column(String(10), primary_key=True)
    hospital_name = Column(String(100), nullable=False)
    hospital_location = Column(String(150))
    hospital_type = Column(String(50))
    contact_email = Column(String(100), unique=True)
    contact_phone = Column(String(15))
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    doctors = relationship("Doctor", back_populates="hospital", cascade="all, delete-orphan")
    patients = relationship("Patient", back_populates="hospital", cascade="all, delete-orphan")
    model_updates = relationship("ModelUpdate", back_populates="hospital", cascade="all, delete-orphan")
    contribution_scores = relationship("ContributionScore", back_populates="hospital", cascade="all, delete-orphan")
    medicines = relationship("Medicine", back_populates="hospital", cascade="all, delete-orphan")
