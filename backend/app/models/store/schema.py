from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    id: Optional[int] = None
    name: str
    api_key: Optional[str] = None
    email: str
    created_at: Optional[str] = None

class Feedback(BaseModel):
    user_id: str
    feedback: str
