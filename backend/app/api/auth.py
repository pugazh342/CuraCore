from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from backend.app.core.database import get_db
from backend.app.models.users import User

router = APIRouter()

# Password Hashing Tool
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic Models
class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "patient" # default

class UserLogin(BaseModel):
    email: str
    password: str

# Helpers
def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- ENDPOINTS ---

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if email exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Create User
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"status": "success", "user_id": new_user.id, "role": new_user.role}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # 1. Find User
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 2. Check Password
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    # 3. Return Info (In real app, return JWT Token here)
    return {
        "status": "success",
        "user_id": db_user.id,
        "full_name": db_user.full_name,
        "email": db_user.email,
        "role": db_user.role
    }

@router.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user