import uuid
from fastapi import APIRouter, HTTPException
from backend.schemas import Room, RoomCreate
from backend.db import supabase
from backend.models import M_Room

router = APIRouter()

@router.get("/hotel")
def get_hotel_info():
    res = supabase.table("hotels").select("*").single().execute()
    return res.data

@router.patch("/hotel/{hotel_id}")
def update_hotel_info(hotel_id: str, hotel_in: dict):
    res = supabase.table("hotels").update(hotel_in).eq("hotel_id", hotel_id).execute()
    return res.data[0]

@router.get("/")
def get_rooms():
    # Join with feedback through bookings to get average ratings
    res = supabase.table("rooms").select("*, bookings(feedback(rating))").execute()

    processed = []
    for room in res.data:
        # Flatten the ratings
        ratings = []
        for b in room.get('bookings', []):
            for f in b.get('feedback', []):
                ratings.append(f['rating'])

        # Calculate average
        avg = round(sum(ratings) / len(ratings), 1) if ratings else 0

        # Clean up the object
        room['avg_rating'] = avg
        room['total_reviews'] = len(ratings)
        if 'bookings' in room:
            del room['bookings']
        processed.append(room)

    return processed

@router.post("/", response_model=Room)
def create_room(room_in: RoomCreate):
    # OOP: Create M_Room instance first
    room_id = str(uuid.uuid4())

    new_room = M_Room(
        room_id=room_id,
        hotel_id=room_in.hotel_id,
        room_number=room_in.room_number,
        type=room_in.type,
        price=room_in.price,
        capacity=room_in.capacity,
        status=room_in.status,
        description=room_in.description,
        images=room_in.images
    )

    # Use the domain model to convert to dict for DB
    res = supabase.table("rooms").insert(new_room.to_dict()).execute()

    if not res.data:
        raise HTTPException(status_code=400, detail="Could not create room")
    return res.data[0]

@router.get("/{room_id}")
def get_room_details(room_id: str):
    # Get room info
    room_res = supabase.table("rooms").select("*").eq("room_id", room_id).single().execute()
    if not room_res.data:
        raise HTTPException(status_code=404, detail="Room not found")

    # Get all reviews for this room's bookings
    feedback_res = supabase.table("feedback")\
        .select("*, bookings!inner(room_id)")\
        .eq("bookings.room_id", room_id)\
        .execute()

    reviews = feedback_res.data
    total_reviews = len(reviews)

    # Calculate stats
    stats = {str(i): 0 for i in range(1, 6)}
    avg_rating = 0
    if total_reviews > 0:
        total_sum = 0
        for r in reviews:
            rating = r['rating']
            stats[str(rating)] += 1
            total_sum += rating
        avg_rating = round(total_sum / total_reviews, 1)

    return {
        "room": room_res.data,
        "reviews": reviews,
        "stats": {
            "average": avg_rating,
            "total": total_reviews,
            "distribution": stats
        }
    }

@router.patch("/{room_id}", response_model=Room)
def update_room(room_id: str, room_in: dict):
    res = supabase.table("rooms").update(room_in).eq("room_id", room_id).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Could not update room")
    return res.data[0]

@router.delete("/{room_id}")
def delete_room(room_id: str):
    supabase.table("rooms").delete().eq("room_id", room_id).execute()
    return {"message": "Room deleted"}
