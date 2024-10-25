from typing import Optional

from pydantic import BaseModel, Field

from app.models.message import Message


class GenerateRequest(BaseModel):
    character_profile: str = Field(
        description="The profile of the visual novel character which the LLM is emulating."
    )
    messages: list[Message] = Field(
        description="The conversation history between the character and the visual novel character."
    )

class GenerateResponse(BaseModel):
    pass
