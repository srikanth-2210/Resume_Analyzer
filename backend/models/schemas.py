from pydantic import BaseModel
from typing import List, Dict, Optional

class RoleInfo(BaseModel):
    name: str
    jd: str
    required_skills: List[str]
    optional_skills: List[str]

class SemanticMatchResult(BaseModel):
    overall_match: float
    skill_match: float
    experience_match: float
    tool_match: float

class SkillGap(BaseModel):
    skill: str
    importance: str
    reason: str

class OptimizationResult(BaseModel):
    original: str
    suggested: str
    reason: str

class ReadinessResult(BaseModel):
    readiness_score: float
    found_tools: List[str]
    recommendations: List[str]

class FullAnalysisResult(BaseModel):
    match_score: float
    ats_score: int
    readability_score: int
    summary: str
    strengths: List[str]
    missing_skills: List[str]
    skill_gap_ranking: List[SkillGap]
    readiness: ReadinessResult
    semantic_report: SemanticMatchResult
    optimized_bullets: List[OptimizationResult]
    career_fit_prediction: List[Dict[str, float]]
