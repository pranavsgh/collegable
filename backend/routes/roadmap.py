# Roadmap route — fetches a student's onboarding answers by roadmap ID
from fastapi import APIRouter
from db.supabase import supabase

router = APIRouter()

@router.get("/roadmap/{roadmap_id}")
def get_roadmap(roadmap_id: str):
    # Look up the onboarding record that was created when the student finished the quiz
    data = supabase.table("onboarding_answers").select("*").eq("id", roadmap_id).execute()
    return data.data
