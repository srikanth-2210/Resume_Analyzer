@echo off
echo Starting AI Resume Matcher Backend...
cd /d "%~dp0"

if not exist ..\venv2 (
    echo Creating virtual environment...
    python -m venv ..\venv2
)

call ..\venv2\Scripts\activate

echo Installing dependencies...
python -m pip install -r requirements.txt

echo Starting Server...
python -m uvicorn main:app --reload
pause
