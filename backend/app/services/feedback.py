from app.models.store.client import POST
from app.models.store.schema import Feedback


class FeedbackService:
    
    async def submit(self):
        await POST(
            table_name="feedback",
            data_model=Feedback,
        )
