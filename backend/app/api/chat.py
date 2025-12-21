# File: backend/app/api/chat.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.services.rag_service import rag_service
from backend.app.services.llm_service import llm_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
def chat_with_ai(request: ChatRequest):
    user_msg = request.message
    
    # 1. Retrieve Context (The "Memory")
    print(f"🔍 Searching for: {user_msg}")
    context = rag_service.search(user_msg)
    
    # 2. Generate Answer (The "Brain")
    print("🤖 Generating response...")
    ai_reply = llm_service.generate_response(user_msg, context)
    
    return {
        "reply": ai_reply,
        "sources": context  # Optional: Show user what data was used
    }