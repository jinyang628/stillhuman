import os
from typing import Optional

from dotenv import find_dotenv, load_dotenv
from pydantic import BaseModel
from supabase import AsyncClientOptions
from supabase._async.client import AsyncClient, create_client

load_dotenv(find_dotenv(filename=".env"))


# https://supabase.com/docs/reference/python/
class Supabase:
    url: str
    key: str
    _client: Optional[AsyncClient] = None

    def __init__(self):
        supabase_url: Optional[str] = os.environ.get("SUPABASE_URL")
        if not supabase_url:
            raise ValueError("SUPABASE_URL is not set in the .env file.")
        self.url = supabase_url

        supabase_key: Optional[str] = os.environ.get("SUPABASE_KEY")
        if not supabase_key:
            raise ValueError("SUPABASE_KEY is not set in the .env file.")
        self.key = supabase_key

    @property
    async def client(self):
        if self._client is None:
            self._client = await create_client(
                self.url,
                self.key,
                options=AsyncClientOptions(
                    postgrest_client_timeout=10,
                    storage_client_timeout=10,
                    schema="public",
                ),
            )
        return self._client


async def GET(
    table_name: str, pydantic_model: type[BaseModel], filter_conditions: Optional[dict] = None
) -> list:
    """
    Performs a GET request to the supabase database. Filter conditions are exact matches.

    Example input parameters:
        table_name: users
        filter_conditions: {"name": "suveen"} \\ {} \\ {"name": "suveen", "email": "suveen@gmail.com"}
    """
    client = await Supabase().client
    query = client.table(table_name).select("*")

    if filter_conditions:
        for column, value in filter_conditions.items():
            query = query.eq(column, value)

    response = await query.execute()
    return [pydantic_model.model_validate(user) for user in response.data]


async def POST(
    table_name: str,
    data_model: BaseModel,
):
    """
    Performs a POST request to the supabase database.
    """
    client = await Supabase().client

    # For auto-generated fields, leave them as None and they will be filtered away in the query
    data: dict = {k: v for k, v in data_model.model_dump().items() if v is not None}
    await client.table(table_name).insert(data).execute()


async def UPDATE(
    table_name: str,
    pydantic_model: type[BaseModel],
    filter_conditions: dict,
    update_conditions: dict,
) -> list:
    """
    Performs a UPDATE request to the supabase database. Filter conditions are exact matches.

    Example input parameters:
        table_name: users
        filter_conditions: {"name": "suveen"} \\ {"name": "suveen", "email": "suveen@gmail.com"}
        update_conditions: {"email": "jinyang@gmail.com"} \\ {"name": "suveenE"}
    """
    client = await Supabase().client
    query = client.table(table_name).update(update_conditions)
    for column, value in filter_conditions.items():
        query = query.eq(column, value)
    response = await query.execute()
    return [pydantic_model.model_validate(user) for user in response.data]


async def DELETE(
    table_name: str,
    pydantic_model: type[BaseModel],
    filter_conditions: dict,
) -> list:
    """
    Performs a DELETE request to the supabase database. Filter conditions are exact matches.

    Example input parameters:
        table_name: users
        filter_conditions: {"name": "suveen"} \\ {"name": "suveen", "email": "suveen@gmail.com"}
    """
    client = await Supabase().client
    query = client.table(table_name).delete()
    for column, value in filter_conditions.items():
        query = query.eq(column, value)
    response = await query.execute()
    return [pydantic_model.model_validate(user) for user in response.data]
