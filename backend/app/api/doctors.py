from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.doctors import Doctor

router = APIRouter()

@router.get("/")
def get_all_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()