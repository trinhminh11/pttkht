import uuid
from db import supabase
import random

def seed_data():
    # 1. Create a mock hotel
    hotel_id = str(uuid.uuid4())
    hotel_data = {
        "hotel_id": hotel_id,
        "name": "Grand Lux Hotel",
        "address": "123 Elegance Boulevard, Dream City",
        "description": "A luxury 5-star hotel offering the best comfort and views in the city.",
        "check_in_time": "14:00",
        "check_out_time": "12:00",
        "policies": "No smoking. No pets. ID required at check-in.",
        "services": ["Free WiFi", "Pool", "Spa", "Gym", "Breakfast Included"],
        "images": ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"]
    }

    print(f"Creating hotel: {hotel_data['name']}...")
    supabase.table("hotels").insert(hotel_data).execute()

    # 2. Create 20 mock rooms
    room_types = [
        {"type": "Standard Single", "price": 100, "capacity": 1},
        {"type": "Standard Double", "price": 180, "capacity": 2},
        {"type": "Deluxe Double", "price": 250, "capacity": 2},
        {"type": "Executive Suite", "price": 500, "capacity": 3},
        {"type": "Presidential Suite", "price": 1200, "capacity": 4}
    ]

    rooms = []
    for i in range(1, 21):
        category = random.choice(room_types)
        room_id = str(uuid.uuid4())
        room_number = f"{100 + i}" if i <= 9 else f"{200 + i}"

        room_data = {
            "room_id": room_id,
            "hotel_id": hotel_id,
            "room_number": room_number,
            "type": category["type"],
            "price": category["price"] + random.randint(-10, 20), # Add some variation
            "capacity": category["capacity"],
            "status": "Available",
            "description": f"Beautiful {category['type']} with modern amenities and great lighting.",
            "images": [f"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1000"]
        }
        rooms.append(room_data)

    print(f"Inserting 20 rooms for hotel {hotel_id}...")
    supabase.table("rooms").insert(rooms).execute()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_data()
