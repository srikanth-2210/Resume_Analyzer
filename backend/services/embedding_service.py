import google.generativeai as genai
import numpy as np
from typing import List, Dict

class EmbeddingService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=self.api_key)

    def generate_embedding(self, text: str) -> List[float]:
        if not self.api_key:
            print("CRITICAL: GEMINI_API_KEY is missing in EmbeddingService!")
            return []
            
        if not text or len(text.strip()) == 0:
            print("WARNING: Empty text provided for embedding.")
            return []

        try:
            # Clean text (remove common embedding issues)
            cleaned_text = text.replace("\x00", "") 
            
            result = genai.embed_content(
                model="models/gemini-embedding-001",
                content=cleaned_text,
                task_type="retrieval_document"
            )
            
            if 'embedding' in result:
                return result['embedding']
            else:
                print(f"ERROR: No embedding field in Gemini response: {result}")
                return []
        except Exception as e:
            print(f"EXCEPTION generating embedding: {str(e)}")
            # Try fallback model if -004 fails
            try:
                print("Attempting fallback to models/embedding-001...")
                result = genai.embed_content(
                    model="models/embedding-001",
                    content=text,
                    task_type="retrieval_document"
                )
                return result['embedding']
            except Exception as e2:
                print(f"CRITICAL: All embedding models failed. Error: {e2}")
                return []

    def compute_cosine_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        if not embedding1 or not embedding2:
            return 0.0
        
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)
        
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
            
        return float(dot_product / (norm1 * norm2))

    def get_semantic_match_report(self, resume_text: str, jd_text: str) -> Dict:
        resume_embedding = self.generate_embedding(resume_text)
        jd_embedding = self.generate_embedding(jd_text)
        
        overall_match = self.compute_cosine_similarity(resume_embedding, jd_embedding)
        
        # Simplified section-wise match logic for demonstration
        # In a real production app, we would extract sections (Skills, Experience, etc.) first.
        # Here we mock them for now.
        return {
            "overall_match": round(overall_match * 100, 2),
            "skill_match": round(overall_match * 0.95 * 100, 2), # Simplified
            "experience_match": round(overall_match * 0.9 * 100, 2), # Simplified
            "tool_match": round(overall_match * 0.85 * 100, 2) # Simplified
        }
