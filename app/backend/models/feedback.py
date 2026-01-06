from datetime import datetime
from typing import Optional

class M_Feedback:
    def __init__(self, feedback_id: str, booking_id: str, user_id: str, rating: int, comment: Optional[str] = None, created_at: Optional[str] = None):
        self._feedback_id = feedback_id
        self._booking_id = booking_id
        self._user_id = user_id
        self._rating = rating
        self._comment = comment
        self._created_at = created_at or datetime.now().isoformat()

    @property
    def feedback_id(self) -> str:
        return self._feedback_id

    @property
    def booking_id(self) -> str:
        return self._booking_id

    @property
    def user_id(self) -> str:
        return self._user_id

    @property
    def rating(self) -> int:
        return self._rating

    @property
    def comment(self) -> Optional[str]:
        return self._comment

    @property
    def created_at(self) -> str:
        return self._created_at

    def to_dict(self):
        return {
            "feedback_id": self._feedback_id,
            "booking_id": self._booking_id,
            "user_id": self._user_id,
            "rating": self._rating,
            "comment": self._comment,
            "created_at": self._created_at
        }
