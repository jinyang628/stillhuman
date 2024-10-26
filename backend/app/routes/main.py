import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.controllers.feedback import FeedbackController
from app.controllers.message import MessageController
from app.controllers.user import UserController
from app.routes.status import router as status_router
from app.services.feedback import FeedbackService
from app.services.login import UserService
from app.services.message import MessageService

log = logging.getLogger(__name__)


def get_message_controller_router():
    service = MessageService()
    return MessageController(service=service).router


def get_feedback_controller_router():
    service = FeedbackService()
    return FeedbackController(service=service).router


def get_login_controller_router():
    service = UserService()
    return UserController(service=service).router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Entry point lifecycle event. Runs before the server starts"""
    try:
        log.info("Starting up server...")
        yield
    except Exception as e:
        log.exception("Failed to initialize renpAI server: %s", e)
        raise e
    finally:
        log.info("Shutting down server...")


def create_app() -> FastAPI:
    """Create FastAPI app with all routes."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(name)s - %(message)s",
    )
    try:
        app = FastAPI(lifespan=lifespan, debug=True)
        app.include_router(status_router)

        app.include_router(
            get_message_controller_router(), tags=["message"], prefix="/api/message"
        )

        app.include_router(
            get_feedback_controller_router(), tags=["feedback"], prefix="/api/feedback"
        )

        app.include_router(
            get_login_controller_router(), tags=["login"], prefix="/api/user"
        )
        return app
    except Exception as e:
        log.exception("Failed to create renpAI server: %s", e)
        raise e
