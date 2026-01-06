from datetime import date
from typing import Optional

class M_Booking:
    def __init__(self, booking_id: str, user_id: str, room_id: str, check_in_date: date, check_out_date: date, total_amount: float, status: str = "Pending", booking_code: Optional[str] = None):
        self._booking_id = booking_id
        self._user_id = user_id
        self._room_id = room_id
        self._check_in_date = check_in_date
        self._check_out_date = check_out_date
        self._total_amount = total_amount
        self._status = status
        self._booking_code = booking_code

    @property
    def booking_id(self) -> str:
        return self._booking_id

    @property
    def user_id(self) -> str:
        return self._user_id

    @property
    def room_id(self) -> str:
        return self._room_id

    @property
    def check_in_date(self) -> date:
        return self._check_in_date

    @property
    def check_out_date(self) -> date:
        return self._check_out_date

    @property
    def total_amount(self) -> float:
        return self._total_amount

    @property
    def status(self) -> str:
        return self._status

    @status.setter
    def status(self, value: str):
        self._status = value

    @property
    def booking_code(self) -> Optional[str]:
        return self._booking_code

    def to_dict(self):
        return {
            "booking_id": self._booking_id,
            "user_id": self._user_id,
            "room_id": self._room_id,
            "check_in_date": self._check_in_date.isoformat(),
            "check_out_date": self._check_out_date.isoformat(),
            "total_amount": self._total_amount,
            "status": self._status,
            "booking_code": self._booking_code
        }
