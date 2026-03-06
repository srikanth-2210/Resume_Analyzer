import google.generativeai as genai
import json
import logging
from typing import Dict

logger = logging.getLogger(__name__)

class IntelligenceEngine:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def generate_full_analysis(self, resume_text: str, jd_text: str, role_name: str = "Target Role") -> Dict:
        """
        Performs analysis based ONLY on resume content - no generic templates.
        """
        import time

        prompt = f"""You are a senior hiring manager and technical architect. Analyze this resume against the job description.

Resume: {resume_text}

Job: {jd_text}

CRITICAL RULES:
- Only mention skills/projects actually in the resume
- All interview questions must reference specific resume projects
- No generic or template questions - be specific

Output ONLY valid JSON, no other text:

{{
  "summary": "1-2 sentence fit analysis",
  "skills": {{
    "strong_matches": ["Skill 1 with context", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "missing_skills": ["Gap 1", "Gap 2", "Gap 3"],
    "gap_ranking": [{{"skill": "name", "impact": "high/med", "priority": 1}}]
  }},
  "optimization": {{
    "bullets": [{{
      "original": "EXACT resume text",
      "suggested": "Improved version with metrics",
      "jd_alignment": "JD requirement addressed",
      "reason": "Why this matters"
    }}],
    "structural_suggestions": [{{"suggestion": "Change", "addresses_jd": "Requirement", "benefit": "Impact"}}],
    "recruiter_hooks": ["Hook 1", "Hook 2", "Hook 3"],
    "priority_actions": [{{"action": "Action", "addresses": "Requirement", "impact": "Outcome"}}]
  }},
  "interview": {{
    "technical_questions": [{{
      "question": "Question on specific resume project/tool",
      "resume_reference": "Project name from resume",
      "topic": "Skill area",
      "expected_answer_points": ["Key point 1", "Key point 2", "Key point 3"]
    }}],
    "behavioral_questions": [{{
      "question": "Scenario from resume experience",
      "intent": "What this tests",
      "star_tip": "STAR framework guidance",
      "resume_reference": "Resume section reference"
    }}],
    "role_specific_challenges": [{{
      "scenario": "Based on resume tech",
      "question": "Question",
      "constraints": "Operational constraints"
    }}],
    "preparation_strategy": "30-60-90 day plan"
  }}
}}
        """

        models_to_try = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']

        def clean_json_response(text: str) -> str:
            text = text.strip()
            if text.startswith("```json"):
                text = text[len("```json"):].strip()
            if text.endswith("```"):
                text = text[:-3].strip()
            return text

        for model_name in models_to_try:
            try:
                logger.info(f"Attempting analysis with model {model_name}...")
                current_model = genai.GenerativeModel(model_name)
                response = current_model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                
                if not response or not response.text:
                    raise ValueError("Empty response")

                cleaned_text = clean_json_response(response.text)
                result = json.loads(cleaned_text)
                logger.info(f"Success with model {model_name}")
                return result

            except Exception as e:
                error_msg = str(e).lower()
                logger.warning(f"Model {model_name} failed: {str(e)}")
                
                if "429" in error_msg or "quota" in error_msg:
                    time.sleep(1)
                    continue
                
                continue

        logger.error("All AI models failed. Using fallback analysis.")
        
        # Fallback: Extract basic info from resume and JD
        return {
            "summary": "Basic analysis - AI service temporarily unavailable. Review resume against JD requirements manually.",
            "skills": {
                "strong_matches": [
                    "Skills mentioned in resume relevant to JD",
                    "Technical experience in required domains",
                    "Relevant project experience"
                ],
                "missing_skills": [
                    "Specific technologies from JD not clearly highlighted",
                    "Domain expertise gaps vs JD requirements",
                    "Tool/framework experience not mentioned"
                ],
                "gap_ranking": [
                    {"skill": "Review JD for key requirements", "impact": "high", "priority": 1},
                    {"skill": "Highlight relevant resume sections", "impact": "high", "priority": 2}
                ]
            },
            "optimization": {
                "bullets": [
                    {
                        "original": "Review resume bullets",
                        "suggested": "Add metrics and quantifiable results wherever possible",
                        "jd_alignment": "Compare against JD key requirements",
                        "reason": "Stronger impact on reviewers"
                    }
                ],
                "structural_suggestions": [
                    {
                        "suggestion": "Ensure top 3 skills match JD requirements",
                        "addresses_jd": "Primary role focus areas",
                        "benefit": "Better keyword matching"
                    }
                ],
                "recruiter_hooks": [
                    "Highlight years of experience in key technologies",
                    "Lead with most relevant recent projects",
                    "Showcase significant impact/results in bullets"
                ],
                "priority_actions": [
                    {
                        "action": "Add metrics to all experience bullets",
                        "addresses": "Impact clarity",
                        "impact": "20%+ improvement in resume strength"
                    }
                ]
            },
            "interview": {
                "technical_questions": [
                    {
                        "question": "Tell us about your most relevant project from your resume",
                        "resume_reference": "Major project listed",
                        "topic": "Technical depth",
                        "expected_answer_points": ["Specific problem", "Solution approach", "Results and learnings"]
                    }
                ],
                "behavioral_questions": [
                    {
                        "question": "Describe a challenging technical problem you solved",
                        "intent": "Problem-solving approach and impact",
                        "star_tip": "Situation, Task, Action, Result framework",
                        "resume_reference": "Relevant experience section"
                    }
                ],
                "role_specific_challenges": [
                    {
                        "scenario": "Given the role requirements, design a solution",
                        "question": "How would you approach this considering your experience?",
                        "constraints": "Must align with role requirements and team dynamics"
                    }
                ],
                "preparation_strategy": "Days 1-30: Master team processes and codebase. Days 30-60: Own first feature end-to-end. Days 60-90: Lead optimization or new initiative."
            }
        }
