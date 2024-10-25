from app.models.store.client import POST
from app.models.store.schema import User


class LoginService:
    
    async def login(self, id: str, name: str, email: str):
        await POST(
            table_name="users",
            data_model=User(
                id=id,
                name=name,
                email=email,
            ),
        )
