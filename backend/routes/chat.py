from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field, field_validator
from google import genai
from services.rag import query_knowledge_base
from db.supabase import supabase
from middleware.auth import get_current_user
from middleware.rate_limit import check_chat_rate
import os
import uuid

router = APIRouter()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    grade: int = Field(..., ge=9, le=12)
    session_id: str

    @field_validator("question")
    @classmethod
    def strip_question(cls, v):
        return v.strip()

    @field_validator("session_id")
    @classmethod
    def validate_session_id(cls, v):
        try:
            uuid.UUID(v)
        except ValueError:
            raise ValueError("session_id must be a valid UUID")
        return v


@router.post("/chat")
def chat(body: ChatRequest, current_user=Depends(get_current_user)):
    user_id = current_user.id

    check_chat_rate(user_id)

    history_res = supabase.table("chat_history") \
        .select("role, message") \
        .eq("user_id", user_id) \
        .eq("session_id", body.session_id) \
        .order("created_at", desc=False) \
        .limit(6) \
        .execute()

    history = history_res.data or []

    history_text = ""
    for msg in history:
        label = "Student" if msg["role"] == "user" else "Cali"
        history_text += f"{label}: {msg['message']}\n"

    chunks = query_knowledge_base(body.question)
    context = "\n\n".join(chunks)

    prompt = f"""You are Cali, a college prep guide built into Collegable — a free platform for high school students figuring out college on their own.

Your personality:
- Talk like a knowledgeable older friend, not a textbook or a counselor
- Be direct and real. Skip the hype, fake enthusiasm, and filler phrases like "Great question!" or "Absolutely!"
- Keep answers short and scannable. Use bullet points only when listing actual steps or items
- Never use headers with ### or bold titles mid-response — just talk
- If a student seems stressed or lost, acknowledge it briefly then get to the point
- You are talking to a {body.grade}th grade student — adjust your language and advice to their stage
- If something is urgent for their grade, say so clearly
- Never lecture. Never repeat yourself. Never pad your answer
- Remember what the student has already said in this conversation and reference it naturally

Knowledge:
{context}

Previous conversation:
{history_text}
Student: {body.question}

Cali:"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    answer = response.text

    supabase.table("chat_history").insert({
        "user_id": user_id,
        "session_id": body.session_id,
        "role": "user",
        "message": body.question
    }).execute()

    supabase.table("chat_history").insert({
        "user_id": user_id,
        "session_id": body.session_id,
        "role": "assistant",
        "message": answer
    }).execute()

    return {"answer": answer}
