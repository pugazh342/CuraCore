# File: backend/app/services/summarizer.py
import ollama

def generate_summary(chat_history: str):
    """
    Condenses a long chat into a medical summary for the doctor.
    """
    prompt = f"""
    You are a medical assistant. Summarize the following patient-AI conversation for a doctor.
    
    FORMAT:
    - **Symptoms:** [List main symptoms]
    - **Duration:** [How long they have had it]
    - **Potential Concerns:** [Key medical terms found]
    - **Recommended Specialist:** [e.g. Cardiologist, Dermatologist]

    CHAT HISTORY:
    {chat_history}
    """
    
    try:
        response = ollama.chat(
            model="llama3:8b-instruct-q4_K_M",
            messages=[{'role': 'user', 'content': prompt}]
        )
        return response['message']['content']
    except Exception as e:
        return "Summary generation failed."