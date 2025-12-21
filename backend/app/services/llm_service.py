# File: backend/app/services/llm_service.py
import ollama

class LLMService:
    def __init__(self):
        self.model = "gemma:2b" # Or "gemma:2b" if you have low RAM

    def generate_response(self, user_query: str, context_chunks: list):
        """
        Constructs the prompt and calls Ollama
        """
        # 1. Format Context
        context_text = "\n\n".join(context_chunks)
        
        # 2. Build System Prompt
        system_prompt = f"""
        You are CuraCore, an expert AI Medical Assistant.
        Use the following MEDICAL CONTEXT to answer the user's question.
        
        CONTEXT:
        {context_text}
        
        RULES:
        1. Only use the provided context. If the answer isn't there, say "I don't have enough information."
        2. Do NOT hallucinate treatments.
        3. Be concise and professional.
        """

        # 3. Call Ollama
        try:
            response = ollama.chat(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_query},
                ]
            )
            return response['message']['content']
        except Exception as e:
            return f"⚠️ AI Error: {str(e)}. Is Ollama running?"

llm_service = LLMService()