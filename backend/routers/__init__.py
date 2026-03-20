from fastapi import APIRouter
from .auth_router import router as auth_router
from .analysis_router import router as analysis_router
from .history_router import router as history_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(analysis_router)
api_router.include_router(history_router)
