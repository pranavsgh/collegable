from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from db.supabase import supabase
from middleware.auth import get_current_user
import uuid

router = APIRouter()


class OnboardingRequest(BaseModel):
    grade: int
    gpa_range: str
    interests: List[str]
    first_gen: bool
    goals: str


@router.post("/onboarding")
def onboarding(body: OnboardingRequest, current_user=Depends(get_current_user)):
    user_id = current_user.id
    roadmap_id = str(uuid.uuid4())
    supabase.table("onboarding_answers").insert({
        "user_id": user_id,
        "grade": body.grade,
        "gpa_range": body.gpa_range,
        "interests": body.interests,
        "first_gen": body.first_gen,
        "goals": body.goals,
    }).execute()
    return {"message": "Onboarding complete", "roadmap_id": roadmap_id}
