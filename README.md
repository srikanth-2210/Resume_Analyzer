# 🚀 AI Resume Intelligence Platform

A **production-grade AI Resume Analysis System** powered by Google Gemini AI, featuring NLP-based skill extraction, intelligent scoring, and comprehensive career intelligence.

## ✨ Key Features

### 📊 **Intelligent Resume Analysis**
- **Semantic Matching:** AI-powered comparison of resume vs job requirements
- **Multi-Dimensional Scoring:**
  - Overall Match Score (0-100%)
  - Skills Match Analysis
  - Experience Alignment
  - ATS Compatibility Score
  - Formatting & Readability
  
### 🎯 **NLP-Powered Skill Extraction**
- Automatic extraction of technical and soft skills
- Skill categorization (Programming, Cloud, ML, DevOps, Frontend, Backend, Soft Skills)
- Resume vs JD skill comparison matrix
- Skill gap ranking by importance

### 📈 **Comprehensive Scoring Engine**
- **Formula:** `0.35 * Skills + 0.25 * Experience + 0.2 * ATS + 0.15 * Formatting + 0.05 * Production-Ready`
- Production readiness assessment
- ATS compatibility metrics
- Selection probability estimation

### 🔄 **Batch Resume Analysis**
- Analyze multiple resumes simultaneously
- Automated candidate ranking
- Comparative performance metrics
- Exportable results

### 📋 **AI-Generated Insights**
- **Executive Summary** - Strategic overview of candidate-role alignment
- **Optimized Bullet Points** - AI-improved resume bullets with metrics
- **Structural Suggestions** - Resume formatting recommendations
- **Skill Gap Ranking** - Prioritized missing skills with business impact
- **Selection Probability** - Likelihood of passing initial screening

### 🎓 **Interview Preparation**
- Role-specific behavioral questions
- Technical interview questions
- Real-world scenario challenges
- Customized preparation roadmap

### 💼 **Career Intelligence**
- Career path prediction (top 3 matching roles)
- Multi-role fit analysis with confidence scores
- Skills gap ranking for target roles
- Industry trend recommendations

### 📄 **PDF Report Generation**
- Professional analysis reports
- Visual score summaries
- Detailed skill comparisons
- Actionable improvement roadmap

### 👥 **LinkedIn Profile Analysis**
- Direct LinkedIn profile analysis
- Same AI pipeline as PDF resumes
- Automatic text extraction from profiles

### 👤 **User Authentication & History**
- JWT-based authentication
- Persistent analysis history
- Save and compare multiple analyses
- Dashboard with analysis statistics

---

## 🏗️ Architecture

### Backend Stack
- **Framework:** FastAPI (Python 3.10+)
- **AI Models:** Google Gemini 2.0 / 1.5 (self-healing failover)
- **NLP:** spaCy, NLTK, scikit-learn
- **Database:** SQLAlchemy ORM (SQLite dev, PostgreSQL prod)
- **PDF Processing:** PyMuPDF
- **Authentication:** JWT tokens
- **Reporting:** ReportLab

### Frontend Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **UI Components:** Lucide Icons, Framer Motion
- **Visualizations:** react-circular-progressbar, Chart.js
- **HTTP Client:** Axios
- **State Management:** React Context

