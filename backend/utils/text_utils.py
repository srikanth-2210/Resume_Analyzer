import re
import logging

logger = logging.getLogger(__name__)

def clean_text(text: str) -> str:
    """Basic text cleaning utility"""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()
