from fastapi import APIRouter
from db.supabase import supabase

router = APIRouter()

@router.get("/checklist/{user_id}")
def get_checklist(user_id: str):
    progress = supabase.table("user_progress").select("*, checklist_items(*)").eq("user_id", user_id).execute()
    return progress.data

@router.patch("/checklist/{item_id}")
def update_checklist(item_id: str, completed: bool):
    supabase.table("user_progress").update({"completed": completed}).eq("item_id", item_id).execute()
    return {"message": "Updated"}