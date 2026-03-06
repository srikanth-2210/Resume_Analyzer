import os
import json
import logging
from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import fitz  # PyMuPDF
import google.generativeai as genai

# Import Services
from services.role_engine import RoleEngine
from services.embedding_service import EmbeddingService
from services.scoring_engine import ScoringEngine
from services.intelligence_engine import IntelligenceEngine
from services.nlp_heuristics import NLPHeuristics
from services.optimization_service import OptimizationService

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize FastAPI app
app = FastAPI(title="Resume Feedback Tool")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
role_engine = RoleEngine()
embedding_service = EmbeddingService(api_key=GEMINI_API_KEY)
scoring_engine = ScoringEngine()
intelligence_engine = IntelligenceEngine(api_key=GEMINI_API_KEY)
nlp_heuristics = NLPHeuristics()
optimization_service = OptimizationService(api_key=GEMINI_API_KEY)

# Pre-cache role embeddings to save API calls
role_embeddings_cache = {}

def get_role_embedding(role_name: str):
    if role_name not in role_embeddings_cache:
        role_data = role_engine.get_role_details(role_name)
        if role_data:
            emb = embedding_service.generate_embedding(role_data["jd"])
            if emb:
                role_embeddings_cache[role_name] = emb
    return role_embeddings_cache.get(role_name)

def extract_text_from_pdf(file: UploadFile) -> str:
    try:
        data = file.file.read()
        logger.info(f"PDF raw data size: {len(data)} bytes")
        with fitz.open(stream=data, filetype="pdf") as doc:
            text = ""
            for page in doc:
                text += page.get_text()
            
            clean_text = text.strip()
            logger.info(f"Extracted text length: {len(clean_text)} characters")
            if not clean_text:
                logger.warning("No text extracted from PDF!")
            return clean_text
    except Exception as e:
        logger.error(f"PDF Extraction failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

@app.get("/roles")
async def get_roles():
    roles = role_engine.list_roles()
    logger.info(f"Serving {len(roles)} roles: {roles}")
    return roles

@app.get("/role-details/{role_name}")
async def get_role_details(role_name: str):
    role = role_engine.get_role_details(role_name)
    if not role:
        logger.warning(f"Role request for unknown role: {role_name}")
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@app.post("/match_resume")
async def match_resume(
    resume: UploadFile, 
    job_description: str = Form(None),
    role_template: str = Form(None)
):
    try:
        logger.info(f"Analysis request received for role: {role_template or 'Custom'}")
        
        resume_text = extract_text_from_pdf(resume)
        if not resume_text:
            return JSONResponse(content={"error": "The uploaded PDF appears to be empty or non-parsable."}, status_code=400)

        # Determine JD source
        if role_template and role_template != "Custom":
            jd_data = role_engine.get_role_details(role_template)
            if not jd_data:
                logger.error(f"Role template {role_template} not found in engine constants.")
                jd_text = job_description
                role_weights = {"skills": 0.33, "experience": 0.33, "tools": 0.34}
            else:
                jd_text = jd_data["jd"]
                role_weights = jd_data["weights"]
        else:
            jd_text = job_description
            role_weights = {"skills": 0.33, "experience": 0.33, "tools": 0.34}

        if not jd_text or not jd_text.strip():
            logger.warning("Empty Job Description provided.")
            return JSONResponse(content={"error": "Job description or role template required"}, status_code=400)

        # 1. Semantic Match
        logger.info("Generating semantic match report...")
        semantic_report = embedding_service.get_semantic_match_report(resume_text, jd_text)
        match_score = semantic_report['overall_match']
        logger.info(f"Semantic match completed: {match_score}%")
        
        # 2. Comprehensive Career Intelligence
        logger.info("Engaging Intelligence Engine for deep analysis...")
        intel = intelligence_engine.generate_full_analysis(
            resume_text=resume_text, 
            jd_text=jd_text, 
            role_name=role_template if isinstance(role_template, str) else "ML Engineer"
        )
        
        # 3. Production Readiness
        logger.info("Scanning document structural integrity...")
        readiness = scoring_engine.scan_production_readiness(resume_text)
        
        # 4. Career Fit Prediction (Optimized)
        logger.info("Starting Career Fit analysis...")
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
        else:
            logger.error("Resume embedding generation failed for career fit calculation.")

        # 6. ATS & Readability
        ats_metrics = scoring_engine.compute_ats_metrics(resume_text)

        # 7. Local NLP Heuristics (Selection Probability Booster)
        logger.info("Calculating local selection probability...")
        local_selection = nlp_heuristics.get_selection_probability(resume_text, jd_text)

        logger.info(f"Full analysis complete. Final score: {match_score}%")

        # Merge AI intelligence with local data-driven heuristics
        opt_data = intel.get("optimization", {})
        selection_intel = opt_data.get("selection_intelligence", {
            "recruiter_hooks": [],
            "priority_action_plan": []
        })
        
        # Inject local scores into selection intelligence
        selection_intel["probability_score"] = local_selection["probability_score"]
        selection_intel["tier"] = local_selection["tier"]
        selection_intel["local_factors"] = local_selection["factors"]

        return {
            "match_score": match_score,
            "ats_score": ats_metrics["ats_score"],
            "readability_score": ats_metrics["readability_score"],
            "summary": intel.get("summary", f"Your resume matches {match_score}% of the target requirements."),
            "strengths": intel.get("skills", {}).get("strong_matches", []),
            "missing_skills": intel.get("skills", {}).get("missing_skills", []),
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

    except Exception as e:
        import traceback
        logger.error(f"Match resume failure: {str(e)}")
        logger.error(traceback.format_exc())
        return JSONResponse(content={"error": f"Internal Intelligence Failure: {str(e)}"}, status_code=500)

@app.post("/semantic-match")
async def semantic_match(resume_text: str = Form(...), jd_text: str = Form(...)):
    return embedding_service.get_semantic_match_report(resume_text, jd_text)

@app.post("/optimize-resume")
async def optimize(resume_text: str = Form(...), jd_text: str = Form(...)):
    return optimization_service.optimize_resume(resume_text, jd_text)

@app.get("/")
def read_root():
    return {"message": "AI Career Intelligence Engine is running."}