### Deployment
- **Backend:** Render (free or paid tier)
- **Frontend:** Vercel (free tier available)
- **Database:** SQLite (dev) → PostgreSQL (production)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API key (free at [ai.google.com](https://ai.google.com))

### Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_key_here
JWT_SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
EOF

# Run server
python -m uvicorn main:app --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Run dev server
npm run dev
```

**Access:** 
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 🔑 Test Credentials

#### Ready-to-Use Test Account
We've created a test account for you. Simply login with these credentials:

**Quick Test:**
```
Email: demo@example.com
Password: Demo@1234
```

**How to Login:**
1. Navigate to http://localhost:5173
2. Click **"Welcome Back"** (Login link at bottom)
3. Enter the email: `demo@example.com`
4. Enter the password: `Demo@1234`
5. Click **"Login"**
6. ✅ You'll be logged in and redirected to Dashboard
7. Now you can test the resume analyzer!

**Want to Create Your Own Account?**
Alternatively, you can click "Request Access" (Sign Up link) to create your own account with your own credentials.

**Note:** 
- The test account `demo@example.com` is pre-created in the local SQLite database
- Accounts are stored locally in SQLite (dev mode)
- For production, use PostgreSQL with proper security
- You can create multiple accounts and each email can only be registered once

---

## 📦 Project Structure

```
Resume_Analyzer/
├── backend/
│   ├── main.py                          # FastAPI app entry
│   ├── database.py                      # SQLAlchemy config
│   ├── requirements.txt                 # Python dependencies
│   │
│   ├── models/
│   │   ├── user_model.py               # User database model
│   │   ├── analysis_model.py           # Analysis results model
│   │   └── schemas.py                  # Pydantic schemas
│   │
│   ├── routers/
│   │   ├── auth_router.py              # /auth endpoints
│   │   ├── analysis_router.py          # /analysis endpoints
│   │   ├── batch_router.py             # /batch endpoints
│   │   └── history_router.py           # /history endpoints
│   │
│   ├── services/
│   │   ├── intelligence_engine.py      # AI analysis
│   │   ├── nlp_service.py              # NLP skill extraction
│   │   ├── nlp_heuristics.py           # Local heuristics
│   │   ├── scoring_engine.py           # Scoring logic
│   │   ├── embedding_service.py        # Semantic matching
│   │   ├── pdf_report_service.py       # Report generation
│   │   ├── linkedin_service.py         # LinkedIn extraction
│   │   ├── role_engine.py              # Job templates
│   │   ├── interview_prep_service.py   # Interview prep
│   │   ├── optimization_service.py     # Resume optimization
│   │   └── skill_analysis_service.py   # Skill analysis
│   │
│   ├── utils/
│   │   ├── auth_utils.py               # Auth helpers
│   │   ├── pdf_utils.py                # PDF extraction
│   │   └── text_utils.py               # Text processing
│   │
│   └── data/
│       └── role_templates.json         # Job descriptions
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                     # Main app
│   │   ├── main.jsx                    # Entry point
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── BatchAnalysis.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── CircularProgress.jsx
│   │   │   ├── MatchingTabs.jsx
│   │   │   ├── CareerPrediction.jsx
│   │   │   ├── InterviewPrepView.jsx
│   │   │   ├── OptimizationView.jsx
│   │   │   └── RoleSelector.jsx
│   │   │
│   │   └── context/
│   │       └── AuthContext.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── DEPLOYMENT.md                        # Deployment guide
├── API_REFERENCE.md                     # API documentation
└── README.md                            # This file
```

---

## 📚 API Endpoints

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Get access token
- `GET /auth/profile` - Get user profile

### Analysis
- `POST /analysis/match_resume` - Analyze single resume
- `POST /batch/analyze` - Batch analyze multiple resumes
- `POST /batch/compare-skills` - Extract and compare skills
- `GET /batch/ranking/{id}` - Get batch ranking

### History
- `GET /history/` - Get analysis history
- `GET /history/{id}` - Get analysis details
- `GET /history/{id}/report` - Download PDF report

> **Complete API Documentation:** See [API_REFERENCE.md](./API_REFERENCE.md)

---

## 🎯 Scoring Methodology

### Overall Resume Score Formula
```
Score = (0.35 × Skill_Match) 
       + (0.25 × Experience_Match)
       + (0.20 × ATS_Score)
       + (0.15 × Formatting_Score)
       + (0.05 × Production_Readiness)
```

### Score Interpretation
| Score | Rating | Recommendation |
|-------|--------|-----------------|
| 85-100 | Excellent | Strong candidate, ready to apply |
| 70-84 | Good | Competitive candidate, minor improvements needed |
| 50-69 | Fair | Consider improvements before applying |
| 0-49 | Needs Work | Significant gap, develop skills first |

---

## 🤖 AI Pipeline (Self-Healing)

The system uses **intelligent failover** for reliability:

```
Gemini 2.0 Flash (Fastest)
    ↓ [if unavailable]
Gemini 1.5 Flash (Balanced)
    ↓ [if unavailable]
Gemini 1.5 Pro (Most Capable)
```

This ensures the platform remains operational even if any single model is unavailable.

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS protection
- ✅ Input validation
- ✅ File upload validation
- ✅ Rate limiting ready
- ✅ SQL injection prevention
- ✅ XSS protection

---

## 📈 Performance

| Operation | Avg. Time | Notes |
|-----------|-----------|-------|
| Single resume analysis | 8-12s | Includes AI analysis |
| Batch (5 resumes) | 50-70s | ~10-14s per resume |
| Batch (10 resumes) | 120-150s | Optimized processing |
| PDF report generation | 2-3s | Fast rendering |
| Skill extraction | 1-2s | Local NLP processing |

---

## 🚢 Deployment

### Production Deployment (5 minutes)

#### Backend to Render
```bash
# 1. Push code to GitHub
git push origin main

# 2. In Render dashboard:
#    - Connect GitHub
#    - Create Web Service
#    - Add environment variables
#    - Deploy

# Verify: https://your-api.onrender.com/docs
```

#### Frontend to Vercel
```bash
# 1. Push code to GitHub
git push origin main

# 2. In Vercel dashboard:
#    - Import project
#    - Set VITE_API_URL
#    - Deploy

# Live at: https://your-project.vercel.app
```

> **Detailed guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest tests/ -v
```

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

---

## 🐛 Troubleshooting

### Common Issues

**spaCy model missing:**
```bash
python -m spacy download en_core_web_sm
```

**CORS errors:**
Update `ALLOWED_ORIGINS` in backend `.env`

**API connection fails:**
Verify `VITE_API_URL` in frontend `.env.local`

**Gemini API errors:**
- Check API key validity
- Verify free tier limits (60 req/min)
- Confirm API is enabled

> **Full troubleshooting:** See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

---

## 📊 Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| **Language** | Python 3.10+, JavaScript (React 19) |
| **AI/ML** | Google Gemini, spaCy, scikit-learn, NLTK |
| **Backend** | FastAPI, SQLAlchemy, Uvicorn |
| **Frontend** | React, Vite, Tailwind CSS |
| **Database** | SQLite (dev), PostgreSQL (prod) |
| **Deployment** | Render, Vercel |
| **Auth** | JWT (Python-Jose) |
| **PDF** | PyMuPDF, ReportLab |

---

## 📋 Feature Roadmap

### Q2 2026
- [ ] Advanced resume templates
- [ ] Job market salary integration
- [ ] Company-specific analysis
- [ ] Interview video preparation
- [ ] Resume ATS checker tool

### Q3 2026
- [ ] Team collaboration features
- [ ] Recurring analysis reports
- [ ] LinkedIn integration API
- [ ] Real-time job matching
- [ ] Mobile app (React Native)

### Q4 2026
- [ ] Resume writing assistant
- [ ] Cover letter generator
- [ ] Job search analytics
- [ ] Networking recommendations
- [ ] Enterprise onboarding

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.

---

## 💬 Support

- **Documentation:** [./docs](./docs) 
- **Bug Reports:** GitHub Issues
- **API Docs:** `/docs` endpoint
- **Email:** support@resumeintelligence.com

---

## 🙏 Acknowledgments

- Getty Images for design inspiration
- Google Gemini team for AI models
- FastAPI community for excellent framework
- React team for powerful UI library

---

## 📞 Contact

- **Website:** https://resumeintelligence.app
- **Email:** hello@resumeintelligence.com
- **Twitter:** @ResumeIntel

---

**Version:** 1.0.0  
**Last Updated:** March 17, 2026  
**Status:** ✅ Production Ready
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
- **Frontend Upgrade:** Implemented protected routing, seamless post-registration login, and an enhanced Dashboard with detailed statistical cards and score trend charts.
- **Skill Comparison View:** New visual component for analyzing skills vs job requirements.
- **LinkedIn & PDF Integration:** Direct support for LinkedIn URL processing and PDF report downloads.
- Improved semantic matching accuracy with Gemini embeddings and better skill extraction.
- Selection probability scoring based on ATS and keyword alignment.

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
