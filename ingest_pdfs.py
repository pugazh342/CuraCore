# File: D:\CuraCore\ingest_pdfs.py
import os
import sys

# Ensure Python can find the backend module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.services.rag_service import rag_service

PDF_FOLDER = "backend/data/medical_pdfs"

def main():
    print(f"📂 Scanning '{PDF_FOLDER}' for medical documents...")
    
    if not os.path.exists(PDF_FOLDER):
        print(f"❌ Error: Folder '{PDF_FOLDER}' not found!")
        return

    files = [f for f in os.listdir(PDF_FOLDER) if f.endswith(".pdf")]
    
    if not files:
        print("⚠️ No PDFs found. Please add some files first.")
        return

    print(f"found {len(files)} PDFs. Starting ingestion...")

    for file in files:
        path = os.path.join(PDF_FOLDER, file)
        try:
            rag_service.ingest_file(path)
            print(f"✅ Successfully ingested: {file}")
        except Exception as e:
            print(f"❌ Failed to ingest {file}: {str(e)}")

    print("\n🎉 Brain Upgrade Complete! The AI now knows your documents.")

if __name__ == "__main__":
    main()