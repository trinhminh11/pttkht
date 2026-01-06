from fastapi import APIRouter, HTTPException
from backend.schemas import Feedback, FeedbackCreate
from backend.db import supabase
import uuid

router = APIRouter()

@router.post("/", response_model=Feedback)
def provide_feedback(feedback_in: FeedbackCreate):
    feedback_id = str(uuid.uuid4())

    feedback_data = feedback_in.model_dump()
    feedback_data["feedback_id"] = feedback_id

    res = supabase.table("feedback").insert(feedback_data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Could not submit feedback")
    return res.data[0]
