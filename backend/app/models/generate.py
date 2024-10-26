from pydantic import BaseModel


class GenerateRequest(BaseModel):
    api_key: str
    url: str


class GenerateResponse(BaseModel):
    pass
