import re
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class ScoringEngine:
    def __init__(self):
        # Production-ready tools and technologies
        self.production_tools = [
            "docker", "kubernetes", "k8s", "aws", "gcp", "azure", 
            "ci/cd", "fastapi", "flask", "django", "git", "jenkins", "github actions",
            "terraform", "ansible", "nginx", "redis", "kafka", "postgresql",
            "sql", "nosql", "mongodb", "pytest", "jira", "linux", "rest", "graphql", 
            "agile", "scrum", "docker compose", "prometheus", "grafana", "elk",
            "datadog", "newrelic", "splunk", "spring boot", "nodejs", "react"
        ]

        # ATS-sensitive keywords to look for
        self.ats_keywords = [
            "managed", "led", "increased", "improved", "developed", "designed",
            "implemented", "optimized", "automated", "collaborated", "achieved",
            "reduced", "delivered", "created", "built", "scaled", "mentored"
        ]

    def scan_production_readiness(self, resume_text: str) -> Dict:
        """Scan resume for production-level tools and technologies."""
        found_tools = []
        text_lower = resume_text.lower()
        
        # Find tools with better matching
        for tool in self.production_tools:
            pattern = r'\b' + re.escape(tool) + r'\b'
            if re.search(pattern, text_lower):
                found_tools.append(tool.title())
        
        # Calculate readiness score
        target_count = 12  # Expect ~12 tools for production-ready resume
        score = min(100, (len(found_tools) / target_count) * 100) if target_count > 0 else 0
        
        # Generate recommendations
        recommendations = self._generate_readiness_recommendations(found_tools, text_lower)

        return {
            "readiness_score": round(score, 2),
            "found_tools": sorted(list(set(found_tools))),
            "tool_count": len(set(found_tools)),
            "recommendations": recommendations,
            "details": {
                "containerization": any(t.lower() in text_lower for t in ["docker", "kubernetes"]),
                "cloud_experience": any(t.lower() in text_lower for t in ["aws", "gcp", "azure"]),
                "ci_cd_experience": any(t.lower() in text_lower for t in ["ci/cd", "jenkins", "github actions", "gitlab"]),
                "database_experience": bool(re.search(r'\b(sql|postgresql|mongodb|dynamodb)\b', text_lower, re.I))
            }
        }

    def _generate_readiness_recommendations(self, found_tools: List[str], text_lower: str) -> List[str]:
        """Generate specific recommendations based on found tools."""
        recommendations = []
        
        if not any(t.lower() in text_lower for t in ["docker", "kubernetes"]):
            recommendations.append("Highlight containerization experience (Docker/Kubernetes)")
        
        if not any(t.lower() in text_lower for t in ["jenkins", "github actions", "gitlab", "ci/cd"]):
            recommendations.append("Add CI/CD pipeline implementation experience")
        
        if not any(t.lower() in text_lower for t in ["aws", "gcp", "azure"]):
            recommendations.append("Include cloud platform certifications or projects")
        
        if not any(t.lower() in text_lower for t in ["prometheus", "grafana", "datadog", "elk"]):
            recommendations.append("Emphasize monitoring and observability skills")
        
        if len(found_tools) < 8:
            recommendations.append("Include more industry-standard tools (Git, SQL, REST APIs, etc.)")
        
        return recommendations[:3]

    def compute_overall_score(self, skill_match: float, experience_match: float, 
                             formatting_score: float, ats_score: float, 
                             production_readiness: float = 70) -> float:
        """
        Compute Overall Resume Score using weighted formula:
        0.35 * Skill_Match + 0.25 * Experience_Match + 0.2 * ATS_Score + 
        0.15 * Formatting_Score + 0.05 * Production_Readiness
        """
        # Ensure all scores are between 0-100
        skill_match = max(0, min(100, skill_match))
        experience_match = max(0, min(100, experience_match))
        formatting_score = max(0, min(100, formatting_score))
        ats_score = max(0, min(100, ats_score))
        production_readiness = max(0, min(100, production_readiness))
        
        final_score = (
            (0.35 * skill_match) + 
            (0.25 * experience_match) + 
            (0.20 * ats_score) + 
            (0.15 * formatting_score) + 
            (0.05 * production_readiness)
        )
        
        return round(final_score, 2)

    def compute_ats_metrics(self, resume_text: str) -> Dict:
        """
        Compute ATS compatibility and readability metrics.
        ATS systems scan for:
        - Proper formatting
        - Keyword presence
        - Bullet points with impact words
        - Quantifiable metrics
        - Single column layout (can't tell from text, but check for formatting)
        """
        if not resume_text or len(resume_text.strip()) == 0:
            return {
                "ats_score": 0,
                "readability_score": 0,
                "formatting_issues": ["Empty resume text"]
            }
        
        # Count various metrics
        bullet_markers = re.findall(r"[•\*\-–]", resume_text)
        sections = len(re.findall(r"\n\s*(?:EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY|OBJECTIVE)\b", resume_text, re.I))
        
        # Check for impact words (action verbs)
        action_words_found = 0
        for word in self.ats_keywords:
            if re.search(r'\b' + word + r'\b', resume_text, re.I):
                action_words_found += 1
        
        # Check for quantifiable metrics
        numbers = len(re.findall(r'\d+%', resume_text)) + len(re.findall(r'\$\d+', resume_text)) + len(re.findall(r'\d+x', resume_text))
        
        # Passive voice (to avoid)
        passive_voice_count = len(re.findall(r'\b(was|were|been|being|is|are)\b', resume_text, re.I))
        
        # Calculate ATS Score
        ats_score = 100
        
        # Section structure (25 points max)
        if sections < 4:
            ats_score -= 10
        if sections < 3:
            ats_score -= 5
        
        # Action words (25 points)
        if action_words_found < 5:
            ats_score -= 15
        elif action_words_found < 10:
            ats_score -= 5
        
        # Quantifiable metrics (20 points)
        if numbers < 2:
            ats_score -= 15
        elif numbers < 5:
            ats_score -= 5
        
        # Bullet points structure (15 points)
        if len(bullet_markers) < 5:
            ats_score -= 10
        
        # Passive voice penalty (15 points)
        if passive_voice_count > 10:
            ats_score -= 10
        elif passive_voice_count > 5:
            ats_score -= 5
        
        # Calculate Readability Score
        readability_score = 100
        
        # Check word count per bullet (ideally 10-18 words)
        bullets = re.split(r'[•\*\-–]', resume_text)[1:] if bullet_markers else []
        if bullets:
            avg_bullet_len = sum(len(b.split()) for b in bullets) / len(bullets)
            if avg_bullet_len > 25:
                readability_score -= 15
            elif avg_bullet_len < 5:
                readability_score -= 10
        
        # Line length (too long = harder to read)
        lines = resume_text.split('\n')
        long_lines = [l for l in lines if len(l) > 120]
        if len(long_lines) > len(lines) * 0.3:  # >30% of lines too long
            readability_score -= 10
        
        # Check for all caps sections (good for readability)
        all_caps_sections = len(re.findall(r'[A-Z\s]{3,}(?:\n|$)', resume_text))
        if all_caps_sections < 3:
            readability_score -= 5
        
        # Ensure scores are in valid range
        ats_score = max(0, min(100, ats_score))
        readability_score = max(0, min(100, readability_score))
        
        # Identify specific issues
        issues = []
        if sections < 4:
            issues.append("Add more standard resume sections (Experience, Education, Skills, etc.)")
        if action_words_found < 5:
            issues.append("Use more action verbs to describe accomplishments")
        if numbers < 2:
            issues.append("Include quantifiable metrics and achievements")
        if passive_voice_count > 5:
            issues.append("Reduce passive voice - use active voice instead")
        if len(bullet_markers) < 5:
            issues.append("Use bullet points for better readability")

        return {
            "ats_score": ats_score,
            "readability_score": readability_score,
            "overall_formatting": round((ats_score + readability_score) / 2, 2),
            "metrics": {
                "sections_found": sections,
                "action_words": action_words_found,
                "quantifiable_metrics": numbers,
                "bullet_points": len(bullet_markers),
                "passive_voice_instances": passive_voice_count,
                "avg_bullet_length": round(sum(len(b.split()) for b in bullets) / len(bullets), 1) if bullets else 0
            },
            "formatting_issues": issues[:3]
        }
    
    def compute_skill_match_score(self, matched_skills: int, total_required_skills: int) -> float:
        """Compute skill match percentage."""
        if total_required_skills == 0:
            return 0.0
        
        return round((matched_skills / total_required_skills) * 100, 2)
    
    def compute_experience_match_score(self, resume_text: str, jd_text: str) -> float:
        """
        Estimate experience match based on:
        - Years of experience mentioned
        - Relevant job titles
        - Industry keywords
        """
        # Extract years of experience
        years_pattern = r'(\d+)\+?\s*years?'
        resume_years = re.findall(years_pattern, resume_text, re.I)
        jd_years = re.findall(years_pattern, jd_text, re.I)
        
        if jd_years and resume_years:
            try:
                required_years = int(jd_years[0])
                candidate_years = int(resume_years[0])
                
                if candidate_years >= required_years:
                    base_score = 90
                elif candidate_years >= required_years * 0.7:
                    base_score = 75
                else:
                    base_score = 50
            except:
                base_score = 70
        else:
            base_score = 70
        
        # Check for relevant job titles
        relevant_titles = [
            "engineer", "developer", "architect", "manager", "lead",
            "senior", "principal", "staff", "director"
        ]
        
        title_matches = sum(1 for title in relevant_titles if title.lower() in resume_text.lower())
        if title_matches < 2:
            base_score -= 10
        
        return round(max(0, min(100, base_score)), 2)
