from app.models.feedback import FeedbackRequest
from app.models.store.client import POST
from app.models.store.schema import Feedback


class FeedbackService:
    async def submit(self, user_id: str, feedback: str):
        await POST(
            table_name="feedback",
            data_model=Feedback(
                user_id=user_id,
                feedback=feedback,
            ),
        )
