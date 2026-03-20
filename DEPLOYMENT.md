# AI Resume Intelligence Platform - Deployment & Setup Guide

## 📋 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [AI Model Configuration](#ai-model-configuration)
7. [Testing](#testing)
8. [Production Checklist](#production-checklist)

---

## Local Development Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git
- A Google Gemini API key (free tier available at ai.google.com)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy language model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

   Fill in required variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=sqlite:///./resume_analyzer.db
   JWT_SECRET_KEY=your_secure_random_key_here
   ```

6. **Run backend locally:**
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env.local
   ```

   Fill in:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run frontend development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## Backend Deployment (Render)

### Step 1: Prepare Repository

1. Ensure your GitHub repository is up to date with all code changes
2. Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: resume-analyzer-api
    env: python
    region: oregon
    plan: standard
    buildCommand: pip install -r backend/requirements.txt && python -m spacy download en_core_web_sm
    startCommand: cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHONUNBUFFERED
        value: true
      - key: GEMINI_API_KEY
        sync: false
      - key: JWT_SECRET_KEY
        sync: false
      - key: DATABASE_URL
        sync: false

  - type: web
    name: resume-analyzer-frontend
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm run preview
    staticSite: dist
    envVars:
      - key: VITE_API_URL
        value: https://your-backend-url.onrender.com
```

### Step 2: Create Render Account & Web Service

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Create a new Web Service:
   - Name: `resume-analyzer-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r backend/requirements.txt && python -m spacy download en_core_web_sm`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Configure Environment Variables

In Render dashboard:

```
GEMINI_API_KEY = [your key from ai.google.com]
JWT_SECRET_KEY = [generate: python -c "import secrets; print(secrets.token_urlsafe(32))"]
DATABASE_URL = sqlite:///./resume_analyzer.db (development)
```

For production PostgreSQL:
```
DATABASE_URL = postgresql://user:password@host:5432/dbname
```

### Step 4: First Deploy

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. Render auto-deploys from GitHub

3. Verify deployment at `https://your-api.onrender.com/docs`

### Backend Health Check

```bash
curl https://your-api.onrender.com/auth/profile
# Should return 401 (unauthorized) - expected
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update build configuration in `vite.config.js`:

```javascript
export default {
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
  }
}
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Import your GitHub repository
3. Configure build settings:
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend`

### Step 3: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-api.onrender.com
```

### Step 4: Deploy

1. Push to GitHub:
   ```bash
   git push origin main
   ```

2. Vercel automatically deploys

3. Your frontend will be live at `your-project.vercel.app`

### Update Frontend API URLs

After deployment, if needed, add custom domain in Vercel settings.

---

## Environment Configuration

### Backend (.env)

```env
# API
ENVIRONMENT=production
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resume_db

# Security
JWT_SECRET_KEY=your-secure-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google Gemini AI
GEMINI_API_KEY=your-gemini-key-here
GEMINI_MODEL_PRIMARY=gemini-2.0-flash
GEMINI_MODEL_FALLBACK=gemini-1.5-flash
GEMINI_MODEL_FALLBACK_2=gemini-1.5-pro

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://localhost:3000

# File Upload
MAX_UPLOAD_SIZE=10485760  # 10MB
```

### Frontend (.env.local)

```env
VITE_API_URL=https://your-api-url.onrender.com
VITE_APP_NAME=Resume Intelligence Platform
VITE_LOG_LEVEL=warn
```

---

## Database Setup

### SQLite (Development)

```bash
# Automatic with SQLAlchemy
# Database file: backend/resume_analyzer.db
```

### PostgreSQL (Production)

1. **Create database:**
   ```sql
   CREATE DATABASE resume_analyzer;
   CREATE USER analyzer WITH PASSWORD 'secure_password';
   ALTER ROLE analyzer SET client_encoding TO 'utf8';
   ALTER ROLE analyzer SET default_transaction_isolation TO 'read committed';
   ALTER ROLE analyzer SET default_transaction_deferrable TO on;
   GRANT ALL PRIVILEGES ON DATABASE resume_analyzer TO analyzer;
   ```

2. **Update .env:**
   ```env
   DATABASE_URL=postgresql://analyzer:secure_password@localhost:5432/resume_analyzer
   ```

3. **Run migrations** (if using Alembic):
   ```bash
   alembic upgrade head
   ```

4. **Initialize schema:**
   ```python
   from database import engine, Base
   Base.metadata.create_all(bind=engine)
   ```

---

## AI Model Configuration

### Gemini API Setup

1. **Get API Key:**
   - Visit [ai.google.com](https://ai.google.com)
   - Click "Get API Key"
   - Create API key from Google AI Studio

2. **Add to Backend:**
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Model Fallback Strategy:**

The system automatically falls back through:
1. Gemini 2.0 Flash (fastest)
2. Gemini 1.5 Flash
3. Gemini 1.5 Pro (most capable)

This ensures reliability if one model is unavailable.

---

## Testing

### Backend Tests

```bash
# Navigate to backend
cd backend

# Run unit tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=services --cov=routers

# Test specific endpoint
pytest tests/test_analysis.py -v
```

### Manual API Testing

```bash
# Health check
curl http://localhost:8000/docs

# Signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=testpass123"

# Test Resume Analysis
curl -X POST http://localhost:8000/analysis/match_resume \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@resume.pdf" \
  -F "job_description=Senior Python Developer..."
```

### Frontend Tests

```bash
# Navigate to frontend
cd frontend

# Run lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Production Checklist

### Security
- [ ] Change all default secrets and passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up CORS whitelist for frontend domain
- [ ] Enable JWT token expiration
- [ ] Rate limit API endpoints
- [ ] Sanitize user inputs
- [ ] Validate file uploads (size, type)
- [ ] Use environment variables for all secrets

### Performance
- [ ] Enable database connection pooling
- [ ] Cache role embeddings
- [ ] Compress API responses
- [ ] Minify frontend assets
- [ ] Enable CDN for static files
- [ ] Set up database indexes
- [ ] Monitor API response times

### Monitoring
- [ ] Set up error logging (Sentry, etc.)
- [ ] Monitor API availability
- [ ] Track database performance
- [ ] Log authentication attempts
- [ ] Monitor file upload volume
- [ ] Setup alerts for failed jobs

### Backup & Recovery
- [ ] Enable database automated backups
- [ ] Test backup restoration
- [ ] Document disaster recovery plan
- [ ] Version control all code
- [ ] Document API changes

### Compliance
- [ ] Add privacy policy
- [ ] Document data retention
- [ ] Implement user data deletion
- [ ] Add terms of service
- [ ] Document GDPR compliance
- [ ] Implement audit logging

---

## Troubleshooting

### Backend Issues

**spaCy model not found:**
```bash
python -m spacy download en_core_web_sm
```

**CORS errors:**
Update `ALLOWED_ORIGINS` in backend .env:
```env
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

**Database connection failed:**
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection: psql postgresql://user:password@localhost:5432/dbname
```

**Gemini API errors:**
- Verify API key is correct
- Check rate limits (free tier: 60 requests/min)
- Ensure API is enabled in Google Cloud

### Frontend Issues

**API 404 errors:**
Verify `VITE_API_URL` in `.env.local` matches deployed backend URL

**Build errors:**
```bash
npm install
npm run build
```

**Deployment stuck:**
Clear Vercel cache and redeploy

---

## Support & Resources

- **Gemini API Docs:** https://ai.google.dev
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **React Docs:** https://react.dev
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## Quick Deploy Summary

### For Render (Backend):

```bash
# 1. Connect GitHub to Render
# 2. Create Web Service
# 3. Add environment variables
# 4. Deploy
```

### For Vercel (Frontend):

```bash
# 1. Connect GitHub to Vercel
# 2. Set build settings
# 3. Add environment variables
# 4. Deploy
```

**Total setup time:** ~15-20 minutes

---

## Version History

- **v1.0.0** - Initial production release
  - User authentication with JWT
  - Resume analysis with Gemini AI
  - NLP skill extraction
  - Batch resume analysis
  - PDF report generation
  - LinkedIn profile analysis

---

**Last updated:** March 2026
**Next review:** June 2026
