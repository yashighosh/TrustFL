from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Numeric, func
from sqlalchemy.orm import relationship
from app.database import Base


class ModelUpdate(Base):
    __tablename__ = "model_update"

    update_id = Column(String(10), primary_key=True)
    round_id = Column(String(10), ForeignKey("training_round.round_id", ondelete="CASCADE"), nullable=False)
    hospital_id = Column(String(10), ForeignKey("hospital.hospital_id", ondelete="CASCADE"), nullable=False)
    model_hash = Column(String(255), nullable=False)
    accuracy = Column(Numeric(5, 2))
    loss_value = Column(Numeric(8, 4))
    training_samples = Column(Integer)
    submission_timestamp = Column(DateTime, server_default=func.now())

    # Relationships
    training_round = relationship("TrainingRound", back_populates="model_updates")
    hospital = relationship("Hospital", back_populates="model_updates")
    blockchain_verification = relationship("BlockchainVerification", back_populates="model_update", uselist=False, cascade="all, delete-orphan")
