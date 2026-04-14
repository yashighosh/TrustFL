from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base


class SuperAdmin(Base):
    __tablename__ = "super_admin"

    admin_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_key = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
