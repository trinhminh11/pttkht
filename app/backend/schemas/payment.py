from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    booking_id: str
    amount: float
    method: str
    type: str

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    payment_id: str
    status: str
    transaction_date: datetime

    class Config:
        from_attributes = True
