# File: backend/app/services/rag_service.py
import os
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb

# CONFIG
PDF_STORAGE_PATH = "backend/data/medical_pdfs"
CHROMA_PATH = "backend/data/chromadb"

class RAGService:
    def __init__(self):
        # 1. Initialize Embedding Model
        self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # 2. Connect to ChromaDB
        self.chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
        self.collection = self.chroma_client.get_or_create_collection(name="medical_docs")

    def _get_embeddings(self, texts):
        """Helper to get embeddings list"""
        if isinstance(texts, str):
            texts = [texts]
        embeddings = self.embed_model.encode(texts)
        return embeddings.tolist()

    def ingest_file(self, file_path: str):
        """Reads a PDF, chunks it, and saves to Vector DB in batches"""
        print(f"📄 Processing: {file_path}")
        
        # A. Extract Text
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                if page.extract_text():
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"❌ Error reading PDF: {e}")
            return

        # B. Smart Chunking
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", "!", "?", " ", ""]
        )
        chunks = splitter.split_text(text)
        print(f"🧠 Found {len(chunks)} chunks. Starting batch ingestion...")
        
        # C. Embed & Save in Batches
        batch_size = 5000  # Safe limit for ChromaDB
        total_chunks = len(chunks)
        
        for i in range(0, total_chunks, batch_size):
            batch_end = min(i + batch_size, total_chunks)
            batch_chunks = chunks[i:batch_end]
            
            print(f"   ↳ Embedding batch {i} to {batch_end}...")
            embeddings = self._get_embeddings(batch_chunks)
            
            # Create unique IDs
            base_name = os.path.basename(file_path)
            ids = [f"{base_name}_{j}" for j in range(i, batch_end)]
            metadatas = [{"source": base_name} for _ in range(len(batch_chunks))]
            
            self.collection.add(
                ids=ids,
                documents=batch_chunks,
                embeddings=embeddings,
                metadatas=metadatas
            )
            
        print("✅ Ingestion Complete")

    def search(self, query: str, k=3):
        """Retrieves the top K most relevant text chunks"""
        query_embedding = self._get_embeddings(query)
        
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=k
        )
        
        if not results['documents'] or len(results['documents'][0]) == 0:
            return []
            
        return results['documents'][0]

# Singleton Instance
rag_service = RAGService()