import logging
from typing import List
from fastapi import APIRouter, Depends, UploadFile, Form, HTTPException, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from models.user_model import User
from models.analysis_model import Analysis
from routers.auth_router import get_current_user
from utils.pdf_utils import extract_text_from_pdf

# Lazy imports to avoid circular dependencies
scoring_engine = None
embedding_service = None
intelligence_engine = None
nlp_heuristics = None
nlp_service = None

def _init_services():
    """Initialize services from main.py on first use."""
    global scoring_engine, embedding_service, intelligence_engine, nlp_heuristics, nlp_service
    if scoring_engine is None:
        from main import (
            scoring_engine as _scoring_engine,
            embedding_service as _embedding_service,
            intelligence_engine as _intelligence_engine,
            nlp_heuristics as _nlp_heuristics,
            nlp_service as _nlp_service
        )
        scoring_engine = _scoring_engine
        embedding_service = _embedding_service
        intelligence_engine = _intelligence_engine
        nlp_heuristics = _nlp_heuristics
        nlp_service = _nlp_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/batch",
    tags=["Batch Analysis"]
)

@router.post("/analyze")
async def batch_resume_analysis(
    resumes: List[UploadFile] = File(...),
    job_description: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze multiple resumes against a single job description.
    Returns ranked results sorted by match score.
    """
    _init_services()
    if not resumes or len(resumes) == 0:
        raise HTTPException(status_code=400, detail="At least one resume file is required")
    
    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required")
    
    results = []
    errors = []
    
    # Extract JD skills once for comparison
    jd_skills = nlp_service.extract_skills(job_description)
    
    logger.info(f"Processing {len(resumes)} resumes for batch analysis")
    
    for resume in resumes:
        try:
            # Extract resume text
            resume_text = extract_text_from_pdf(resume)
            if not resume_text or len(resume_text.strip()) < 50:
                errors.append({
                    "filename": resume.filename,
                    "error": "Could not extract meaningful text from PDF"
                })
                continue
            
            # 1. Semantic matching
            semantic_report = embedding_service.get_semantic_match_report(resume_text, job_description)
            match_score = semantic_report.get('overall_match', 0)
            
            # 2. Skill extraction and analysis
            resume_skills = nlp_service.extract_skills(resume_text)
            skill_comparison = nlp_service.compare_skills(resume_skills, jd_skills)
            skill_gaps = nlp_service.get_skill_gaps(resume_skills, jd_skills)
            
            # 3. Scoring metrics
            ats_metrics = scoring_engine.compute_ats_metrics(resume_text)
            
            # 4. AI intelligence analysis (lightweight for batch)
            try:
                intel = intelligence_engine.generate_full_analysis(
                    resume_text=resume_text,
                    jd_text=job_description,
                    role_name="Custom"
                )
                experience_score = intel.get("experience", {}).get("match_percentage", match_score)
                summary = intel.get("summary", "")
            except:
                logger.warning(f"Intelligence analysis failed for {resume.filename}, using fallback")
                experience_score = match_score
                summary = f"Resume matches {match_score}% of job requirements"
            
            # 5. Overall scoring
            overall_score = scoring_engine.compute_overall_score(
                skill_match=skill_gaps.get('match_percentage', 0),
                experience_match=experience_score,
                formatting_score=ats_metrics.get('overall_formatting', 70),
                ats_score=ats_metrics.get('ats_score', 0)
            )
            
            # 6. Selection probability
            try:
                selection_prob = nlp_heuristics.get_selection_probability(resume_text, job_description)
                probability_score = selection_prob.get('probability_score', match_score)
            except:
                probability_score = match_score
            
            # Prepare batch result
            batch_result = {
                "filename": resume.filename,
                "match_score": match_score,
                "overall_score": overall_score,
                "skills_score": skill_gaps.get('match_percentage', 0),
                "experience_score": experience_score,
                "ats_score": ats_metrics.get('ats_score', 0),
                "readability_score": ats_metrics.get('readability_score', 0),
                "selection_probability": probability_score,
                "summary": summary,
                "matched_skills_count": skill_gaps.get('matched_count', 0),
                "missing_skills_count": skill_gaps.get('missing_count', 0),
                "total_jd_skills": skill_gaps.get('total_jd_skills', 0),
                "top_missing_skills": skill_gaps.get('missing', [])[:5],
                "matched_skills": skill_gaps.get('matched', [])[:10]
            }
            
            # Save to database
            analysis_data = {
                "match_score": match_score,
                "overall_score": overall_score,
                "skills_score": skill_gaps.get('match_percentage', 0),
                "experience_score": experience_score,
                "ats_score": ats_metrics.get('ats_score', 0),
                "readability_score": ats_metrics.get('readability_score', 0),
                "summary": summary,
                "missing_skills": skill_gaps.get('missing', []),
                "matched_skills": skill_gaps.get('matched', [])
            }
            
            db_analysis = Analysis(
                user_id=current_user.id,
                resume_filename=resume.filename,
                job_description=job_description[:500],  # Store first 500 chars
                match_score=match_score,
                ats_score=ats_metrics.get('ats_score', 0),
                skills_score=skill_gaps.get('match_percentage', 0),
                experience_score=experience_score,
                analysis_result_json=analysis_data
            )
            db.add(db_analysis)
            db.commit()
            
            # Add database ID to result
            batch_result["analysis_id"] = db_analysis.id
            results.append(batch_result)
            
            logger.info(f"Batch analysis completed for {resume.filename}: {match_score}%")
            
        except Exception as e:
            logger.error(f"Batch processing error for {resume.filename}: {str(e)}")
            errors.append({
                "filename": resume.filename,
                "error": str(e)
            })
    
    if not results and errors:
        return JSONResponse(
            content={"error": "Could not process any resumes", "details": errors},
            status_code=400
        )
    
    # Sort by overall score descending
    results = sorted(results, key=lambda x: x["overall_score"], reverse=True)
    
    # Add ranking
    for i, result in enumerate(results, 1):
        result["rank"] = i
    
    return {
        "total_analyzed": len(results),
        "total_errors": len(errors),
        "results": results,
        "errors": errors if errors else None,
        "job_description_summary": {
            "skills_count": len(jd_skills),
            "top_skills": jd_skills[:15]
        }
    }


@router.post("/compare-skills")
async def compare_skills(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    """
    Extract and compare skills from a resume against job description.
    """
    try:
        _init_services()
        resume_text = extract_text_from_pdf(resume)
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume")
        
        # Extract skills
        resume_skills = nlp_service.extract_skills(resume_text)
        jd_skills = nlp_service.extract_skills(job_description)
        
        # Classify skills
        resume_classified = nlp_service.classify_skills(resume_skills)
        jd_classified = nlp_service.classify_skills(jd_skills)
        
        # Get gaps
        skill_gaps = nlp_service.get_skill_gaps(resume_skills, jd_skills)
        
        return {
            "resume_skills": {
                "total": len(resume_skills),
                "by_category": resume_classified,
                "all_skills": sorted(resume_skills)
            },
            "job_description_skills": {
                "total": len(jd_skills),
                "by_category": jd_classified,
                "all_skills": sorted(jd_skills)
            },
            "skill_gap_analysis": skill_gaps,
            "comparison": nlp_service.compare_skills(resume_skills, jd_skills)
        }
        
    except Exception as e:
        logger.error(f"Skill comparison error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Skill comparison failed: {str(e)}")


@router.get("/ranking/{analysis_id}")
async def get_result_ranking(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get ranking position of a specific analysis result in its batch.
    """
    _init_services()
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Get all analyses for this user from same job description
    same_jd_analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id,
        Analysis.job_description == analysis.job_description
    ).order_by(Analysis.match_score.desc()).all()
    
    ranking = {
        "total_resumes": len(same_jd_analyses),
        "your_rank": next((i+1 for i, a in enumerate(same_jd_analyses) if a.id == analysis_id), None),
        "your_score": analysis.match_score,
        "top_score": same_jd_analyses[0].match_score if same_jd_analyses else 0,
        "percentile": round((len(same_jd_analyses) - next((i for i, a in enumerate(same_jd_analyses) if a.id == analysis_id), len(same_jd_analyses))) / len(same_jd_analyses) * 100, 2) if same_jd_analyses else 0
    }
    
    return ranking
