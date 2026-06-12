from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from services.rag import query_knowledge_base
import os

router = APIRouter()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

class ChatRequest(BaseModel):
    question: str
    grade: int

@router.post("/chat")
def chat(body: ChatRequest):
    chunks = query_knowledge_base(body.question)
    context = "\n\n".join(chunks)
    
    prompt = f"""You are a college prep assistant helping a grade {body.grade} high school student.
Use the following resources to answer their question. Be encouraging and specific.

Resources:
{context}

Student question: {body.question}"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return {"answer": response.text}