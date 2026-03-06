import google.generativeai as genai
import json
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class InterviewPrepService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=self.api_key)

    def generate_interview_intelligence(self, resume_text: str, jd_text: str) -> Dict:
        """
        Generates role-specific interview questions and preparation strategies.
        """
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
        Act as a Principal Technical Interviewer and Engineering Manager at a Tier-1 Tech Company.
        Based on the provided Resume and Job Description, generate a rigorous, high-fidelity interview preparation guide.

        Resume:
        {resume_text}

        Job Description:
        {jd_text}

        Instructions:
        1. Behavioral Questions: Focus on the "Behavioral Sink" - identify areas where the candidate's resume shows potential culture-fit or leadership gaps.
        2. Technical Questions: Focus on "Deep Domain Insight" - generate questions that test the candidate's understanding of the *trade-offs* associated with their technical skills (e.g., "Why use X over Y in scenario Z?").
        3. Role Specific Challenges: Provide "Simulated Production Scenarios" that require applying multiple skills from the JD to solve a complex system/business problem.
        4. Preparation Strategy: Provide a 3nd-degree strategy - don't say "study X", say "implement a small-scale system that demonstrates expertise in X while accounting for Y".

        Format the response as a JSON object:
        {{
            "behavioral_questions": [
                {{"question": "...", "intent": "The psychological or leadership signal this question is looking for", "star_tip": "Specific evidence from the candidate's projects to leverage in the response"}}
            ],
            "technical_questions": [
                {{"question": "Critical architecture or tool-related question", "topic": "Skill area name", "expected_answer_points": ["Key technical detail 1", "Nuance or trade-off 2", "Optimization or edge case 3"]}}
            ],
            "role_specific_challenges": [
                {{"scenario": "A complex, multi-layered problem involving role-specific stack/bottlenecks", "question": "Critical decision-making question within that scenario"}}
            ],
            "preparation_strategy": "A highly specific, non-generic preparation roadmap focusing on the candidate's specific gaps relative to the role's seniority."
        }}
        """
        
        try:
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Error in Interview Intelligence generation: {e}")
            return {
                "behavioral_questions": [],
                "technical_questions": [],
                "role_specific_challenges": [],
                "preparation_strategy": "Unable to generate strategy at this time."
            }
