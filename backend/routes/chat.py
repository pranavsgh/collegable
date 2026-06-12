# Chat route — handles a single question/answer turn with Cali, the AI college advisor
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

# Single Gemini client shared across all requests in this process
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


class ChatRequest(BaseModel):
    # question is capped at 500 chars to keep prompts manageable and prevent abuse
    question: str = Field(..., min_length=1, max_length=500)
    # grade is used to tailor Cali's advice to the student's year in school (9–12)
    grade: int = Field(..., ge=9, le=12)
    # session_id groups messages into a conversation thread; must be a valid UUID
    session_id: str

    @field_validator("question")
    @classmethod
    def strip_question(cls, v):
        # Remove leading/trailing whitespace before any length or content checks
        return v.strip()

    @field_validator("session_id")
    @classmethod
    def validate_session_id(cls, v):
        # Reject non-UUID strings to prevent injection of arbitrary filter values
        try:
            uuid.UUID(v)
        except ValueError:
            raise ValueError("session_id must be a valid UUID")
        return v


@router.post("/chat")
def chat(body: ChatRequest, current_user=Depends(get_current_user)):
    user_id = current_user.id

    # Enforce the sliding-window rate limit before doing any expensive work
    check_chat_rate(user_id)

    # Fetch the last 6 turns of this session to give Cali short-term memory
    history_res = supabase.table("chat_history") \
        .select("role, message") \
        .eq("user_id", user_id) \
        .eq("session_id", body.session_id) \
        .order("created_at", desc=False) \
        .limit(6) \
        .execute()

    history = history_res.data or []

    # Format history as a plain-text transcript so Gemini can read prior context
    history_text = ""
    for msg in history:
        label = "Student" if msg["role"] == "user" else "Cali"
        history_text += f"{label}: {msg['message']}\n"

    # Retrieve semantically similar chunks from the knowledge base via Pinecone
    chunks = query_knowledge_base(body.question)
    context = "\n\n".join(chunks)

    # System prompt that defines Cali's voice and injects the retrieved context
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

    # Call Gemini to generate Cali's response
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    answer = response.text

    # Persist both sides of the turn so future requests can include this context
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
