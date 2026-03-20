from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models.user_model import User
from models.analysis_model import Analysis
from routers.auth_router import get_current_user
from services.pdf_report_service import PDFReportService

router = APIRouter(
    prefix="/history",
    tags=["History"]
)

pdf_service = PDFReportService()

@router.get("/")
def get_user_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).all()
    
    results = []
    for a in analyses:
        results.append({
            "id": a.id,
            "resume_filename": a.resume_filename,
            "match_score": a.match_score,
            "created_at": a.created_at.isoformat() if a.created_at else None
        })
    return {"history": results}

@router.get("/{analysis_id}")
def get_analysis_detail(analysis_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    return analysis.analysis_result_json

@router.get("/{analysis_id}/report")
def download_pdf_report(analysis_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    pdf_buffer = pdf_service.generate_report(analysis.analysis_result_json)
    
    headers = {
        'Content-Disposition': f'attachment; filename="Resume_Report_{analysis_id}.pdf"'
    }
    
    return StreamingResponse(pdf_buffer, headers=headers, media_type='application/pdf')
