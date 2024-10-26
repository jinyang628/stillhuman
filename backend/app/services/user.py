import logging
from uuid import UUID

from app.exceptions.exception import DatabaseError
from app.models.store.client import GET, POST
from app.models.store.schema import User
from app.models.user.validate import ValidateResponse

log = logging.getLogger(__name__)


class UserService:
    async def login(self, id: str, name: str, email: str):
        users: list[User] = await GET(
            table_name="users", pydantic_model=User, filter_conditions={"id": id}
        )
        if len(users) > 1:
            raise DatabaseError("Multiple users found with the same ID")
        elif len(users) == 1:
            log.info("User already exists")
            return

        await POST(
            table_name="users",
            data_model=User(
                id=id,
                name=name,
                email=email,
            ),
        )

    async def validate(self, id: str, api_key: str) -> ValidateResponse:
        try:
            print(api_key)
            UUID(api_key)
        except ValueError:
            return ValidateResponse(success=False)

        users: list[User] = await GET(
            table_name="users",
            pydantic_model=User,
            filter_conditions={"id": id, "api_key": api_key},
        )
        print(users)
        if len(users) > 1:
            raise DatabaseError("Multiple users found with the same ID and API Key")
        elif len(users) != 1:
            return ValidateResponse(success=False)

        return ValidateResponse(success=True)
