from datetime import datetime
from typing import Optional

class M_Payment:
    def __init__(self, payment_id: str, booking_id: str, amount: float, method: str, type: str, status: str = "Pending", transaction_date: Optional[str] = None):
        self._payment_id = payment_id
        self._booking_id = booking_id
        self._amount = amount
        self._method = method
        self._type = type
        self._status = status
        self._transaction_date = transaction_date or datetime.now().isoformat()

    @property
    def payment_id(self) -> str:
        return self._payment_id

    @property
    def booking_id(self) -> str:
        return self._booking_id

    @property
    def amount(self) -> float:
        return self._amount

    @property
    def method(self) -> str:
        return self._method

    @property
    def status(self) -> str:
        return self._status

    @status.setter
    def status(self, value: str):
        self._status = value

    @property
    def type(self) -> str:
        return self._type

    @property
    def transaction_date(self) -> str:
        return self._transaction_date

    def to_dict(self):
        return {
            "payment_id": self._payment_id,
            "booking_id": self._booking_id,
            "amount": self._amount,
            "method": self._method,
            "type": self._type,
            "status": self._status,
            "transaction_date": self._transaction_date
        }
