from datetime import datetime
from typing import Optional

class M_User:
    """
    Represents a registered user in the system.
    """
    def __init__(self, user_id: str, username: str, password_hash: str, full_name: str, email: str, role: str, phone_number: Optional[str] = None, created_at: Optional[str] = None):
        self._user_id = user_id
        self._username = username
        self._password_hash = password_hash
        self._full_name = full_name
        self._email = email
        self._role = role
        self._phone_number = phone_number
        self._created_at = created_at or datetime.now().isoformat()

    @property
    def user_id(self) -> str:
        return self._user_id

    @property
    def username(self) -> str:
        return self._username

    @property
    def full_name(self) -> str:
        return self._full_name

    @full_name.setter
    def full_name(self, value: str):
        self._full_name = value

    @property
    def email(self) -> str:
        return self._email

    @property
    def role(self) -> str:
        return self._role

    @property
    def phone_number(self) -> Optional[str]:
        return self._phone_number

    @phone_number.setter
    def phone_number(self, value: str):
        self._phone_number = value

    def check_password(self, password_attempt: str) -> bool:
        """
        Verifies the password. In a real app, use bcrypt verify.
        """
        # simplified for this stage, assuming hash comparison happens elsewhere or using exact match for demo if not using bcrypt lib yet
        return self._password_hash == password_attempt

    def to_dict(self):
        return {
            "user_id": self._user_id,
            "username": self._username,
            "full_name": self._full_name,
            "email": self._email,
            "role": self._role,
            "phone_number": self._phone_number,
            "created_at": self._created_at,
            "password_hash": self._password_hash
        }
