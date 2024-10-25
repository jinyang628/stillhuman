import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from app.models.login import LoginRequest
from app.services.login import LoginService

log = logging.getLogger(__name__)

router = APIRouter()


class LoginController:
    def __init__(self, service: LoginService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post("")
        async def generate(input: LoginRequest):
            try:
                return await self.service.generate(
                    character_profile=input.character_profile,
                    messages=input.messages,
                )
            except Exception as e:
                log.error("Unexpected error in user controller.py: %s", str(e))
                raise HTTPException(
                    status_code=500, detail="An unexpected error occurred"
                ) from e
