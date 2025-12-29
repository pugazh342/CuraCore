from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bot_engine import TriageBot

app = FastAPI(title="CuraCore Triage API")

# Simple in-memory storage for session (Use Redis/Postgres for production)
sessions = {}

class UserInput(BaseModel):
    user_id: str
    message: str

@app.post("/chat")
async def chat_endpoint(input_data: UserInput):
    user_id = input_data.user_id
    user_text = input_data.message

    # Create new session if not exists
    if user_id not in sessions:
        sessions[user_id] = TriageBot()
        # If it's a new session, you might want to send a welcome message, 
        # but here we just process the first input or initialize.
    
    bot = sessions[user_id]
    
    response = bot.process_input(user_text)
    
    # Reset session if analysis is complete (optional)
    if bot.state == "ANALYSIS":
        del sessions[user_id]
        
    return {"response": response, "current_state": bot.state}

@app.get("/reset/{user_id}")
async def reset_session(user_id: str):
    if user_id in sessions:
        del sessions[user_id]
    return {"status": "Session reset"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)