from fastapi import APIRouter
from db.supabase import supabase

router = APIRouter()

@router.get("/resources")
def get_resources(grade: int):
    resources = supabase.table("resources").select("*").eq("grade", grade).execute()
    return resources.data