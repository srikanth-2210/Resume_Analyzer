import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, Form, HTTPException, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from models.user_model import User
from models.analysis_model import Analysis
from routers.auth_router import get_current_user, get_current_user_optional
from utils.pdf_utils import extract_text_from_pdf
from services.linkedin_service import LinkedInService

# Lazy imports to avoid circular dependencies
role_engine = None
embedding_service = None
scoring_engine = None
intelligence_engine = None
nlp_heuristics = None
optimization_service = None
get_role_embedding = None

def _init_services():
    """Initialize services from main.py on first use."""
    global role_engine, embedding_service, scoring_engine, intelligence_engine, nlp_heuristics, optimization_service, get_role_embedding
    if role_engine is None:
        from main import (
            role_engine as _role_engine,
            embedding_service as _embedding_service,
            scoring_engine as _scoring_engine,
            intelligence_engine as _intelligence_engine,
            nlp_heuristics as _nlp_heuristics,
            optimization_service as _optimization_service,
            get_role_embedding as _get_role_embedding
        )
        role_engine = _role_engine
        embedding_service = _embedding_service
        scoring_engine = _scoring_engine
        intelligence_engine = _intelligence_engine
        nlp_heuristics = _nlp_heuristics
        optimization_service = _optimization_service
        get_role_embedding = _get_role_embedding

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)

