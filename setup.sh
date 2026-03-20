#!/bin/bash
# 🚀 Quick Start Script - Resume Intelligence Platform

echo "================================"
echo "Resume Intelligence Platform"
echo "Quick Setup & Launch Guide"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}📋 Checking prerequisites...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Install Python 3.10+"
    exit 1
fi
echo "✅ Python 3 found"

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install Node.js 18+"
    exit 1
fi
echo "✅ Node.js found"

echo ""
echo "${BLUE}🔧 Setting up Backend...${NC}"

# Navigate to backend
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Download spaCy model
echo "Downloading spaCy language model..."
python -m spacy download en_core_web_sm

# Create .env file
echo "Creating .env file..."
if [ ! -f .env ]; then
    cat > .env << EOF
# 🔑 Get your API key from https://ai.google.com
GEMINI_API_KEY=your_api_key_here

# 🔐 Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
JWT_SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")

# 📁 Database
DATABASE_URL=sqlite:///./resume_analyzer.db

# ⏱️ Token expiration
ACCESS_TOKEN_EXPIRE_MINUTES=10080
EOF
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists"
fi

echo ""
echo "${BLUE}🌐 Setting up Frontend...${NC}"

# Navigate to frontend
cd ../frontend

# Install dependencies
echo "Installing Node dependencies..."
npm install

# Create .env.local
echo "Creating .env.local..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
VITE_API_URL=http://localhost:8000
EOF
    echo "✅ .env.local file created"
else
    echo "⚠️  .env.local file already exists"
fi

echo ""
echo "${BLUE}✨ Setup Complete!${NC}"
echo ""
echo "${GREEN}Ready to launch! Run these commands:${NC}"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python -m uvicorn main:app --reload"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "${YELLOW}Then visit:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "${GREEN}✅ Happy coding!${NC}"
