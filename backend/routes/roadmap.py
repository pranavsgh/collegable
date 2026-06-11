from fastapi import APIRouter
from db.supabase import supabase

router = APIRouter()

@router.get("/roadmap/{roadmap_id}")
def get_roadmap(roadmap_id: str):
    data = supabase.table("onboarding_answers").select("*").eq("id", roadmap_id).execute()
    return data.data