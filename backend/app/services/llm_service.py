import requests
import json

class LLMService:
    def __init__(self):
        # ⚠️ IMPORTANT: You must pull this model first: 'ollama pull llama3' or the specific med42 tag if available.
        # If 'med42' is not in the library, rename your best model to this string or change this line to "llama3".
        self.model = "llama3-med42-8b" 
        self.api_url = "http://localhost:11434/api/generate"

    def generate_response(self, query: str, context: str, history: list):
        """
        Generates a medical response following a strict 8-step Triage Protocol.
        """
        
        # 1. Format Conversation History for the Prompt
        # We need the AI to see what has already been asked to determine the current step.
        formatted_history = "\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in history])

        # 2. The "State-Aware" Medical System Prompt
        system_prompt = f"""
        You are CuraCore, an expert AI Medical Triage Assistant. 
        Your goal is to safely assess the patient and guide them to the right specialist.
        
        You must strictly follow this **8-STEP CONSULTATION FLOW**. Do not skip steps. 
        Look at the 'Conversation History' below to decide which step you are currently in.

        --- THE PROTOCOL ---
        1. **Symptom Collection**: Identify the main complaint. (If new conversation, start here).
        2. **Risk Factor Collection**: Ask about age, medical history, allergies, smoking, etc.
        3. **Clarification Questions**: Ask OPQRST (Onset, Provocation, Quality, Radiation, Severity, Time).
        4. **Risk Analysis (Transparent)**: 
           - You MUST explicitly output a block starting with "🔍 **Risk Analysis:**"
           - Explain your reasoning based on the symptoms + context provided.
        5. **Urgency Detection**: Classify as:
           - 🔴 **EMERGENCY** (Call Ambulance)
           - 🟡 **URGENT** (See Doctor within 24h)
           - 🟢 **ROUTINE** (Regular checkup)
        6. **Specialist Recommendation**: Suggest the specific type of doctor (e.g., Cardiologist, Dermatologist).
        7. **First Aid Advice**: Provide immediate, temporary relief steps.
        8. **Disclaimer**: ALWAYS end with: *"I am an AI, not a doctor. This is a preliminary assessment."*

        --- CONTEXT FROM MEDICAL TEXTBOOKS (RAG) ---
        {context}

        --- CONVERSATION HISTORY ---
        {formatted_history}

        --- INSTRUCTIONS ---
        - Based on the history, determine the NEXT logical step.
        - Do not try to do all steps in one message. Engage in a dialogue.
        - If you are at Step 4 (Analysis), be verbose and transparent.
        - Keep responses professional, empathetic, and clear.
        - Use Markdown for formatting (bolding key terms).
        """

        # 3. Construct the Payload
        # We wrap the user's latest query with the massive system prompt
        final_prompt = f"{system_prompt}\n\nUSER: {query}\nCURACORE:"

        payload = {
            "model": self.model,
            "prompt": final_prompt,
            "stream": False,
            "options": {
                "temperature": 0.3, # Keep it factual and less creative
                "num_ctx": 4096     # Larger context window for history + medical PDFs
            }
        }

        # 4. Call Ollama
        try:
            response = requests.post(self.api_url, json=payload)
            response.raise_for_status()
            return response.json().get("response", "⚠️ Error: No response from AI brain.")
        except Exception as e:
            print(f"❌ LLM Error: {e}")
            return "⚠️ I am having trouble connecting to my medical database. Is Ollama running?"
        
llm_service = LLMService()