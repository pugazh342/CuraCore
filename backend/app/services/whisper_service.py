# File: backend/app/services/whisper_service.py
import whisper
import os

class WhisperService:
    def __init__(self):
        print("👂 Loading Whisper Model (this may take a moment)...")
        # 'base' is a good balance. Use 'tiny' for speed if needed.
        try:
            self.model = whisper.load_model("base")
        except Exception as e:
            print(f"⚠️ Whisper load failed: {e}")
            self.model = None

    def transcribe(self, file_path: str):
        if not self.model:
            return "Error: Whisper model not loaded."
            
        if not os.path.exists(file_path):
            return "Error: File not found."
            
        try:
            result = self.model.transcribe(file_path)
            return result["text"]
        except Exception as e:
            return f"Error processing audio: {str(e)}"

# Singleton
whisper_service = WhisperService()