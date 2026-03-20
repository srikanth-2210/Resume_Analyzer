@echo off
REM 🚀 Quick Start Script - Resume Intelligence Platform (Windows)

echo.
echo ================================
echo Resume Intelligence Platform
echo Quick Setup ^& Launch Guide
echo ================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Install Python 3.10+
    pause
    exit /b 1
)
echo ✅ Python found

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Install Node.js 18+
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo 🔧 Setting up Backend...

cd backend

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Download spaCy model
echo Downloading spaCy language model...
python -m spacy download en_core_web_sm

REM Create .env file
echo Creating .env file...
if not exist .env (
    (
        echo # 🔑 Get your API key from https://ai.google.com
        echo GEMINI_API_KEY=your_api_key_here
        echo.
        echo # 🔐 JWT Secret
        echo JWT_SECRET_KEY=your-secret-key-here-min-32-chars
        echo.
        echo # 📁 Database
        echo DATABASE_URL=sqlite:///./resume_analyzer.db
        echo.
        echo # ⏱️ Token expiration
        echo ACCESS_TOKEN_EXPIRE_MINUTES=10080
    ) > .env
    echo ✅ .env file created
) else (
    echo ⚠️  .env file already exists
)

cd ..

echo.
echo 🌐 Setting up Frontend...

cd frontend

REM Install dependencies
echo Installing Node dependencies...
call npm install

REM Create .env.local
echo Creating .env.local...
if not exist .env.local (
    echo VITE_API_URL=http://localhost:8000 > .env.local
    echo ✅ .env.local file created
) else (
    echo ⚠️  .env.local file already exists
)

cd ..

echo.
echo ✨ Setup Complete!
echo.
echo Ready to launch! Run these commands in separate terminals:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate.bat
echo   python -m uvicorn main:app --reload
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then visit:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo ✅ Happy coding!
echo.
pause
