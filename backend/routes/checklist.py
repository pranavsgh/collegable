# Checklist routes — read and update the user's task completion state
from fastapi import APIRouter, Depends
from db.supabase import supabase
from middleware.auth import get_current_user

router = APIRouter()


@router.get("/checklist")
def get_checklist(current_user=Depends(get_current_user)):
    user_id = current_user.id
    # Join user_progress with checklist_items so the client gets task details alongside completion state
    progress = supabase.table("user_progress").select("*, checklist_items(*)").eq("user_id", user_id).execute()
    return progress.data


@router.patch("/checklist/{item_id}")
def update_checklist(item_id: str, completed: bool, current_user=Depends(get_current_user)):
    user_id = current_user.id
    # Scoped by both item_id and user_id so users can't toggle other people's tasks
    supabase.table("user_progress").update({"completed": completed}) \
        .eq("item_id", item_id) \
        .eq("user_id", user_id) \
        .execute()
    return {"message": "Updated"}
