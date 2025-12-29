@echo off
echo Starting CuraCore Brain (Backend)...
start cmd /k "venv\Scripts\activate && uvicorn backend.app.main:app --reload --port 8001"

echo Starting CuraCore Face (Frontend)...
start cmd /k "cd frontend && npm run dev"

echo System Online! 🚀
