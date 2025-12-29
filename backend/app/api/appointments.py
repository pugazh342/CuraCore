from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from backend.app.core.database import get_db
from backend.app.models.appointments import Appointment
from backend.app.models.doctors import Doctor
from backend.app.services.summarizer import generate_summary

router = APIRouter()

# Pydantic Model for incoming data
class AppointmentCreate(BaseModel):
    doctor_id: int
    patient_id: int # Hardcoded to 1 for demo
    symptoms: str   # From the chat

@router.post("/")
def create_appointment(appt: AppointmentCreate, db: Session = Depends(get_db)):
    # 1. Generate AI Summary immediately
    print("🧠 Generating medical summary for doctor...")
    summary = generate_summary(appt.symptoms)
    
    # 2. Save to Database
    db_appt = Appointment(
        patient_id=appt.patient_id,
        doctor_id=appt.doctor_id,
        symptoms=appt.symptoms,
        ai_summary=summary,
        status="pending",
        appointment_date=datetime.utcnow()
    )
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)
    
    return {"status": "success", "id": db_appt.id, "summary": summary}

@router.get("/doctor/{doctor_id}")
def get_doctor_queue(doctor_id: int, db: Session = Depends(get_db)):
    # Get all pending appointments for this doctor
    return db.query(Appointment)\
        .filter(Appointment.doctor_id == doctor_id)\
        .filter(Appointment.status == "pending")\
        .all()

@router.put("/{appt_id}/complete")
def complete_appointment(appt_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appt.status = "completed"
    db.commit()
    return {"status": "marked as completed"}

@router.get("/patient/{patient_id}")
def get_patient_history(patient_id: int, db: Session = Depends(get_db)):
    # Get all appointments for this patient
    return db.query(Appointment)\
        .filter(Appointment.patient_id == patient_id)\
        .order_by(Appointment.appointment_date.desc())\
        .all()