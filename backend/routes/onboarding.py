# Onboarding route — saves the student's initial profile answers after they complete the quiz
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from db.supabase import supabase
from middleware.auth import get_current_user
import uuid

router = APIRouter()


# Mirrors the fields collected by the onboarding quiz on the frontend
class OnboardingRequest(BaseModel):
    grade: int
    gpa_range: str
    interests: List[str]
    first_gen: bool
    goals: str


@router.post("/onboarding")
def onboarding(body: OnboardingRequest, current_user=Depends(get_current_user)):
    user_id = current_user.id
    # Generate a roadmap ID so the frontend can deep-link to the personalized roadmap later
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
