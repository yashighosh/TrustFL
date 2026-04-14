from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class TrainingRound(Base):
    __tablename__ = "training_round"

    round_id = Column(String(10), primary_key=True)
    model_id = Column(String(10), ForeignKey("ml_model.model_id", ondelete="CASCADE"), nullable=False)
    round_number = Column(Integer, nullable=False)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String(20), default="Pending")
    global_model_accuracy = Column(Numeric(5, 4))
    actual_participants = Column(Integer, default=0)

    # Relationships
    ml_model = relationship("MLModel", back_populates="training_rounds")
    model_updates = relationship("ModelUpdate", back_populates="training_round", cascade="all, delete-orphan")
    contribution_scores = relationship("ContributionScore", back_populates="training_round", cascade="all, delete-orphan")
