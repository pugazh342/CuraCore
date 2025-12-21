# File: D:\CuraCore\create_dummy_data.py
from backend.app.core.database import SessionLocal, engine, Base
from backend.app.models.users import User
from backend.app.models.doctors import Doctor
from backend.app.models.appointments import Appointment
from datetime import datetime, timedelta
import random

# Re-create tables to ensure they are clean (Optional)
# Base.metadata.drop_all(bind=engine)
# Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_data():
    print("🌱 Seeding Dummy Data...")

    # --- 1. Create Doctors ---
    docs = [
        Doctor(
            full_name="Dr. Sarah Smith",
            email="sarah@hospital.com",
            specialization="Cardiologist",
            qualification="MBBS, MD (Cardiology)",
            experience_years=12,
            location="City Heart Center",
            consultation_fee=1500.0,
            image_url="https://ui-avatars.com/api/?name=Sarah+Smith&background=random"
        ),
        Doctor(
            full_name="Dr. Raj Patel",
            email="raj@skinclinic.com",
            specialization="Dermatologist",
            qualification="MBBS, DDVL",
            experience_years=8,
            location="DermaCare Clinic",
            consultation_fee=800.0,
            image_url="https://ui-avatars.com/api/?name=Raj+Patel&background=random"
        ),
        Doctor(
            full_name="Dr. Emily Chen",
            email="emily@health.com",
            specialization="General Physician",
            qualification="MBBS",
            experience_years=5,
            location="Community Health Hub",
            consultation_fee=500.0,
            image_url="https://ui-avatars.com/api/?name=Emily+Chen&background=random"
        )
    ]
    
    # Check if doctors exist before adding
    if db.query(Doctor).count() == 0:
        db.add_all(docs)
        db.commit()
        print("✅ Added 3 Doctors")
    else:
        print("ℹ️ Doctors already exist")

    # --- 2. Create Patient ---
    patient = User(
        full_name="Pugazh Mani",
        email="pugazh@gmail.com",
        hashed_password="hashed_secret_password", # In real app, we hash this!
        avatar_url="https://ui-avatars.com/api/?name=Pugazh+Mani&background=0D8ABC&color=fff",
        age=28,
        gender="Male",
        blood_group="O+"
    )
    
    if db.query(User).count() == 0:
        db.add(patient)
        db.commit()
        print("✅ Added Patient: Pugazh Mani")
    else:
        patient = db.query(User).first()
        print("ℹ️ Patient already exists")

    # --- 3. Create Appointments ---
    # Need IDs for foreign keys
    doc_cardio = db.query(Doctor).filter_by(specialization="Cardiologist").first()
    doc_derma = db.query(Doctor).filter_by(specialization="Dermatologist").first()

    appts = [
        # Appointment 1: COMPLETED (Has AI Summary)
        Appointment(
            patient_id=patient.id,
            doctor_id=doc_cardio.id,
            appointment_date=datetime.utcnow() - timedelta(days=2),
            status="completed",
            symptoms="I feel a tightness in my chest when I climb stairs.",
            ai_summary="Patient reports angina-like symptoms triggered by exertion. Duration: 2 weeks. No history of smoking. BP slightly elevated.",
            doctor_notes="Prescribed EcoSprin. Requested ECG."
        ),
        # Appointment 2: PENDING (For the Queue)
        Appointment(
            patient_id=patient.id,
            doctor_id=doc_derma.id,
            appointment_date=datetime.utcnow() + timedelta(days=1),
            status="pending",
            symptoms="I have a red itchy rash on my left arm.",
            ai_summary="Patient reports localized dermatitis on left forearm. Possible allergic reaction to new detergent. Mild severity.",
            doctor_notes=None
        )
    ]

    if db.query(Appointment).count() == 0:
        db.add_all(appts)
        db.commit()
        print("✅ Added 2 Appointments (1 Completed, 1 Pending)")
    else:
        print("ℹ️ Appointments already exist")

    db.close()
    print("🎉 Database Seeding Complete!")

if __name__ == "__main__":
    seed_data()