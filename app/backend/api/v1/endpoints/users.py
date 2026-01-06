from fastapi import APIRouter, HTTPException
from backend.schemas import User, UserUpdate, PasswordChange
from backend.db import supabase
from backend.utils.security import hash_password, verify_password

router = APIRouter()

@router.get("/me", response_model=User)
def get_profile(user_id: str):
    res = supabase.table("users").select("*").eq("user_id", user_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="User not found")
    return res.data

@router.patch("/me", response_model=User)
def update_profile(user_id: str, user_in: UserUpdate):
    res = supabase.table("users").update(user_in.model_dump(exclude_unset=True)).eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Could not update profile")
    return res.data[0]

@router.patch("/me/password")
def change_password(user_id: str, pwd_in: PasswordChange):
    # Verify old password
    user_res = supabase.table("users").select("password_hash").eq("user_id", user_id).single().execute()
    if not user_res.data or not verify_password(pwd_in.old_password, user_res.data['password_hash']):
        raise HTTPException(status_code=400, detail="Invalid old password")

    new_hash = hash_password(pwd_in.new_password)
    res = supabase.table("users").update({"password_hash": new_hash}).eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Could not change password")
    return {"message": "Password changed successfully"}

@router.delete("/me")
def delete_account(user_id: str):
    supabase.table("users").delete().eq("user_id", user_id).execute()
    return {"message": "Account deleted successfully"}
