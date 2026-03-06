import google.generativeai as genai
import json
from typing import List, Dict

class SkillAnalysisService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=self.api_key)

    def analyze_skill_gap(self, resume_text: str, jd_text: str, role_template: dict = None) -> Dict:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
        Act as an Elite Technical Recruiter and Career Strategist. 
        Perform a high-fidelity semantic gap analysis between the candidate's resume and the target Job Description.
        
        Resume:
        {resume_text}
        
        Job Description:
        {jd_text}
        
        Instructions:
        1. Identify EVERY explicit and implicit skill required in the JD.
        2. Specifically categorize "Partial Matches" where the candidate has the base skill but lacks depth or specific tool proficiency mentioned in the JD.
        3. For "Missing Skills", rank them by criticality to the role (High/Medium/Low).
        4. "Skill Gap Ranking" must provide a specific reason related to role impact for each missing skill.
        5. Be granular - don't just say "Python", say "Asynchronous Programming in Python with FastAPI" if appropriate.

        Format the response as a JSON object:
        {{
            "strong_matches": ["<detailed skill 1>", ...],
            "partial_matches": ["<detailed skill 1>", ...],
            "missing_skills": ["<critical skill 1>", ...],
            "skill_gap_ranking": [
                {{"skill": "<specific skill name>", "importance": "high/medium/low", "reason": "<precise explanation of how this gap impacts performance in this specific role>"}}
            ]
        }}
        """
        
        try:
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text)
        except Exception as e:
            print(f"Error in skill analysis: {e}")
            return {
                "strong_matches": [],
                "partial_matches": [],
                "missing_skills": [],
                "skill_gap_ranking": []
            }