@router.post("/match_resume")
async def match_resume(
    resume: Optional[UploadFile] = File(None), 
    linkedin_url: Optional[str] = Form(None),
    job_description: str = Form(None),
    role_template: str = Form(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    try:
        _init_services()
        user_email = current_user.email if current_user else "demo_user"
        logger.info(f"Analysis request received for role: {role_template or 'Custom'} from user {user_email}")
        
        if linkedin_url:
            linkedin_service = LinkedInService()
            resume_text = await linkedin_service.extract_profile_text(linkedin_url)
            filename = "LinkedIn_Profile"
        elif resume:
            resume_text = extract_text_from_pdf(resume)
            filename = resume.filename
        else:
            return JSONResponse(content={"error": "Either resume PDF or LinkedIn URL must be provided."}, status_code=400)
            
        if not resume_text:
            return JSONResponse(content={"error": "The provided source appears to be empty or non-parsable."}, status_code=400)

        # Determine JD source
        if role_template and role_template != "Custom":
            jd_data = role_engine.get_role_details(role_template)
            if not jd_data:
                logger.error(f"Role template {role_template} not found in engine constants.")
                jd_text = job_description
            else:
                jd_text = jd_data["jd"]
        else:
            jd_text = job_description

        if not jd_text or not jd_text.strip():
            logger.warning("Empty Job Description provided.")
            return JSONResponse(content={"error": "Job description or role template required"}, status_code=400)

        # 1. Semantic Match
        semantic_report = embedding_service.get_semantic_match_report(resume_text, jd_text)
        match_score = semantic_report['overall_match']
        
        # 2. Comprehensive Career Intelligence
        intel = intelligence_engine.generate_full_analysis(
            resume_text=resume_text, 
            jd_text=jd_text, 
            role_name=role_template if isinstance(role_template, str) else "ML Engineer"
        )
        
        # 3. Production Readiness
        readiness = scoring_engine.scan_production_readiness(resume_text)
        
        # 4. Career Fit Prediction (Optimized)
        all_roles = role_engine.list_roles()
        career_fit = []
        resume_emb = embedding_service.generate_embedding(resume_text)
        if resume_emb:
            for role in all_roles:
                role_emb = get_role_embedding(role)
                if role_emb:
                    score = embedding_service.compute_cosine_similarity(resume_emb, role_emb)
                    career_fit.append({"role": role, "confidence": round(score * 100, 2)})
            career_fit = sorted(career_fit, key=lambda x: x["confidence"], reverse=True)[:3]

        # 6. ATS & Readability
        ats_metrics = scoring_engine.compute_ats_metrics(resume_text)

        # 7. Local NLP Heuristics
        local_selection = nlp_heuristics.get_selection_probability(resume_text, jd_text)

        # Merge AI intelligence with local data-driven heuristics
        opt_data = intel.get("optimization", {})
        selection_intel = opt_data.get("selection_intelligence", {
            "recruiter_hooks": [],
            "priority_action_plan": []
        })
        selection_intel["probability_score"] = local_selection["probability_score"]
        selection_intel["tier"] = local_selection["tier"]
        selection_intel["local_factors"] = local_selection["factors"]

        # Component scores
        skills_score = intel.get("skills", {}).get("match_percentage", match_score)
        experience_score = intel.get("experience", {}).get("match_percentage", match_score)

        # Skill Comparison Matrix
        matched_skills = intel.get("skills", {}).get("strong_matches", [])
        missing_skills = intel.get("skills", {}).get("missing_skills", [])
        skill_comparison = []
        for s in matched_skills:
            skill_comparison.append({"skill": s, "status": "Match"})
        for s in missing_skills:
            skill_comparison.append({"skill": s, "status": "Missing"})

        analysis_result = {
            "match_score": match_score,
            "ats_score": ats_metrics["ats_score"],
            "skills_score": skills_score,
            "experience_score": experience_score,
            "readability_score": ats_metrics["readability_score"],
            "summary": intel.get("summary", f"Your resume matches {match_score}% of the target requirements."),
            "strengths": intel.get("skills", {}).get("strong_matches", []),
            "missing_skills": missing_skills,
            "skill_comparison": skill_comparison,
            "skill_gap_ranking": intel.get("skills", {}).get("gap_ranking", []),
            "readiness": readiness,
            "semantic_report": semantic_report,
            "optimized_bullets": opt_data.get("bullets", []),
            "structural_suggestions": opt_data.get("structural_suggestions", []),
            "selection_intelligence": selection_intel,
            "impact_summary": opt_data.get("impact_summary", "Initial baseline optimization suggested."),
            "career_fit_prediction": career_fit,
            "interview_intelligence": {
                "behavioral_questions": intel.get("interview", {}).get("behavioral_questions", []),
                "technical_questions": intel.get("interview", {}).get("technical_questions", []),
                "role_specific_challenges": intel.get("interview", {}).get("role_specific_challenges", []),
                "preparation_strategy": intel.get("interview", {}).get("preparation_strategy", "Analyze industry trends for this role.")
            }
        }

        # Save to DB only if user is authenticated
        analysis_result["id"] = None
        if current_user:
            db_analysis = Analysis(
                user_id=current_user.id,
                resume_filename=filename,
                job_description=jd_text,
                match_score=match_score,
                ats_score=ats_metrics["ats_score"],
                skills_score=skills_score,
                experience_score=experience_score,
                analysis_result_json=analysis_result
            )
            db.add(db_analysis)
            db.commit()
            db.refresh(db_analysis)
            analysis_result["id"] = db_analysis.id

        return analysis_result

    except Exception as e:
        import traceback
        logger.error(f"Match resume failure: {str(e)}")
        logger.error(traceback.format_exc())
        return JSONResponse(content={"error": f"Internal Intelligence Failure: {str(e)}"}, status_code=500)

@router.post("/batch")
async def batch_analysis(
    resumes: List[UploadFile] = File(...),
    job_description: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = []
    _init_services()
    
    for resume in resumes:
        try:
            resume_text = extract_text_from_pdf(resume)
            if not resume_text:
                continue
                
            semantic_report = embedding_service.get_semantic_match_report(resume_text, job_description)
            match_score = semantic_report['overall_match']
            
            # Limited intelligence for batch speed
            intel = intelligence_engine.generate_full_analysis(resume_text=resume_text, jd_text=job_description, role_name="Custom")
            
            skills_score = intel.get("skills", {}).get("match_percentage", match_score)
            experience_score = intel.get("experience", {}).get("match_percentage", match_score)
            ats_metrics = scoring_engine.compute_ats_metrics(resume_text)
            
            analysis_result = {
                "match_score": match_score,
                "ats_score": ats_metrics["ats_score"],
                "skills_score": skills_score,
                "experience_score": experience_score,
                "missing_skills": intel.get("skills", {}).get("missing_skills", []),
            }
            
            db_analysis = Analysis(
                user_id=current_user.id,
                resume_filename=resume.filename,
                job_description=job_description,
                match_score=match_score,
                ats_score=ats_metrics["ats_score"],
                skills_score=skills_score,
                experience_score=experience_score,
                analysis_result_json=analysis_result
            )
            db.add(db_analysis)
            db.commit()
            
            results.append({
                "filename": resume.filename,
                "match_score": match_score,
                "missing_skills": analysis_result["missing_skills"]
            })
            
        except Exception as e:
            logger.error(f"Batch processing failed for {resume.filename}: {e}")
            
            # Sort results by match score
    results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return {"results": results}

@router.post("/semantic-match")
async def semantic_match(resume_text: str = Form(...), jd_text: str = Form(...)):
    _init_services()
    return embedding_service.get_semantic_match_report(resume_text, jd_text)

@router.post("/optimize-resume")
async def optimize(resume_text: str = Form(...), jd_text: str = Form(...)):
    _init_services()
    return optimization_service.optimize_resume(resume_text, jd_text)
