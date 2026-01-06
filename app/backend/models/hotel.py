from typing import List, Optional

class M_Hotel:
    def __init__(self, hotel_id: str, name: str, address: str, check_in_time: str, check_out_time: str, description: Optional[str] = None, policies: Optional[str] = None, services: Optional[List[str]] = None, images: Optional[List[str]] = None):
        self._hotel_id = hotel_id
        self._name = name
        self._address = address
        self._description = description
        self._policies = policies
        self._check_in_time = check_in_time
        self._check_out_time = check_out_time
        self._services = services or []
        self._images = images or []

    @property
    def hotel_id(self) -> str:
        return self._hotel_id

    @property
    def name(self) -> str:
        return self._name

    @property
    def address(self) -> str:
        return self._address

    @property
    def description(self) -> Optional[str]:
        return self._description

    @property
    def policies(self) -> Optional[str]:
        return self._policies

    @property
    def check_in_time(self) -> str:
        return self._check_in_time

    @property
    def check_out_time(self) -> str:
        return self._check_out_time

    @property
    def services(self) -> List[str]:
        return self._services

    @property
    def images(self) -> List[str]:
        return self._images

    def to_dict(self):
        return {
            "hotel_id": self._hotel_id,
            "name": self._name,
            "address": self._address,
            "description": self._description,
            "policies": self._policies,
            "check_in_time": self._check_in_time,
            "check_out_time": self._check_out_time,
            "services": self._services,
            "images": self._images
        }
