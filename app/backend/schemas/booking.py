from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date

class BookingBase(BaseModel):
    user_id: str
    room_id: str
    check_in_date: str
    check_out_date: str
    total_amount: float


    @field_validator('check_in_date', 'check_out_date')
    @classmethod
    def date2str(cls, v):
        if isinstance(v, date):
            return v.isoformat()
        return v

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    booking_id: str
    status: str
    booking_code: Optional[str] = None

    class Config:
        from_attributes = True
