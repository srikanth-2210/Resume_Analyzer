# API Reference - Resume Intelligence Platform

## Base URL

- **Development:** `http://localhost:8000`
- **Production:** `https://your-api.onrender.com`

## Authentication

All endpoints (except signup/login) require Bearer token authentication:

```bash
Authorization: Bearer {access_token}
```

---

## Authentication Endpoints

### POST /auth/signup

**Create a new user account**

```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

**Errors:**
- 400: Email already registered

---

### POST /auth/login

**Authenticate and get access token**

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePassword123!"
```

**Request Form Data:**
```
username: user@example.com
password: SecurePassword123!
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- 401: Incorrect email or password

---

### GET /auth/profile

**Get current user profile**

```bash
curl -X GET http://localhost:8000/auth/profile \
  -H "Authorization: Bearer {token}"
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

---

## Resume Analysis Endpoints

### POST /analysis/match_resume

**Analyze single resume against job description**

```bash
curl -X POST http://localhost:8000/analysis/match_resume \
  -H "Authorization: Bearer {token}" \
  -F "resume=@resume.pdf" \
  -F "job_description=Senior Python Developer..." \
  -F "role_template=Custom"
```

**Request:**
- `resume` (File, required): Resume PDF
- `job_description` (String, optional): Job description text
- `role_template` (String, optional): Predefined role (Data Scientist, ML Engineer, etc.)
- `linkedin_url` (String, optional): LinkedIn profile URL (instead of resume)

**Response (200):**
```json
{
  "id": 123,
  "match_score": 82.5,
  "overall_score": 78.3,
  "ats_score": 85,
  "skills_score": 82,
  "experience_score": 75,
  "readability_score": 80,
  "summary": "Strong match with 82.5% alignment to requirements...",
  "strengths": ["Python", "FastAPI", "Docker", "AWS"],
  "missing_skills": ["Kubernetes", "GraphQL"],
  "skill_gap_ranking": [
    {
      "skill": "Kubernetes",
      "importance": "high",
      "reason": "Critical for microservices... "
    }
  ],
  "skill_comparison": [
    {"skill": "Python", "status": "Match"},
    {"skill": "Docker", "status": "Match"},
    {"skill": "Kubernetes", "status": "Missing"}
  ],
  "optimized_bullets": [
    "Architected scalable microservices using FastAPI and Docker, reducing deployment time by 40%"
  ],
  "selection_intelligence": {
    "probability_score": 85,
    "tier": "High",
    "recruiter_hooks": ["Led team of 5 engineers", "Built system for 100K+ users"],
    "priority_action_plan": ["Add Kubernetes experience", "Quantify impact metrics"]
  },
  "career_fit_prediction": [
    {"role": "ML Engineer", "confidence": 87.2},
    {"role": "Data Scientist", "confidence": 79.3},
    {"role": "DevOps Engineer", "confidence": 72.1}
  ],
  "interview_intelligence": {
    "behavioral_questions": ["Tell me about a time you led a technical project..."],
    "technical_questions": ["Explain system design for a real-time event processor"],
    "role_specific_challenges": ["Design a scalable microservices architecture"]
  }
}
```

**Errors:**
- 400: Invalid resume or job description
- 401: Unauthorized
- 500: Analysis failed

---

### POST /batch/analyze

**Analyze multiple resumes in batch**

```bash
curl -X POST http://localhost:8000/batch/analyze \
  -H "Authorization: Bearer {token}" \
  -F "resumes=@resume1.pdf" \
  -F "resumes=@resume2.pdf" \
  -F "resumes=@resume3.pdf" \
  -F "job_description=Senior Python Developer..."
```

**Request:**
- `resumes` (File[], required): Multiple resume PDFs
- `job_description` (String, required): Job description text

**Response (200):**
```json
{
  "total_analyzed": 3,
  "total_errors": 0,
  "results": [
    {
      "rank": 1,
      "filename": "alice_resume.pdf",
      "analysis_id": 125,
      "match_score": 87.5,
      "overall_score": 85.2,
      "skills_score": 88,
      "experience_score": 82,
      "ats_score": 86,
      "readability_score": 85,
      "selection_probability": 88,
      "summary": "Excellent fit for the role...",
      "matched_skills_count": 12,
      "missing_skills_count": 2,
      "total_jd_skills": 14,
      "top_missing_skills": ["Kubernetes"],
      "matched_skills": ["Python", "FastAPI", "Docker", "AWS"]
    },
    {
      "rank": 2,
      "filename": "bob_resume.pdf",
      "analysis_id": 126,
      "match_score": 76.3,
      "overall_score": 73.8,
      ...
    }
  ],
  "job_description_summary": {
    "skills_count": 14,
    "top_skills": ["Python", "FastAPI", "Docker", "AWS", "PostgreSQL"]
  }
}
```

---

### POST /batch/compare-skills

**Extract and compare skills for a single resume**

