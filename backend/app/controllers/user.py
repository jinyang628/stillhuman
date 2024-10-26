import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from app.exceptions.exception import DatabaseError
from app.models.user.login import LoginRequest
from app.models.user.validate import ValidateResponse
from app.services.user import UserService

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
        async def login(input: LoginRequest) -> JSONResponse:
            try:
                await self.service.login(
                    id=input.id,
                    name=input.name,
                    email=input.email,
                )
                return JSONResponse(status_code=200, content={"success": True})
            except DatabaseError as e:
                log.error(
                    "Error occurred while making request to DB in user controller.py: %s",
                    str(e),
                )
                raise HTTPException(status_code=500, detail="Database error occurred")
            except Exception as e:
                log.error("Unexpected error in user controller.py: %s", str(e))
                raise HTTPException(
                    status_code=500, detail="An unexpected error occurred"
                ) from e

        @router.get("")
        async def validate(id: str, api_key: str) -> ValidateResponse:
            try:
                return await self.service.validate(
                    id=id,
                    api_key=api_key,
                )
            except DatabaseError as e:
                log.error(
                    "Error occurred while making request to DB in user controller.py: %s",
                    str(e),
                )
                raise HTTPException(status_code=500, detail="Database error occurred")
            except Exception as e:
                log.error("Unexpected error in user controller.py: %s", str(e))
                raise HTTPException(
                    status_code=500, detail="An unexpected error occurred"
                )
