from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    
    # Data
    appointment_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending") # pending, completed, cancelled
    symptoms = Column(Text)
    ai_summary = Column(Text, nullable=True)

    # --- RELATIONSHIPS ---
    # These must match the names in User/Doctor models
    patient = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")