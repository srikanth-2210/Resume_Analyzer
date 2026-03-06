
import re
from typing import Dict, List, Set
from collections import Counter

class NLPHeuristics:
    """
    Local NLP heuristics for resume analysis without external AI dependencies.
    Provides keyword density, impact scoring, and selection probability.
    """
    
    ACTION_VERBS = {
        'architected', 'engineered', 'spearheaded', 'managed', 'developed', 'built',
        'integrated', 'optimized', 'reduced', 'increased', 'scaled', 'led', 'designed',
        'implemented', 'automated', 'delivered', 'improved', 'standardized', 'mentored'
    }

    def __init__(self):
        pass

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\w+', text.lower())

    def analyze_keywords(self, resume_text: str, jd_text: str) -> Dict:
        """Analyzes keyword alignment between resume and JD."""
        resume_words = set(self._tokenize(resume_text))
        jd_words = set(self._tokenize(jd_text))
        
        # Filter for meaningful technical keywords (heuristically: >3 chars, not in common stop words)
        # In a real app, this would use a tech dictionary
        stop_words = {'with', 'that', 'this', 'from', 'under', 'using', 'about', 'their'}
        target_keywords = {w for w in jd_words if len(w) > 3 and w not in stop_words}
        
        found = target_keywords.intersection(resume_words)
        missing = target_keywords.difference(resume_words)
        
        density = (len(found) / len(target_keywords)) * 100 if target_keywords else 100
        
        return {
            "keyword_density": round(density, 1),
            "found_keywords": sorted(list(found))[:15],
            "missing_keywords": sorted(list(missing))[:15]
        }

    def calculate_impact_score(self, resume_text: str) -> Dict:
        """Calculates an 'Impact Score' based on action verbs and metrics."""
        lines = resume_text.split('\n')
        total_bullets = 0
        action_verb_count = 0
        metric_count = 0
        
        # Regex for numbers, percentages, currency
        metric_pattern = r'\d+%|\$\d+|\d+\s*x|million|billion|reduced|increased'
        
        for line in lines:
            if len(line.strip()) < 10:
                continue
            total_bullets += 1
            words = self._tokenize(line)
            
            # Check for action verbs at start or near start
            for word in words[:3]:
                if word in self.ACTION_VERBS:
                    action_verb_count += 1
                    break
            
            if re.search(metric_pattern, line, re.IGNORECASE):
                metric_count += 1

        impact_score = 0
        if total_bullets > 0:
            verb_ratio = action_verb_count / total_bullets
            metric_ratio = metric_count / total_bullets
            impact_score = (verb_ratio * 40) + (metric_ratio * 60)
            
        return {
            "impact_score": round(min(impact_score, 100), 1),
            "verb_count": action_verb_count,
            "metric_count": metric_count,
            "total_analyzed": total_bullets
        }

    def get_selection_probability(self, resume_text: str, jd_text: str) -> Dict:
        """Heuristic probability of passing initial human/ATS screening."""
        keywords = self.analyze_keywords(resume_text, jd_text)
        impact = self.calculate_impact_score(resume_text)
        
        # Weighted probability
        # 50% keyword match (ATS), 50% impact/action (Recruiter)
        prob = (keywords['keyword_density'] * 0.5) + (impact['impact_score'] * 0.5)
        
        tier = "Low"
        if prob > 80: tier = "Elite"
        elif prob > 60: tier = "High"
        elif prob > 40: tier = "Medium"
        
        return {
            "probability_score": round(prob, 1),
            "tier": tier,
            "factors": {
                "keyword_alignment": keywords['keyword_density'],
                "impact_density": impact['impact_score']
            }
        }
