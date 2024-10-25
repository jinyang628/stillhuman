import logging

from fastapi import APIRouter

log = logging.getLogger(__name__)

router = APIRouter()


@router.get("/status")
async def status():
    """Health check endpoint"""
    logging.info("Status endpoint called")
    return {"status": "ok"}
