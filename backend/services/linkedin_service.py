import httpx
from bs4 import BeautifulSoup
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class LinkedInService:
    async def extract_profile_text(self, linkedin_url: str) -> str:
        """
        Extracts text from a public LinkedIn profile URL.
        Note: LinkedIn actively blocks automated scraping. This is a best-effort 
        approach using standard HTTP requests and BeautifulSoup. In a full production 
        environment, a dedicated API (like Proxycurl or Nubela) would be used.
        """
        try:
            # Add headers to simulate a normal browser request
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            }
            
            async with httpx.AsyncClient(headers=headers, follow_redirects=True, timeout=10.0) as client:
                response = await client.get(linkedin_url)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract all textual content
                # For public linkedin profiles, relevant details are in the main body
                text_content = soup.get_text(separator=' ', strip=True)
                
                if not text_content or len(text_content) < 50:
                    logger.warning("Very little text extracted from LinkedIn. Profile might be private or extraction blocked.")
                    raise HTTPException(status_code=400, detail="Could not extract sufficient data from LinkedIn profile. Please try uploading the LinkedIn exported PDF instead.")
                    
                return text_content
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP Error while fetching LinkedIn profile: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Failed to fetch LinkedIn profile: {str(e)}")
        except Exception as e:
            logger.error(f"Error extracting LinkedIn profile: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal error while processing LinkedIn profile.")
