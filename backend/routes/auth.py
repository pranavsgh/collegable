from fastapi import APIRouter
from pydantic import BaseModel
from db.supabase import supabase

router = APIRouter()

class AuthRequest(BaseModel):
    email: str
    password: str

@router.post("/auth/signup")
def signup(body: AuthRequest):
    response = supabase.auth.sign_up({
        "email": body.email,
        "password": body.password
    })
    return {"message": "Signup successful", "user": response.user.email}

@router.post("/auth/login")
def login(body: AuthRequest):
    response = supabase.auth.sign_in_with_password({
        "email": body.email,
        "password": body.password
    })
    return {"token": response.session.access_token, "user": response.user.email}

@router.post("/auth/logout")
def logout():
    supabase.auth.sign_out()
    return {"message": "Logged out"}