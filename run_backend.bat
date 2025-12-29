@echo off
cd /d "%~dp0"
call venv\Scripts\activate
uvicorn backend.app.main:app --reload --port 8001
pause