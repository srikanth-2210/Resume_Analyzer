import os
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import fitz  # PyMuPDF
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for all origins (helpful for frontend testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to extract text from uploaded PDF resume
def extract_text_from_pdf(file: UploadFile) -> str:
    with fitz.open(stream=file.file.read(), filetype="pdf") as doc:
        text = ""
        for page in doc:
            text += page.get_text()
        return text.strip()

# Function to get AI-based resume match score and detailed feedback using Gemini
def get_match_score(resume_text: str, job_description: str) -> dict:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        raise ValueError("GOOGLE_API_KEY is not configured. Please set the GEMINI_API_KEY in the backend/.env file.")
        
    # List of models to try in order of preference
    models_to_try = [
        'gemini-2.0-flash', 
        'gemini-1.5-flash', 
        'gemini-flash-latest', 
        'gemini-pro', 
        'gemini-1.5-pro'
    ]
    
    last_error = None
    for model_name in models_to_try:
        try:
            print(f"Attempting analysis with model: {model_name}")
            model = genai.GenerativeModel(model_name)
            prompt = f"""
            You are an expert AI Resume Evaluator and Career Coach. 
            Analyze the following resume against the job description and provide a detailed, structured feedback report in JSON format.

            Resume Text:
            {resume_text}

            Job Description:
            {job_description}

            Your response must be a valid JSON object with the following structure:
            {{
                "match_score": <integer between 0 and 100>,
                "summary": "<2-3 sentence overview of the match>",
                "strengths": ["<strength 1>", "<strength 2>", ...],
                "missing_skills": ["<missing skill 1>", "<missing skill 2>", ...],
                "formatting_feedback": ["<feedback on layout/formatting 1>", ...],
                "actionable_steps": ["<specific step to improve 1>", "<specific step to improve 2>", ...],
                "industry_relevance": "<assessment of how relevant the resume is to the industry of the JD>"
            }}
            """
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            import json
            return json.loads(response.text)
        except Exception as e:
            print(f"Error with model {model_name}: {e}")
            last_error = e
            continue
            
    # If all models fail
    return {
        "match_score": 0,
        "summary": "AI Analysis Failed. All models exhausted.",
        "strengths": [],
        "missing_skills": [],
        "formatting_feedback": [],
        "actionable_steps": [f"Error: {str(last_error)}", "Please check your internet connection or API key quota."],
        "error": str(last_error)
    }

# API endpoint to upload resume and job description
@app.post("/match_resume")
async def match_resume(resume: UploadFile, job_description: str = Form(...)):
    try:
        resume_text = extract_text_from_pdf(resume)
        result = get_match_score(resume_text, job_description)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Basic root endpoint
@app.get("/")
def read_root():
    return {"message": "Resume Analyzer API is running."}
