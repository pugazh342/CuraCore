### 🛠️ CuraCore Setup & Architecture Guide

This document provides a technical deep-dive into the **CuraCore** architecture and detailed instructions for setting up the development environment from scratch.

---

## 🏗️ System Architecture

CuraCore follows a **Client–Server–AI** architecture.  
The system is designed to run **entirely offline**, utilizing **local inference** for both:

- LLM (Large Language Models)
- ASR (Automatic Speech Recognition)

No patient data is ever sent to the cloud.

---

## 🔁 High-Level Data Flow

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend [React Client]
        UI[User Interface]
        Voice[Voice Recorder]
        Auth[Auth Context]
    end

    %% Backend Layer
    subgraph Backend [FastAPI Server]
        API[API Routes]
        AuthServ[Auth Service]
        RAG[RAG Service]
        Whisper[Whisper Service]
        Summ[Summarizer Service]
    end

    %% Data & AI Layer
    subgraph Storage_AI [Local Storage & Intelligence]
        SQLite[(SQLite DB<br/>Users & Appointments)]
        Chroma[(ChromaDB<br/>Vector Store)]
        PDFs[Medical PDFs]
        Ollama[[Ollama<br/>Gemma / Llama3]]
        WhisperModel[[Whisper Model]]
    end

    %% Connections
    UI -->|JSON / HTTP| API
    Voice -->|Audio Blob| API

    API -->|Verify JWT| AuthServ
    AuthServ -->|Read / Write| SQLite

    API -->|Audio File| Whisper
    Whisper -->|Transcribe| WhisperModel

    API -->|Search Query| RAG
    RAG -->|Retrieve Context| Chroma

    API -->|Prompt + Context| Ollama
    Ollama -->|AI Response| API

    API -->|Store Appointment| SQLite
    API -->|Generate Summary| Summ
    Summ -->|Prompt| Ollama
````

---

## 📋 Prerequisites

Before starting, ensure your machine meets the following requirements:

### 🖥️ System

* **OS:** Windows 10/11, macOS, or Linux
* **RAM:** Minimum 8 GB (16 GB recommended)

### 🧰 Software

* Python **3.10+**
* Node.js **18+**
* Git
* **Ollama** (for running LLMs locally)

---

## ⚡ Quick Start Guide

---

## 🔹 Phase 1: AI Model Setup (LLM Runtime)

CuraCore uses **Ollama** to run the LLM locally.

1. Download and install **Ollama** from the official website.
2. Pull a lightweight model (recommended):

```bash
ollama pull gemma:2b
```

3. Ensure Ollama is running:

```bash
ollama serve
```

---

## 🔹 Phase 2: Backend Setup (The Brain)

### Navigate to the Project Root

```bash
cd CuraCore
```

---

### Create a Virtual Environment

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

If `requirements.txt` is not present, install manually:

```bash
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose \
python-multipart openai-whisper langchain-text-splitters \
sentence-transformers chromadb pypdf ollama
```

---

### 📚 Ingest Medical Data (RAG Memory)

1. Place medical PDFs into:

```text
backend/data/medical_pdfs/
```

2. Run the ingestion script (from project root):

```bash
cd ..
python ingest_pdfs.py
```

This step:

* Chunks PDFs
* Creates embeddings
* Stores vectors in **ChromaDB**

---

### Start the Backend Server

```bash
uvicorn backend.app.main:app --reload --port 8001
```

Backend will be live at:

```
http://127.0.0.1:8001
```

---

## 🔹 Phase 3: Frontend Setup (The Face)

Open a **new terminal**.

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Frontend will be live at:

```
http://localhost:5173
```

---

## 🔍 Troubleshooting Common Issues

---

### 1️⃣ Out of Memory (OOM) Error

**Symptom:** Backend crashes during AI chat.

**Cause:** Model too large for available RAM.

✅ **Fix:** Switch to a smaller model.

Edit:

```python
backend/app/services/llm_service.py
```

```python
self.model = "gemma:2b"
```

---

### 2️⃣ CORS Error / Network Error

**Symptom:** Frontend cannot connect to backend.

✅ **Fix:** Verify CORS settings.

Check:

```python
backend/app/main.py
```

```python
allow_origins=["http://localhost:5173"]
```

---

### 3️⃣ Database Errors (SQLAlchemy)

**Symptom:**

* `Table not found`
* `Mapper has no property`

✅ **Fix:**

1. Stop backend
2. Delete database file:

```text
backend/test.db
```

3. Restart backend (DB auto-recreates)

---

## 📂 Directory Structure Overview

```text
CuraCore/
├── backend/                 # FastAPI Server
│   ├── app/api/             # REST Endpoints (Auth, Chat, Doctors)
│   ├── app/models/          # SQLAlchemy Models
│   ├── app/services/        # RAG, Whisper, LLM, Summarizer
│   ├── data/chromadb/       # Vector DB (DO NOT DELETE)
│   ├── data/medical_pdfs/   # Source Medical PDFs
│   └── requirements.txt
│
├── frontend/                # React + Vite App
│   ├── src/components/      # UI Components (ChatBox, VoiceRecorder)
│   ├── src/context/         # Auth Context
│   ├── src/pages/           # Main Screens
│   └── package.json
│
├── README.md
└── SETUP.md
```

---

## ✅ You Are Ready

At this point:

* ✔️ LLM runs locally
* ✔️ RAG is operational
* ✔️ Backend & frontend are connected
* ✔️ System is fully offline and privacy-first

---

<p align="center">
  🧠 CuraCore — Built for Private, Offline Healthcare AI
</p>

