import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from app.controllers.utils import validate_api_key
from app.models.generate import GenerateRequest, GenerateResponse
from app.services.message import MessageService

log = logging.getLogger(__name__)

router = APIRouter()


class MessageController:
    def __init__(self, service: MessageService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.get(
            "",
            response_model=GenerateResponse,
            dependencies=[Depends(validate_api_key)],
        )
        async def generate(url: str) -> GenerateResponse:
            try:
                return await self.service.generate(
                    url=url,
                )
            except Exception as e:
                log.error("Unexpected error in message controller.py: %s", str(e))
                raise HTTPException(
                    status_code=500, detail="An unexpected error occurred"
                ) from e
