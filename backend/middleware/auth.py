# Dependency injected into any route that requires an authenticated user
from fastapi import Depends, HTTPException, Header
from db.supabase import supabase


async def get_current_user(authorization: str = Header(...)):
    # Expect the standard "Bearer <token>" format
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.removeprefix("Bearer ")

    try:
        # Ask Supabase to validate the JWT and return the user object
        response = supabase.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return response.user
    except HTTPException:
        raise
    except Exception:
        # Catch any unexpected Supabase SDK errors and return a clean 401
        raise HTTPException(status_code=401, detail="Could not validate credentials")
