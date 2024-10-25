from pydantic import BaseModel


class LoginRequest(BaseModel):
    id: str
    name: str
    email: str
