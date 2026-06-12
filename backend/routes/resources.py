# Resources route — returns curated college prep resources filtered by grade
from fastapi import APIRouter
from db.supabase import supabase

router = APIRouter()

@router.get("/resources")
def get_resources(grade: int):
    # Only return resources tagged for the student's current grade level
    resources = supabase.table("resources").select("*").eq("grade", grade).execute()
    return resources.data
