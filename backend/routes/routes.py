from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import resend
from dotenv import load_dotenv
import os

from utils.gimini import generate_email_from_prompt
resend.api_key = os.getenv('EMAIL_TOKEN')
router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str
    # recipients: List[EmailStr] = []

class GenerateResponse(BaseModel):
    subject: str
    body: str


# sending prompt ot gimini...
@router.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    try:
        resp = generate_email_from_prompt(req.prompt)
        return resp
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
