from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship # <--- Import this
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="patient")
    
    # Profile fields
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)

    # --- RELATIONSHIPS ---
    # This was missing! It links User -> Appointments
    appointments = relationship("Appointment", back_populates="patient")