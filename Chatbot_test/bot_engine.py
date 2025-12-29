import ollama
import json
from prompts import MTS_SYSTEM_PROMPT, CLARIFICATION_PROMPT
from config import MODEL_NAME

class TriageBot:
    def __init__(self):
        # In a real DB, these would be saved per user_id
        self.state = "SYMPTOM_COLLECTION"
        self.data = {
            "symptoms": None,
            "history": None,
            "severity": None,
            "details": None
        }

    def process_input(self, user_text):
        """Main handler for user input based on current state."""
        
        # 0. Safety Override (Keyword Search)
        if self.check_emergency_keywords(user_text):
            return self.emergency_response()

        # 1. State Machine Logic
        if self.state == "SYMPTOM_COLLECTION":
            self.data["symptoms"] = user_text
            self.state = "RISK_ASSESSMENT"
            return "I understand. To ensure safety, do you have any chronic conditions (Diabetes, BP, Heart issues) or allergies?"

        elif self.state == "RISK_ASSESSMENT":
            self.data["history"] = user_text
            self.state = "SEVERITY_CHECK"
            return "Noted. On a scale of 1-10, how severe is the pain or discomfort right now?"

        elif self.state == "SEVERITY_CHECK":
            self.data["severity"] = user_text
            self.state = "CLARIFICATION"
            # Dynamic generation of questions
            return self.generate_clarification_questions()

        elif self.state == "CLARIFICATION":
            self.data["details"] = user_text
            self.state = "ANALYSIS"
            return self.perform_triage_analysis()

        elif self.state == "ANALYSIS":
            return "I have already provided the analysis. Please restart for a new consultation."

    def generate_clarification_questions(self):
        """Uses LLM to ask relevant questions instead of generic ones."""
        response = ollama.chat(model=MODEL_NAME, messages=[
            {'role': 'user', 'content': CLARIFICATION_PROMPT.format(symptom=self.data['symptoms'])}
        ])
        return f"Just a few more details: {response['message']['content']}"

    def perform_triage_analysis(self):
        """Sends full packet to LLM for JSON Triage."""
        summary = f"""
        Patient Summary:
        - Chief Complaint: {self.data['symptoms']}
        - History: {self.data['history']}
        - Severity: {self.data['severity']}
        - Specifics: {self.data['details']}
        """
        
        print("Analyzing Data...") # Debug log
        
        try:
            response = ollama.chat(model=MODEL_NAME, messages=[
                {'role': 'system', 'content': MTS_SYSTEM_PROMPT},
                {'role': 'user', 'content': summary}
            ])
            
            # Clean JSON (sometimes LLMs add markdown)
            raw_json = response['message']['content'].replace("```json", "").replace("```", "").strip()
            result = json.loads(raw_json)
            
            return self.format_result(result)
            
        except Exception as e:
            return f"⚠️ Error processing triage: {str(e)}. Please see a doctor."

    def format_result(self, result):
        emojis = {"RED": "🚨", "ORANGE": "🟧", "YELLOW": "🟨", "GREEN": "✅", "BLUE": "ℹ️"}
        color = result.get('triage_color', 'BLUE')
        
        return (
            f"{emojis.get(color, '')} **TRIAGE LEVEL: {color}**\n\n"
            f"**Analysis:** {result.get('reasoning')}\n"
            f"**Recommended Specialist:** {result.get('specialist')}\n"
            f"**Advice:** {result.get('advice')}\n\n"
            f"*Disclaimer: This is AI-generated advice. Call emergency services if condition worsens.*"
        )

    def check_emergency_keywords(self, text):
        red_flags = ["chest pain", "heart attack", "unconscious", "stroke", "bleeding heavily"]
        return any(flag in text.lower() for flag in red_flags)

    def emergency_response(self):
        return "🚨 **CRITICAL WARNING** 🚨\nYour description suggests a medical emergency. \n\n**ACTION:** Please call an Ambulance immediately. Do not rely on this chat."