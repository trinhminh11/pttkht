from fastapi import APIRouter
from backend.db import supabase
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/")
def get_statistics():
    # 1. Get Reviews count and average
    feedback_res = supabase.table("feedback").select("rating").execute()
    ratings = [f['rating'] for f in feedback_res.data]
    avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0
    total_reviews = len(ratings)

    # 2. Mocking historical timeline data
    timeline = []
    today = datetime.now()

    user_res = supabase.table("users").select("user_id").execute()
    total_users = len(user_res.data)

    for i in range(29, -1, -1):
        date = (today - timedelta(days=i)).strftime("%m-%d") # Use shorter date for chart

        # Mocking values with some randomness and growth
        growth_factor = (30 - i) / 30
        daily_dau = int(total_users * (0.3 + 0.1 * growth_factor) * (1 + 0.1 * (random.random() - 0.5)))
        daily_mau = int(total_users * (0.7 + 0.1 * growth_factor))

        timeline.append({
            "date": date,
            "dau": daily_dau,
            "mau": daily_mau,
            "stickiness": round((daily_dau / daily_mau * 100) if daily_mau > 0 else 0, 1)
        })

    # Business stats
    bookings_res = supabase.table("bookings").select("status").execute()
    bookings_count = len(bookings_res.data)

    latest = timeline[-1]

    return {
        "reviews": {
            "average": avg_rating,
            "total": total_reviews
        },
        "engagement": {
            "dau": latest["dau"],
            "mau": latest["mau"],
            "stickiness": latest["stickiness"]
        },
        "business": {
            "total_users": total_users,
            "total_bookings": bookings_count
        },
        "timeline": timeline
    }
