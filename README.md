# AI-Powered Resume Feedback Analyzer

A high-fidelity Resume Analyzer that leverages the **Gemini 2.0/1.5 Flash** models to provide multidimensional career feedback. Unlike basic matchers, this tool acts as an AI Career Strategist, offering categorized insights on formatting, skills, and actionable improvement steps.

## 🚀 Key Features
- **Quantum Matching Engine**: High-fidelity semantic analysis of your resume against any Job Description.
- **Categorized AI Insights**:
  - **Executive Summary**: Strategic overview of candidate-role alignment.
  - **Core Differentiators**: Highlight of candidate's unique selling points.
  - **Structural Gaps**: Identification of missing skills or experience.
  - **Formatting Intelligence**: ATS-focused tips for layout and technical presentation.
  - **Actionable Roadmap**: Clear, prioritized steps for resume optimization.
- **Self-Healing Backend**: Robust AI pipeline that automatically handles model fallbacks to ensure 100% analysis success.
- **Modern Glassmorphism UI**: A premium, responsive interface with deep scan capabilities and neural data visualization.

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python 3.10+), PyMuPDF, Google Generative AI (Gemini SDK)
- **Frontend**: React (v19), Vite, Tailwind CSS, Lucide Icons
- **AI Model**: Gemini 2.0 Flash (with self-healing fallback to 1.5 Flash/Pro)

## 📂 Project Structure
```text
Resume_Analyzer/
├── backend/            # FastAPI Python Server
│   ├── main.py         # AI Logic & API Endpoints
│   ├── requirements.txt
│   └── .env.example    # Configuration template
├── frontend/           # React Web Application
│   ├── src/            # Components & Logic
│   └── package.json    
├── venv/               # Unified Virtual Environment
├── .gitignore          # Repository ignore rules
└── README.md           # Documentation
```

## 💻 Local Quickstart

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

### 2. Backend Setup
1. Define your API key in `backend/.env`:
   ```ini
   GEMINI_API_KEY=your_actual_api_key_here
   ```
2. **Fast Start (Windows)**:
   Double-click `backend\run_backend.bat`
   
3. **Manual Start**:
   ```bash
   venv\Scripts\activate
   cd backend
   uvicorn main:app --reload
   ```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) to start analyzing.

## ☁️ Deployment Guide

### Backend (Render)
- **Root**: `backend`
- **Build**: `pip install -r requirements.txt`
- **Start**: `uvicorn main:app --host 0.0.0.0 --port 10000`
- **ENV**: Add `GEMINI_API_KEY`.

### Frontend (Vercel)
- **Root**: `frontend`
- **Build**: `npm run build`
- **Output**: `dist`
- **ENV**: Add `VITE_API_URL` pointing to your Render backend link.

## 📜 License
MIT License. Feel free to use and adapt this for your own portfolio!

---
*Developed with ❤️ to help candidates fulfill their career potential.*
