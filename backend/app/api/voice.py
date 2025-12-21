# File: backend/app/api/voice.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.app.services.whisper_service import whisper_service
import shutil
import os
import uuid

router = APIRouter()
UPLOAD_DIR = "backend/data/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # 1. Save the upload temporarily
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Transcribe
    print(f"🎤 Processing audio: {filename}")
    text = whisper_service.transcribe(file_path)
    
    # 3. Cleanup (Optional: delete file after processing)
    # os.remove(file_path)
    
    return {"text": text}