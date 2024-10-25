from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    usage: Optional[int] = None
    api_key: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class Feedback(BaseModel):
    user_id: str
    feedback: str
