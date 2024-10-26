import logging

from app.exceptions.exception import DatabaseError
from app.models.store.client import GET, POST
from app.models.store.schema import User

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
