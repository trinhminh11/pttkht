from pydantic import BaseModel
from typing import List, Optional

class RoomBase(BaseModel):
    hotel_id: str
    room_number: str
    type: str
    price: float
    capacity: int
    status: str = "Available"
    description: Optional[str] = None
    images: Optional[List[str]] = []

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseModel):
    price: Optional[float] = None
    status: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None

class Room(RoomBase):
    room_id: str

    class Config:
        from_attributes = True
