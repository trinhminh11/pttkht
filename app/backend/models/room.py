from typing import List, Optional

class M_Room:
    """
    Represents a physical room in the hotel.
    """
    def __init__(self, room_id: str, hotel_id: str, room_number: str, type: str, price: float, capacity: int, status: str = "Available", description: Optional[str] = None, images: Optional[List[str]] = None):
        self._room_id = room_id
        self._hotel_id = hotel_id
        self._room_number = room_number
        self._type = type
        self._price = price
        self._capacity = capacity
        self._status = status
        self._description = description
        self._images = images or []

    @property
    def room_id(self) -> str:
        return self._room_id

    @property
    def room_number(self) -> str:
        return self._room_number

    @property
    def price(self) -> float:
        return self._price

    @price.setter
    def price(self, value: float):
        if value < 0:
            raise ValueError("Price cannot be negative")
        self._price = value

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
    def capacity(self) -> int:
        return self._capacity

    @property
    def description(self) -> Optional[str]:
        return self._description

    @property
    def images(self) -> List[str]:
        return self._images

    def is_available(self) -> bool:
        return self._status == "Available"

    def to_dict(self):
        return {
            "room_id": self._room_id,
            "hotel_id": self._hotel_id,
            "room_number": self._room_number,
            "type": self._type,
            "price": self._price,
            "capacity": self._capacity,
            "status": self._status,
            "description": self._description,
            "images": self._images
        }
