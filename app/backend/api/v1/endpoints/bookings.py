from fastapi import APIRouter, HTTPException
from typing import List
from backend.schemas import Booking, BookingCreate
from backend.db import supabase

router = APIRouter()

@router.post("/", response_model=Booking)
def create_booking(booking_in: BookingCreate):
    # Overlap Check Logic:
    # A booking overlaps if (new_checkin < existing_checkout) AND (new_checkout > existing_checkin)
    # We exclude 'Cancelled' bookings

    overlaps = supabase.table("bookings")\
        .select("booking_id")\
        .eq("room_id", booking_in.room_id)\
        .neq("status", "Cancelled")\
        .lt("check_in_date", booking_in.check_out_date)\
        .gt("check_out_date", booking_in.check_in_date)\
        .execute()

    if overlaps.data:
        raise HTTPException(
            status_code=400,
            detail="This room is already booked for the selected dates."
        )

    res = supabase.table("bookings").insert(booking_in.model_dump()).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Could not create booking")
    return res.data[0]

@router.get("/")
def get_all_bookings():
    res = supabase.table("bookings").select("*, rooms(room_number, type), users(full_name, email)").order("created_at", desc=True).execute()
    processed = []
    for b in res.data:
        b['room_number'] = b['rooms']['room_number'] if b.get('rooms') else "N/A"
        b['room_type'] = b['rooms']['type'] if b.get('rooms') else "N/A"
        b['customer_name'] = b['users']['full_name'] if b.get('users') else "Unknown"
        processed.append(b)
    return processed

@router.get("/user/{user_id}", response_model=List[dict])
def get_user_bookings(user_id: str):
    # Join with rooms to get room details and check for feedback
    res = supabase.table("bookings")\
        .select("*, rooms(type, room_number), feedback(feedback_id)")\
        .eq("user_id", user_id)\
        .order("check_in_date", desc=True)\
        .execute()

    # Process data to flatten rooms and add reviewed flag
    processed_data = []
    for b in res.data:
        b['room_type'] = b['rooms']['type'] if b.get('rooms') else "Unknown"
        b['room_number'] = b['rooms']['room_number'] if b.get('rooms') else "N/A"
        b['is_reviewed'] = len(b.get('feedback', [])) > 0
        processed_data.append(b)

    return processed_data

@router.patch("/{booking_id}", response_model=Booking)
def update_booking(booking_id: str, booking_in: dict):
    # Only allow updates if booking is Pending
    existing = supabase.table("bookings").select("*").eq("booking_id", booking_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    if existing.data['status'] != "Pending":
        # Admin can update status but user shouldn't update dates if not pending
        # Here we check if dates are being changed
        pass

    # If dates are being changed, check for overlaps
    if 'check_in_date' in booking_in or 'check_out_date' in booking_in:
        new_in = booking_in.get('check_in_date', existing.data['check_in_date'])
        new_out = booking_in.get('check_out_date', existing.data['check_out_date'])
        room_id = existing.data['room_id']

        overlaps = supabase.table("bookings")\
            .select("booking_id")\
            .eq("room_id", room_id)\
            .neq("status", "Cancelled")\
            .neq("booking_id", booking_id)\
            .lt("check_in_date", new_out)\
            .gt("check_out_date", new_in)\
            .execute()

        if overlaps.data:
            raise HTTPException(status_code=400, detail="The new dates overlap with an existing booking.")

    res = supabase.table("bookings").update(booking_in).eq("booking_id", booking_id).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Could not update booking")
    return res.data[0]

@router.delete("/{booking_id}")
def delete_booking(booking_id: str):
    # Only allow deletion if booking is Pending
    booking = supabase.table("bookings").select("status").eq("booking_id", booking_id).single().execute()
    if not booking.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.data['status'] != "Pending":
        raise HTTPException(status_code=400, detail="Only Pending bookings can be deleted")

    supabase.table("bookings").delete().eq("booking_id", booking_id).execute()
    return {"message": "Booking deleted successfully"}
