
### 🩺 CuraCore: The Offline AI Health Grid

**CuraCore** is a secure, privacy-first hospital management system powered entirely by **local Artificial Intelligence**.  
Unlike cloud-based health bots, CuraCore processes **all patient data, voice inputs, and medical reasoning offline** using **Retrieval-Augmented Generation (RAG)** and **Ollama**.

It bridges the gap between **patients and doctors** by providing **preliminary AI-driven analysis**, while also automating administrative tasks like **symptom summarization** — all without sending data to the cloud.

---

## 🌟 Key Features

### 🧠 For Patients
- **Offline AI Consultation**  
  Chat with an AI assistant that responds using verified **medical textbooks and PDFs** via RAG — not hallucinations.

- **Voice-to-Text Symptom Input**  
  Describe symptoms naturally using your voice, powered by a **local OpenAI Whisper** model.

- **Doctor Search & Booking**  
  Find specialists, view doctor profiles, and book appointments instantly.

- **Privacy by Design**  
  No cloud calls. No data leakage. All health data stays on your machine.

---

### 👨‍⚕️ For Doctors
- **Smart Doctor Dashboard**  
  View patient queues and appointment details in real time.

- **AI-Generated Clinical Summaries**  
  Doctors receive concise, clinically relevant summaries instead of reading long chat histories.

- **Queue Management**  
  Mark appointments as completed with a single click.

---

## ⚙️ System Capabilities

- **RAG Engine**  
  Ingests medical PDFs, chunks content, and stores embeddings in **ChromaDB** for accurate semantic retrieval.

- **Secure Authentication**  
  JWT-based authentication with **BCrypt password hashing**.

- **Dual-Role Access System**  
  Separate interfaces and permissions for **Patients** and **Doctors**.

---

## 🛠️ Tech Stack

### 🎨 Frontend (The Face)
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + Framer Motion
- **Icons:** Lucide React
- **State & Auth:** React Context API
- **API Client:** Axios

---

### 🧠 Backend (The Brain)
- **Framework:** FastAPI (Python)
- **Database:** SQLite (Relational Data)
- **Vector Database:** ChromaDB
- **ORM:** SQLAlchemy
- **Auth:** JWT + BCrypt

---

### 🤖 AI & ML (The Intelligence)
- **LLM Runtime:** Ollama  
  (Models: `gemma:2b`, `llama3`)
- **Speech Recognition:** OpenAI Whisper (Local)
- **Embeddings:** Sentence-Transformers (`all-MiniLM-L6-v2`)
- **AI Orchestration:** LangChain

---

## 🚀 Installation & Setup

### 1️⃣ Prerequisites
Make sure you have the following installed:

- **Python 3.10+**
- **Node.js 18+**
- **Ollama**

Pull a lightweight LLM model (recommended for laptops):

```bash
ollama pull gemma:2b
````

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CuraCore.git
cd CuraCore
```

---

## 🧠 Backend Setup (The Brain)

```bash
cd backend
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**Mac / Linux**

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### ⚠️ Important: Feed the Brain (RAG Setup)

Before running the backend, you **must ingest medical documents**.

1. Place medical PDFs inside:

```text
backend/data/medical_pdfs/
```

2. Run the ingestion script:

```bash
python ingest_pdfs.py
```

This will:

* Chunk PDFs
* Generate embeddings
* Store vectors in **ChromaDB**

---

## 🎨 Frontend Setup (The Face)

Open a **new terminal**:

```bash
cd frontend
npm install
```

---

## 🏃‍♂️ How to Run the Application

### Step 1: Start Backend

```bash
uvicorn app.main:app --reload --port 8001
```

### Step 2: Start Frontend

```bash
npm run dev
```

### Step 3: Access the App

Open your browser:

```
http://localhost:5173
```

---

## 📖 Usage Guide

### 🧬 Patient Workflow

1. Sign up as a **Patient**
2. Navigate to **AI Consultation**
3. Type symptoms or use the **microphone**
4. AI analyzes symptoms using RAG
5. Search for doctors and **book an appointment**

---

### 🩺 Doctor Workflow

1. Sign up as a **Doctor**
2. Access the **Doctor Dashboard**
3. View patient appointment requests
4. Read AI-generated **clinical summaries**
5. Treat the patient and click **Mark Done**

---

## 📂 Project Structure

```text
CuraCore/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints (Auth, Chat, Doctors)
│   │   ├── core/         # Config & database setup
│   │   ├── models/       # SQLAlchemy models
│   │   ├── services/     # RAG, Whisper, LLM logic
│   │   └── main.py       # FastAPI entry point
│   ├── data/
│   │   ├── medical_pdfs/ # Medical source documents
│   │   └── chromadb/     # Vector storage
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Screens (Login, Dashboard)
│   │   └── services/     # API services
│   └── package.json
│
└── README.md
```

---

## 🛡️ License & Disclaimer

### ⚠️ Medical Disclaimer

This project is **for educational and research purposes only**.
AI-generated advice **must not** be considered a replacement for professional medical diagnosis.

### 📜 License

Distributed under the **MIT License**.
See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <strong>Pugazhmani .K</strong>
</p>
```

---
