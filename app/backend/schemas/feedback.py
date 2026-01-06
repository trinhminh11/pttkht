from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FeedbackBase(BaseModel):
    booking_id: str
    user_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    feedback_id: str
    created_at: datetime

    class Config:
        from_attributes = True
