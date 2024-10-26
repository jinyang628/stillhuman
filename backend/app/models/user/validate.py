from pydantic import BaseModel


class ValidateResponse(BaseModel):
    success: bool
