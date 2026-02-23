@echo off
echo Starting AI Resume Matcher Backend...
cd /d "%~dp0"

if not exist ..\venv (
    echo Creating virtual environment...
    python -m venv ..\venv
)

call ..\venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo Starting Server...
uvicorn main:app --reload
pause
