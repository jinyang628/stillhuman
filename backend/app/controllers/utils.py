import os

from dotenv import find_dotenv, load_dotenv
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader

from app.models.store.client import GET
from app.models.store.schema import User

API_KEY_HEADER = APIKeyHeader(name="X-API-Key")

load_dotenv(find_dotenv(filename=".env"))
ENABLE_API_KEY_VALIDATION = (
    os.environ.get("ENABLE_API_KEY_VALIDATION", "true").lower() == "true"
)


async def validate_api_key(api_key: str = Security(API_KEY_HEADER)):
    """Validate API key authentication.

    Args:
        api_key: Authentication credentials.
    """
    if not ENABLE_API_KEY_VALIDATION:
        return

    print(api_key)

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API Key",
            headers={"WWW-Authenticate": "X-API-Key"},
        )

    response: list[User] = await GET(
        table_name="users", pydantic_model=User, filter_conditions={"api_key": api_key}
    )

    if not response:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
            headers={"WWW-Authenticate": "X-API-Key"},
        )
    elif len(response) > 1:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Multiple users found with the same API Key",
            headers={"WWW-Authenticate": "X-API-Key"},
        )
