# File: backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <--- NEW IMPORT
from backend.app.core.database import engine, Base
from backend.app.models import users, doctors, appointments

# Imports
from backend.app.api import doctors as doctors_router
from backend.app.api import chat as chat_router
from backend.app.api import voice as voice_router
from backend.app.api import appointments as appt_router

from backend.app.api import auth as auth_router
app = FastAPI(title="CuraCore Brain", version="1.0")

# --- 🛡️ CORS MIDDLEWARE (The Fix) ---
# This tells the backend: "Accept requests from the Frontend"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Frontend URL
    allow_credentials=True,
    allow_methods=["*"], # Allow GET, POST, etc.
    allow_headers=["*"],
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# --- REGISTER ROUTERS ---
app.include_router(doctors_router.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(chat_router.router, prefix="/api/chat", tags=["Chat"])
app.include_router(voice_router.router, prefix="/api/voice", tags=["Voice"])
app.include_router(appt_router.router,prefix="/api/appointments", tags=["Appointments"])
app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def read_root():
    return {"status": "online"}