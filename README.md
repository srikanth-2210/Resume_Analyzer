# AI-Powered Resume Feedback Analyzer

A high-fidelity Resume Analyzer that leverages the **Gemini 2.0/1.5 Flash** models to provide multidimensional career feedback. Unlike basic matchers, this tool acts as an AI Career Strategist, offering categorized insights on formatting, skills, and actionable improvement steps.

## 🚀 Key Features

### 📊 **Core Analysis Features**
- **Quantum Matching Engine**: High-fidelity semantic analysis of your resume against any Job Description with detailed scoring
- **Multi-Dimensional Resume Analysis**:
  - **Semantic Match Score**: Overall percentage match between resume and job requirements
  - **Skill Match Analysis**: Identifies matching and missing technical skills
  - **Experience Alignment**: Evaluates years of experience and role relevance
  - **Tool & Technology Matching**: Checks proficiency in required tools and frameworks
  - **ATS Compliance Scoring**: Readability and automated applicant tracking system compatibility

### 🎯 **Resume Optimization Suite**
- **Optimized Bullet Points**: AI-generated improved resume bullets with metrics and impact statements
- **Structural Suggestions**: Recommendations for resume layout, formatting, and organization
- **Selection Probability Booster**: Calculates likelihood of recruiter selection (0-100%)
- **Recruiter Hooks**: Identifies key points that catch recruiter attention in first 6-second scan
- **Priority Action Plan**: Ranked list of improvements for maximum impact
- **Keyword Alignment Analysis**: Shows keyword density and distribution matching

### 🎓 **Interview Preparation**
- **Behavioral Questions**: Role-specific behavioral interview questions with STAR tips
- **Technical Questions**: In-depth technical questions tailored to your target role
- **Role-Specific Challenges**: Real-world scenarios and problem-solving questions
- **Preparation Strategy**: Customized interview preparation roadmap
- **Expected Answer Points**: Guide for comprehensive answer structure

### 🚀 **Career Intelligence**
- **Career Path Prediction**: Identifies top 3 matching roles from database based on your resume
- **Multi-Role Fit Analysis**: Calculates confidence scores across different positions
- **Skills Gap Ranking**: Prioritized list of skills to develop for target roles
- **Executive Summary**: Strategic overview of candidate-role alignment
- **Core Differentiators**: Highlights unique selling points and competitive advantages

### 🛡️ **Production-Ready Features**
- **Self-Healing Backend**: Robust AI pipeline with automatic model fallbacks (Gemini 2.0 → 1.5 Flash/Pro)
- **Smart Role Templates**: Pre-built job descriptions for 5 major tech roles
- **Custom Job Matching**: Support for any job description or role
- **PDF Text Extraction**: Advanced PDF parsing with multi-page support
- **Error Handling**: Graceful fallbacks with helpful error messages
- **Modern Glassmorphism UI**: Premium, responsive interface with neural data visualization

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.10+) - High-performance async web framework
- **PDF Processing**: PyMuPDF (fitz) - Advanced PDF text extraction
- **AI/ML**: Google Generative AI SDK (Gemini 2.0/1.5 Flash models)
- **API**: RESTful architecture with CORS support
- **Deployment**: Uvicorn ASGI server

### Frontend
- **Framework**: React 19 with Hooks
- **Build Tool**: Vite 6.3+ (ultra-fast module bundler)
- **Styling**: Tailwind CSS 3.4 with custom glassmorphism design
- **Icons**: Lucide React icons
- **Features**: 
  - Hot Module Replacement (HMR) for instant updates
  - Responsive design for all device sizes
  - Premium UI with neural data visualization

### Core Libraries
- **Semantic Analysis**: Google embeddings API
- **Data Validation**: Pydantic
- **HTTP Client**: Requests (frontend via fetch API)
- **File Handling**: FormData API for multipart uploads

### AI Models
- **Primary**: Gemini 2.0 Flash - Latest, fastest Gemini model
- **Fallback**: Gemini 1.5 Flash/Pro - For redundancy and reliability
- **Capabilities**: Text analysis, embedding generation, intelligent synthesis

## 📂 Project Structure
```text
Resume_Analyzer/
├── backend/                    # FastAPI Python Server
│   ├── main.py                # API endpoints & analysis orchestration
│   ├── requirements.txt        # Python dependencies
│   ├── run_backend.bat         # Quick start script (Windows)
│   ├── data/
│   │   └── role_templates.json # Pre-built job descriptions (5 roles)
│   ├── models/
│   │   └── schemas.py          # Data models and response schemas
│   └── services/               # AI & Analysis Services
│       ├── role_engine.py      # Role database & management
│       ├── embedding_service.py # Semantic matching via embeddings
│       ├── intelligence_engine.py # AI-powered analysis generation
│       ├── optimization_service.py # Resume optimization (NEWLY FIXED ✅)
│       ├── scoring_engine.py   # ATS & readability scoring
│       ├── skill_analysis_service.py # Skill extraction & mapping
│       ├── interview_prep_service.py # Interview question generation
│       └── nlp_heuristics.py   # Local NLP analysis
├── frontend/                   # React + Vite Web Application
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Vite entry point
│   │   ├── index.css          # Tailwind & custom styles
│   │   └── components/        # Reusable UI Components
│   │       ├── RoleSelector.jsx # Role selection interface
│   │       ├── MatchingTabs.jsx # Multi-tab results display
│   │       ├── OptimizationView.jsx # Resume optimization results ✅
│   │       ├── InterviewPrepView.jsx # Interview prep display
│   │       ├── CareerPrediction.jsx # Career path recommendations
│   │       └── CircularProgress.jsx # Score visualization
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS customization
│   └── postcss.config.js      # PostCSS configuration
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
└── .env.example               # Environment variables template
```

