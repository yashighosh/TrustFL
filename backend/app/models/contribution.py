from sqlalchemy import Column, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class ContributionScore(Base):
    __tablename__ = "contribution_score"

    contribution_id = Column(String(10), primary_key=True)
    hospital_id = Column(String(10), ForeignKey("hospital.hospital_id", ondelete="CASCADE"), nullable=False)
    round_id = Column(String(10), ForeignKey("training_round.round_id", ondelete="CASCADE"), nullable=False)
    contribution_value = Column(Numeric(6, 3))
    reputation_score = Column(Numeric(6, 3))

    # Relationships
    hospital = relationship("Hospital", back_populates="contribution_scores")
    training_round = relationship("TrainingRound", back_populates="contribution_scores")
