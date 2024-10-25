from pydantic import BaseModel


class FeedbackRequest(BaseModel):
    user_id: str
    feedback: str
