import fitz  # PyMuPDF
import logging
from fastapi import UploadFile, HTTPException

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file: UploadFile) -> str:
    try:
        data = file.file.read()
        logger.info(f"PDF raw data size: {len(data)} bytes")
        with fitz.open(stream=data, filetype="pdf") as doc:
            text = ""
            for page in doc:
                text += page.get_text()
            
            clean_text = text.strip()
            logger.info(f"Extracted text length: {len(clean_text)} characters")
            if not clean_text:
                logger.warning("No text extracted from PDF!")
            return clean_text
    except Exception as e:
        logger.error(f"PDF Extraction failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")
