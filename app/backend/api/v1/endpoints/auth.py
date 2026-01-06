from fastapi import APIRouter, HTTPException
from backend.schemas import LoginRequest, Token, User, UserCreate
from backend.db import supabase
from backend.models import M_User
from backend.utils.security import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import uuid

router = APIRouter()

@router.post("/register", response_model=User)
def register(user_in: UserCreate):
    """Register a new user with manual password hashing"""
    try:
        # Check if user already exists
        existing = supabase.table("users").select("user_id").eq("email", user_in.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Generate user ID
        user_id = str(uuid.uuid4())

        # Hash the password
        hashed_password = hash_password(user_in.password)

        # Create user model
        new_user = M_User(
            user_id=user_id,
            username=user_in.username,
            password_hash=hashed_password,
            full_name=user_in.full_name,
            email=user_in.email,
            role=user_in.role,
            phone_number=user_in.phone_number
        )

        # Insert into database
        user_data = new_user.to_dict()
        result = supabase.table("users").insert(user_data).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Registration failed")

        # Return user without password hash
        return_data = {k: v for k, v in user_data.items() if k != 'password_hash'}
        return return_data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest):
    """Login with email and password, returns JWT token"""
    try:
        # Fetch user from database
        result = supabase.table("users").select("*").eq("email", login_data.email).execute()

        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        user = result.data[0]

        # Verify password
        if not verify_password(login_data.password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user['user_id'], "role": user['role']},
            expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user['user_id'],
            "role": user['role']
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
