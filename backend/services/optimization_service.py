import google.generativeai as genai
import json
from typing import List, Dict

class OptimizationService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=self.api_key)

    def optimize_resume(self, resume_text: str, jd_text: str) -> Dict:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""Analyze resume against job description. Focus on actual content only.

Resume: {resume_text}

Job: {jd_text}

Output ONLY valid JSON, no other text:

{{
  "jd_key_requirements": ["req1", "req2", "req3", "req4", "req5"],
  "optimized_bullets": [{{
    "original": "EXACT resume text",
    "suggested": "Improved with JD keywords + metrics",  
    "addresses_jd": "Which requirement",
    "reason": "Why matters"
  }}],
  "technology_alignment": {{
    "jd_required_tech": ["tech1", "tech2"],
    "resume_included": ["tech from resume"],
    "gaps": ["Missing tech and suggestion"]
  }},
  "structural_suggestions": [{{
    "suggestion": "Change to make",
    "addresses_jd": "Which requirement",
    "area": "Section focus",
    "benefit": "Impact"
  }}],
  "impact_summary": "How changes improve fit for THIS role"
}}
        """
        
        try:
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            return json.loads(response.text)
        except Exception as e:
            print(f"Error in optimization analysis: {e}")
            # Return useful fallback data
            return {
                "jd_key_requirements": [
                    "Technical skills from JD",
                    "Experience level requirements",
                    "Domain expertise needed",
                    "Leadership or specific methodologies",
                    "Tool/framework proficiency"
                ],
                "optimized_bullets": [
                    {
                        "original": "Review your strongest resume bullets",
                        "suggested": "Add specific metrics: 'Architected X, improving Y by Z%' or 'Led team of N, delivered results in M time'",
                        "addresses_jd": "Impact and scale demonstration",
                        "reason": "Hiring managers focus on quantified results and scope of impact"
                    }
                ],
                "technology_alignment": {
                    "jd_required_tech": ["Review JD for required technologies"],
                    "resume_included": ["List your technical skills"],
                    "gaps": ["Identify any technologies in JD not mentioned in resume - add context for similar tools you've used"]
                },
                "structural_suggestions": [
                    {
                        "suggestion": "Move most relevant experience to top - reorganize sections by JD fit not chronology",
                        "area": "Resume Structure",
                        "addresses_jd": "Immediate relevance to role",
                        "benefit": "Recruiter can verify fit in first 6 seconds"
                    },
                    {
                        "suggestion": "Add a brief summary highlighting 2-3 key JD matching points",
                        "area": "Professional Summary",
                        "addresses_jd": "Clear positioning",
                        "benefit": "Sets context for reviewers"
                    }
                ],
                "impact_summary": "Focus on making it immediately obvious you meet the core JD requirements. Use the exact language from the JD when possible. Add metrics to every bullet point."
            }
