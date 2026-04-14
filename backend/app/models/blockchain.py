from sqlalchemy import Column, String, BigInteger, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class BlockchainVerification(Base):
    __tablename__ = "blockchain_verification"

    verification_id = Column(String(10), primary_key=True)
    update_id = Column(String(10), ForeignKey("model_update.update_id", ondelete="CASCADE"), unique=True, nullable=False)
    blockchain_transaction_hash = Column(String(255), nullable=False)
    block_number = Column(BigInteger)
    verification_status = Column(String(20), default="Pending")
    verification_timestamp = Column(DateTime, server_default=func.now())

    # Relationships
    model_update = relationship("ModelUpdate", back_populates="blockchain_verification")
