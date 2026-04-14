from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    hospital_id = Column(String(10)) # Nullable if system action
    table_name = Column(String(50))
    record_id = Column(String(20))
    action = Column(String(20))
    new_values = Column(JSONB)
    performed_by = Column(String(50))
    performed_at = Column(DateTime, server_default=func.now())