## 💻 Local Quickstart

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

### 2. Backend Setup
1. Create and configure your environment:
   ```bash
   # Create backend/.env file
   echo GEMINI_API_KEY=your_actual_api_key_here > backend/.env
   ```

2. **Quick Start (Windows)**:
   ```bash
   # Simply run the batch file
   backend\run_backend.bat
   ```
   
3. **Manual Start**:
   ```bash
   # Create virtual environment (if needed)
   python -m venv venv
   venv\Scripts\activate
   
   # Install dependencies
   cd backend
   pip install -r requirements.txt
   
   # Run server
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   Server will be available at: `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser to start using the analyzer.

### 4. Using the Application
1. **Upload Resume**: Drag & drop or click to upload your PDF resume
2. **Select Role**: Choose from 5 predefined roles or enter custom job description
3. **Run Analysis**: Click "Analyze Match" button
4. **Review Results**:
   - **Insights Tab**: Overall match score, strengths, and skill gaps
   - **Matching Tab**: Detailed semantic matching breakdown
   - **Optimization Tab**: Resume improvement suggestions with priority actions
   - **Interview Tab**: Behavioral and technical interview questions
   - **Career Tab**: Best-fit roles across the database

## 🔑 API Endpoints

### Analysis Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check / API status |
| `/roles` | GET | List available role templates |
| `/role-details/{role_name}` | GET | Fetch specific role details |
| `/match_resume` | POST | Full resume analysis (requires PDF upload) |
| `/semantic-match` | POST | Quick semantic matching (text-only) |
| `/optimize-resume` | POST | Resume optimization suggestions ✅ |

### Request/Response Examples

**POST /match_resume**
```
Form Parameters:
- resume (file): PDF resume file
- job_description (string): Job description text
- role_template (string): Optional predefined role name

Response:
{
  "match_score": 85.5,
  "ats_score": 92,
  "readability_score": 88,
  "summary": "Your resume matches 85.5% of the target requirements...",
  "strengths": ["Python", "FastAPI", "Docker"],
  "missing_skills": ["Kubernetes", "Terraform"],
  "semantic_report": { "overall_match": 85.5, "skill_match": 87, ... },
  "optimized_bullets": [{"original": "...", "suggested": "...", "reason": "..."}],
  "structural_suggestions": [{"area": "...", "suggestion": "...", "benefit": "..."}],
  "selection_intelligence": { "probability_score": 78, "tier": "High", ... },
  "interview_intelligence": { "behavioral_questions": [...], "technical_questions": [...], ... },
  "career_fit_prediction": [{"role": "Backend Engineer", "confidence": 89}, ...]
}
```

**POST /optimize-resume**
```
Form Parameters:
- resume_text (string): Resume content
- jd_text (string): Job description content

Response:
{
  "jd_key_requirements": ["requirement1", "requirement2", ...],
  "optimized_bullets": [{"original": "...", "suggested": "...", "reason": "..."}],
  "technology_alignment": { "jd_required_tech": [...], "gaps": [...] },
  "structural_suggestions": [...],
  "impact_summary": "How these changes improve fit..."
}
```

## 🎯 Available Role Templates

The system comes with 5 pre-configured roles:
1. **Data Scientist** - Machine learning, statistics, Python/R
2. **ML Engineer** - Model development, TensorFlow/PyTorch, deployment
3. **Backend Engineer** - API development, database design, system architecture
4. **AI Researcher** - Research methodologies, novel algorithms, deep learning
5. **Data Analyst** - Data analysis, SQL, visualization, business intelligence

Plus support for **custom roles** - simply paste any job description!

## 🔧 Recent Updates & Fixes

### ✅ Optimization Endpoint Fix
- **Issue**: The `/optimize-resume` endpoint was not functioning
- **Root Cause**: Missing `OptimizationService` import and initialization
- **Fix**: Added proper service import and initialization in `backend/main.py`
- **Status**: ✅ Now fully operational and tested

### ✅ Enhanced Features
- Improved semantic matching accuracy with Gemini embeddings
- Better skill extraction and gap analysis
- More comprehensive interview question generation
- Selection probability scoring based on ATS and keyword alignment

## 📊 How the Analysis Works

