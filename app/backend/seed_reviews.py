import random
import uuid
from datetime import datetime, timedelta
from backend.db import supabase

def seed_meme_reviews():
    # 1. Get all rooms
    rooms_res = supabase.table("rooms").select("room_id").execute()
    room_ids = [r['room_id'] for r in rooms_res.data]
    if not room_ids:
        print("No rooms found!")
        return

    # 2. Get some users or create a "Meme Squad"
    users_res = supabase.table("users").select("user_id").limit(10).execute()
    user_ids = [u['user_id'] for u in users_res.data]

    # If not enough users, create some
    if len(user_ids) < 5:
        print("Creating meme users...")
        for i in range(5):
            uid = str(uuid.uuid4())
            supabase.table("users").insert({
                "user_id": uid,
                "username": f"memer_{i}",
                "email": f"meme_{i}@internet.com",
                "password_hash": "empty",
                "full_name": f"Memer Lord {i}",
                "role": "Customer"
            }).execute()
            user_ids.append(uid)

    # 3. Meme phrases by rating
    memes = {
        5: [
            "Stonks! Best room ever. 🚀",
            "Absolute W. Based and room-pilled.",
            "Sheesh! This room is bussin fr fr. No cap.",
            "GigaChad energy in this suite.",
            "Room to the moon! 💎🙌",
            "Manager cooked with this one. 10/10.",
            "W stay. Very demure. Very mindful.",
            "Peak fiction. This room is a masterpiece.",
            "I've ascended. 5 stars isn't enough.",
            "Vibe check: IMMACULATE.",
            "Maximum Rizz acquired here."
        ],
        4: [
            "Good stay. Solid 8/10. Not mid.",
            "Pretty based. Would stay again for the vibes.",
            "Room is lit. A bit pricy but stonks anyway.",
            "Clean and cozy. No Ls here.",
            "Valid stay. Passed the vibe check.",
            "Certified hood classic stay.",
            "Stay was smooth. No major Ls.",
            "Feeling like a main character in this suite.",
            "Solid W. Everything worked as intended.",
            "The room meta is strong with this one.",
            "Good energy. No cringe detected."
        ],
        3: [
            "Slightly mid. Average at best.",
            "Room is okay, but touch grass frequency was too low.",
            "Neither a W nor an L. Perfectly balanced, as all things should be.",
            "It is what it is.",
            "Lowkey mid but the bed was soft.",
            "Bruh moment: wifi was slow but room was nice.",
            "Not great, not terrible. 3.6 Roentgen stay.",
            "Room was a bit npc, but it works.",
            "Default settings stay."
        ],
        2: [
            "L. Not the vibe.",
            "Kinda cringe ngl. AC was making weird noises.",
            "Ratio + room was cold.",
            "Down bad stay. Missing some amenities.",
            "I've seen better. This ain't it chief.",
            "Skill issue: front desk forgot my towel.",
            "Low rizz stay. Room smelled like old gym socks.",
            "Rare L. Expected more for the price.",
            "This ain't it, chief. 🤡"
        ],
        1: [
            "Massive L. Never again. 💀",
            "Down horrendous. Nightmare fuel.",
            "Room was cooked. Absolute disaster class.",
            "Worst room in the multiverse. Skill issue.",
            "Deadass terrible stay. Zero rizz.",
            "Absolute disaster. Skill issue for real.",
            "Room was cooked. Burn it with fire. 🔥",
            "Maximum L. Literally crying rn.",
            "I'd give zero stars if I could. Negative rizz.",
            "Total clown show. 🤡🤡🤡"
        ]
    }

    # 4. Generate ~400 reviews
    total_needed = 400
    print(f"Generating {total_needed} reviews with normal distribution (mean=4)...")

    count = 0
    batch_size = 50
    bookings_batch = []
    feedback_batch = []

    for i in range(total_needed):
        # Weighted random choice for the specified distribution:
        # mostly 4 star, but more 1 and 2 stars than before
        rating = random.choices([1, 2, 3, 4, 5], weights=[0.15, 0.15, 0.15, 0.35, 0.20])[0]
        room_id = random.choice(room_ids)
        user_id = random.choice(user_ids)
        booking_id = str(uuid.uuid4())

        # Create a mock completed booking first
        # We'll use insert list to batch later
        check_in = datetime.now() - timedelta(days=random.randint(5, 60))
        check_out = check_in + timedelta(days=random.randint(1, 5))

        bookings_batch.append({
            "booking_id": booking_id,
            "user_id": user_id,
            "room_id": room_id,
            "check_in_date": check_in.strftime("%Y-%m-%d"),
            "check_out_date": check_out.strftime("%Y-%m-%d"),
            "total_amount": 500.0,
            "status": "Completed"
        })

        feedback_batch.append({
            "booking_id": booking_id,
            "user_id": user_id,
            "rating": rating,
            "comment": random.choice(memes[rating])
        })

        if len(bookings_batch) >= batch_size:
            supabase.table("bookings").insert(bookings_batch).execute()
            supabase.table("feedback").insert(feedback_batch).execute()
            count += len(bookings_batch)
            print(f"Inserted {count}/{total_needed} reviews...")
            bookings_batch = []
            feedback_batch = []

    # Final batch
    if bookings_batch:
        supabase.table("bookings").insert(bookings_batch).execute()
        supabase.table("feedback").insert(feedback_batch).execute()
        count += len(bookings_batch)

    print(f"Finished! Total mock reviews added: {count}")

if __name__ == "__main__":
    seed_meme_reviews()
