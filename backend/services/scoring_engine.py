import re
from typing import List, Dict

class ScoringEngine:
    def __init__(self):
        # Tools to scan for production readiness (Expanded for better coverage)
        self.production_tools = [
            "Docker", "Kubernetes", "AWS", "GCP", "Azure", 
            "CI/CD", "FastAPI", "Flask", "Git", "Jenkins", 
            "Terraform", "Ansible", "Nginx", "Redis", "Kafka",
            "SQL", "NoSQL", "PostgreSQL", "MongoDB", "PyTest",
            "Jira", "Linux", "REST", "GraphQL", "Agile", "Scrum"
        ]

    def scan_production_readiness(self, resume_text: str) -> Dict:
        found_tools = []
        # Use boundary-less matching for some tools or handle variations
        for tool in self.production_tools:
            # More flexible search for tools that might be part of other words or have symbols
            if re.search(rf"{re.escape(tool)}", resume_text, re.IGNORECASE):
                found_tools.append(tool)
        
        # Calculate score based on a reasonable threshold (e.g., 8 tools = 100% for junior/mid)
        # Or just use the ratio but ensure it's not too punishing
        target_count = 10
        score = min(100, (len(found_tools) / target_count) * 100) if target_count > 0 else 0
        
        recommendations = []
        if not any(t in found_tools for t in ["Docker", "Kubernetes"]):
            recommendations.append("Add containerization experience (Docker/K8s).")
        if "CI/CD" not in found_tools:
            recommendations.append("Highlight CI/CD pipeline skills.")
        if not any(cloud in found_tools for cloud in ["AWS", "GCP", "Azure"]):
            recommendations.append("Include cloud platform exposure.")
        if len(found_tools) < 5:
            recommendations.append("List more industry-standard tools (Git, SQL, etc.).")

        return {
            "readiness_score": round(score, 2),
            "found_tools": list(set(found_tools)),
            "recommendations": recommendations[:3] 
        }

    def compute_final_score(self, semantic_match: dict, skill_match_count: int, total_jd_skills: int, role_weights: dict) -> float:
        # Weighted matching
        # 1. Semantic Score (Overall)
        # 2. Skill Match Ratio
        # 3. Scale-based on Importance
        
        semantic_score = semantic_match.get("overall_match", 0)
        skill_ratio = (skill_match_count / total_jd_skills) * 100 if total_jd_skills > 0 else 0
        
        # Combine using role weights
        w_skills = role_weights.get("skills", 0.33)
        w_exp = role_weights.get("experience", 0.33)
        w_tools = role_weights.get("tools", 0.34)
        
        # Skill-match roughly maps to skills weight
        # Experience-match roughly maps to semantic/experience weight
        # Tool-match roughly maps to tools weight
        
        final_score = (skill_ratio * w_skills) + (semantic_score * w_exp) + (semantic_score * 0.9 * w_tools)
        return round(final_score, 2)

    def compute_ats_metrics(self, resume_text: str) -> Dict:
        # Readability & ATS Intelligence
        bullets = re.findall(r"•|\*|-|–", resume_text)
        avg_bullet_len = len(resume_text) / len(bullets) if bullets else 0
        
        passive_voice_count = len(re.findall(r"\b(was|were|been|being)\b", resume_text, re.IGNORECASE))
        quantification_count = len(re.findall(r"\d+%", resume_text)) + len(re.findall(r"\$\d+", resume_text))
        
        ats_score = 100
        if passive_voice_count > 5: ats_score -= 10
        if quantification_count < 2: ats_score -= 15
        if avg_bullet_len > 200: ats_score -= 10
        
        return {
            "ats_score": max(0, ats_score),
            "readability_score": 85 if avg_bullet_len < 150 else 60,
            "passive_voice_ratio": round(passive_voice_count / (len(resume_text.split()) / 100), 2),
            "quantification_percentage": round(quantification_count * 5, 2) # Arbitrary scaling
        }
