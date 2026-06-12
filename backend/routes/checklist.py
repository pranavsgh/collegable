from fastapi import APIRouter, Depends
from db.supabase import supabase
from middleware.auth import get_current_user

router = APIRouter()


@router.get("/checklist")
def get_checklist(current_user=Depends(get_current_user)):
    user_id = current_user.id
    progress = supabase.table("user_progress").select("*, checklist_items(*)").eq("user_id", user_id).execute()
    return progress.data


@router.patch("/checklist/{item_id}")
def update_checklist(item_id: str, completed: bool, current_user=Depends(get_current_user)):
    user_id = current_user.id
    supabase.table("user_progress").update({"completed": completed}) \
        .eq("item_id", item_id) \
        .eq("user_id", user_id) \
        .execute()
    return {"message": "Updated"}
