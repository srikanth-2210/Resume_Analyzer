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
from services.nlp_service import NLPService
from services.nlp_heuristics import NLPHeuristics
from services.optimization_service import OptimizationService

# Database and Routers
from database import engine, Base
from routers.auth_router import router as auth_router
from routers.analysis_router import router as analysis_router
from routers.history_router import router as history_router
from routers.batch_router import router as batch_router

# Create Database tables
Base.metadata.create_all(bind=engine)

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

# Include Routers
app.include_router(auth_router)
app.include_router(analysis_router)
app.include_router(history_router)
app.include_router(batch_router)

# Initialize Services
role_engine = RoleEngine()
embedding_service = EmbeddingService(api_key=GEMINI_API_KEY)
scoring_engine = ScoringEngine()
intelligence_engine = IntelligenceEngine(api_key=GEMINI_API_KEY)
nlp_service = NLPService()
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

@app.get("/")
def read_root():
    return {"message": "AI Career Intelligence Engine is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
