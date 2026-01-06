from fastapi import APIRouter, HTTPException
from backend.schemas import Payment, PaymentCreate
from backend.db import supabase
import uuid

router = APIRouter()

@router.post("/", response_model=Payment)
def create_payment(payment_in: PaymentCreate):
    payment_id = str(uuid.uuid4())

    payment_data = payment_in.model_dump()
    payment_data["payment_id"] = payment_id
    payment_data["status"] = "Success" # Default to success for mock

    res = supabase.table("payments").insert(payment_data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Could not process payment")

    # Update booking status to Confirmed after payment
    supabase.table("bookings").update({"status": "Confirmed"}).eq("booking_id", payment_data["booking_id"]).execute()

    return res.data[0]