1. **PDF Processing**: Resume is extracted using PyMuPDF with multi-page support
2. **Text Analysis**: Resume and JD are analyzed using NLP heuristics
3. **Semantic Matching**: Embeddings are generated and compared using cosine similarity
4. **AI Intelligence**: Gemini models generate contextual insights and recommendations
5. **Scoring**: Multiple dimensions (ATS, readability, match) are calculated
6. **Optimization**: Smart suggestions are generated based on gaps and best practices
7. **Interview Prep**: Role-specific questions are curated for interview preparation

## ☁️ Deployment Guide

### Backend Deployment (Render, AWS Lambda, or Similar)

**Configuration Files**:
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
- **Python Version**: 3.10+

**Environment Variables**:
```env
GEMINI_API_KEY=your_api_key_here
```

**Step-by-Step (Render)**:
1. Connect your GitHub repository
2. Create new Web Service
3. Set Root Directory to `backend`
4. Set Start Command to `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add Environment Variable: `GEMINI_API_KEY`
6. Deploy!

### Frontend Deployment (Vercel, Netlify, or Similar)

**Configuration Files**:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+

**Environment Variables**:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

**Step-by-Step (Vercel)**:
1. Connect your GitHub repository
2. Select Vercel for deployment
3. Set Root Directory to `frontend`
4. Add Environment Variable: `VITE_API_URL` (point to your backend)
5. Deploy!

### Full Stack Deployment Checklist
- [ ] Backend API deployed with GEMINI_API_KEY set
- [ ] Frontend built and deployed with VITE_API_URL set
- [ ] CORS properly configured for your domain
- [ ] SSL/HTTPS enabled for both services
- [ ] Database backups configured (if applicable)
- [ ] Error monitoring/logging set up
- [ ] API rate limiting configured

## � Troubleshooting

### Common Issues

**Backend won't start**
```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000

# Kill existing process
taskkill /PID <PID> /F

# Try a different port
uvicorn main:app --reload --port 8001
```

**Frontend connection errors**
```bash
# Ensure backend is running first
# Check VITE_API_URL environment variable
# Verify backend URL in frontend/.env or App.jsx

# Clear npm cache
npm cache clean --force
npm install
npm run dev
```

**Gemini API errors**
```bash
# Check if API key is valid and has quota
# Verify key is set in backend/.env
# Check if billing is enabled in Google Cloud Console
```

**PDF extraction issues**
- Ensure PDF is text-based (not scanned image)
- Check file is not corrupted
- Try with a different PDF
- Check PyMuPDF version: `pip show fitz`

### Getting Help
1. Check the console output for detailed error messages
2. Review API response in browser DevTools (F12 → Network tab)
3. Verify all prerequisites are installed: `python --version`, `node --version`
4. Ensure `.env` file is in `backend/` directory

## 📚 Usage Tips

### Best Practices
1. **Use PDF Format**: Upload resumes as PDF for optimal text extraction
2. **Clear JD**: Provide well-formatted job descriptions for better matching
3. **Review All Tabs**: Each tab provides different insights
4. **Iterate**: Make suggested changes and re-analyze to track progress
5. **Interview Prep**: Study generated questions before interviews

### Tips for Best Results
- Include metrics and quantifiable achievements in your resume
- Match terminology from job description
- Highlight relevant certifications and skills
- Maintain consistent formatting and structure
- Use active verbs and action words

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### Areas for Contribution
- Additional role templates
- Improved NLP analysis
- Frontend UI/UX enhancements
- Performance optimizations
- Additional language support
- Mobile app development

## 📖 Documentation

### For Developers
- **API Documentation**: See API Endpoints section above
- **Architecture**: Modular service-based backend design
- **Code Style**: PEP 8 (Python), ESLint (JavaScript)

### For Users
- **Video Tutorials**: Coming soon
- **FAQ**: See Troubleshooting section
- **Blog**: Tips for resume optimization

## 🎓 Learning Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [FastAPI Guide](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🎯 Roadmap

### Upcoming Features
- [ ] Multi-language support
- [ ] LinkedIn resume import
- [ ] Resume history and version tracking
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Custom role creation
- [ ] Mobile application
- [ ] Export to Word/PDF
- [ ] Real-time collaboration

### Planned Improvements
- [ ] More role templates (50+)
- [ ] Industry-specific insights
- [ ] Salary prediction
- [ ] Market trends analysis
- [ ] Competitor analysis
- [ ] Interview scheduling integration

## 📜 License
MIT License. Feel free to use and adapt this for your own portfolio!

## 👨‍💻 Author
Developed with ❤️ to help candidates fulfill their career potential.

## 🙏 Acknowledgments
- Google Gemini AI for powerful language models
- FastAPI community for excellent web framework
- React and Vite teams for frontend tooling
- All contributors and testers

## 📧 Contact & Support
- **Issues**: Open an issue on GitHub
- **Questions**: Check FAQ or open a discussion
- **Feedback**: We'd love to hear your suggestions!

---

**Made with ❤️ by developers, for developers**

*Last Updated: March 2026*
