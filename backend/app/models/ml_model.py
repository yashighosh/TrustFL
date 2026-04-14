from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class MLModel(Base):
    __tablename__ = "ml_model"

    model_id = Column(String(10), primary_key=True)
    model_name = Column(String(100), nullable=False)
    algorithm_type = Column(String(100))
    model_version = Column(String(20))
    creation_date = Column(DateTime, server_default=func.now())

    # Relationships
    training_rounds = relationship("TrainingRound", back_populates="ml_model", cascade="all, delete-orphan")
