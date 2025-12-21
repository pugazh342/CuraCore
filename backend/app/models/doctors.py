from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship # <--- Import this
from backend.app.core.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    specialization = Column(String, index=True)
    qualification = Column(String)
    experience_years = Column(Integer)
    location = Column(String)
    consultation_fee = Column(Integer)
    email = Column(String)
    image_url = Column(String)

    # --- RELATIONSHIPS ---
    # Links Doctor -> Appointments
    appointments = relationship("Appointment", back_populates="doctor")