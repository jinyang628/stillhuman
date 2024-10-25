import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from app.controllers.utils import validate_api_key
from app.models.feedback import FeedbackRequest
from app.services.feedback import FeedbackService

log = logging.getLogger(__name__)

router = APIRouter()


class FeedbackController:
    def __init__(self, service: FeedbackService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post("")
        async def submit(input: FeedbackRequest) -> JSONResponse:
            try:
                return await self.service.submit(
                    id=input.id,
                    feedback=input.feedback,
                )
            except Exception as e:
                log.error("Unexpected error in feedback controller.py: %s", str(e))
                raise HTTPException(status_code=500, detail="An unexpected error occurred") from e
