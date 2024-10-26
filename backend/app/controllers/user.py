import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from app.models.login import LoginRequest
from app.services.login import UserService

log = logging.getLogger(__name__)

router = APIRouter()


class UserController:
    def __init__(self, service: UserService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post("")
        async def login(input: LoginRequest):
            try:
                return await self.service.login(
                    id=input.id,
                    name=input.name,
                    email=input.email,
                )
            except Exception as e:
                log.error("Unexpected error in user controller.py: %s", str(e))
                raise HTTPException(
                    status_code=500, detail="An unexpected error occurred"
                ) from e