```bash
curl -X POST http://localhost:8000/batch/compare-skills \
  -H "Authorization: Bearer {token}" \
  -F "resume=@resume.pdf" \
  -F "job_description=Senior Python Developer..."
```

**Response (200):**
```json
{
  "resume_skills": {
    "total": 15,
    "by_category": {
      "Programming": ["Python", "JavaScript", "SQL"],
      "Cloud": ["AWS", "Docker"],
      "Machine Learning": ["TensorFlow", "Pandas"]
    },
    "all_skills": ["Python", "JavaScript", "SQL", ...]
  },
  "job_description_skills": {
    "total": 14,
    "by_category": {
      "Programming": ["Python", "SQL"],
      "Cloud": ["AWS", "Docker", "Kubernetes"]
    }
  },
  "skill_gap_analysis": {
    "matched": ["Python", "AWS", "Docker"],
    "partial": ["SQL"],
    "missing": ["Kubernetes", "GraphQL"],
    "match_percentage": 78.5,
    "matched_count": 3,
    "missing_count": 2,
    "total_jd_skills": 14
  },
  "comparison": [
    {"skill": "Python", "status": "Match"},
    {"skill": "Kubernetes", "status": "Missing"},
    {"skill": "GraphQL", "status": "Missing"}
  ]
}
```

---

## History & Reports Endpoints

### GET /history

**Get user's analysis history**

```bash
curl -X GET http://localhost:8000/history/ \
  -H "Authorization: Bearer {token}"
```

**Response (200):**
```json
{
  "history": [
    {
      "id": 123,
      "resume_filename": "resume.pdf",
      "match_score": 82.5,
      "created_at": "2024-03-17T10:30:00"
    },
    {
      "id": 122,
      "resume_filename": "resume_v2.pdf",
      "match_score": 79.3,
      "created_at": "2024-03-16T14:20:00"
    }
  ]
}
```

---

### GET /history/{analysis_id}

**Get detailed analysis results**

```bash
curl -X GET http://localhost:8000/history/123 \
  -H "Authorization: Bearer {token}"
```

**Response (200):** Same as match_resume response

---

### GET /history/{analysis_id}/report

**Download PDF analysis report**

```bash
curl -X GET http://localhost:8000/history/123/report \
  -H "Authorization: Bearer {token}" \
  -o report.pdf
```

**Response:** PDF file (application/pdf)

---

### GET /batch/ranking/{analysis_id}

**Get ranking of resume in its batch**

```bash
curl -X GET http://localhost:8000/batch/ranking/125 \
  -H "Authorization: Bearer {token}"
```

**Response (200):**
```json
{
  "total_resumes": 5,
  "your_rank": 1,
  "your_score": 87.5,
  "top_score": 87.5,
  "percentile": 100
}
```

---

## Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Analysis completed |
| 201 | Created | User account created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not Found | Analysis ID doesn't exist |
| 500 | Server Error | AI API failure |

---

## Error Response Format

```json
{
  "error": "Human-readable error message",
  "details": "Additional technical details (optional)"
}
```

---

## Rate Limits

- **Free Tier:** 10 requests/minute per user
- **Pro Tier:** 100 requests/minute per user

---

## Batch Analysis Performance

| Resumes | Avg. Time | Notes |
|---------|-----------|-------|
| 1 | 8-12 sec | Single fast analysis |
| 5 | 40-60 sec | ~10-12 sec per resume |
| 10 | 90-120 sec | Parallel processing |
| 50+ | 10+ min | Consider async job |

---

## SDK Examples

### Python

```python
import requests

API_URL = "http://localhost:8000"
TOKEN = "your_access_token"

# Login
response = requests.post(
    f"{API_URL}/auth/login",
    data={"username": "user@example.com", "password": "password"}
)
token = response.json()["access_token"]

# Analyze resume
with open("resume.pdf", "rb") as f:
    response = requests.post(
        f"{API_URL}/analysis/match_resume",
        headers={"Authorization": f"Bearer {token}"},
        files={"resume": f},
        data={
            "job_description": "Senior Python Developer..."
        }
    )
    
results = response.json()
print(f"Match Score: {results['match_score']}%")
```

### JavaScript

```javascript
const API_URL = 'http://localhost:8000';

// Login
const loginRes = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=user@example.com&password=password'
});
const { access_token } = await loginRes.json();

// Analyze resume
const formData = new FormData();
formData.append('resume', resumeFile);
formData.append('job_description', jobDescription);

const analysisRes = await fetch(`${API_URL}/analysis/match_resume`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${access_token}` },
  body: formData
});

const results = await analysisRes.json();
console.log(`Match Score: ${results.match_score}%`);
```

---

## Webhooks (Upcoming)

Subscribe to analysis completion events:

```bash
POST /webhooks/subscribe
{
  "event": "analysis.completed",
  "url": "https://your-server.com/webhook"
}
```

---

**API Documentation Version:** 1.0  
**Last Updated:** March 2026  
**Next Update:** June 2026
