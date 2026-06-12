# Auth routes — thin wrappers around Supabase's built-in email/password auth
from fastapi import APIRouter
from pydantic import BaseModel
from db.supabase import supabase

router = APIRouter()

# Shared request body used by both signup and login
class AuthRequest(BaseModel):
    email: str
    password: str


@router.post("/auth/signup")
def signup(body: AuthRequest):
    # Delegates account creation to Supabase; email confirmation is handled by their service
    response = supabase.auth.sign_up({
        "email": body.email,
        "password": body.password
    })
    return {"message": "Signup successful", "user": response.user.email}


@router.post("/auth/login")
def login(body: AuthRequest):
    # Returns a short-lived JWT that the frontend stores and sends as Bearer token
    response = supabase.auth.sign_in_with_password({
        "email": body.email,
        "password": body.password
    })
    return {"token": response.session.access_token, "user": response.user.email}


@router.post("/auth/logout")
def logout():
    # Invalidates the current session on the Supabase side
    supabase.auth.sign_out()
    return {"message": "Logged out"}
