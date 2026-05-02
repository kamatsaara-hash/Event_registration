from fastapi import APIRouter
from app.services.event_service import get_all_events

router = APIRouter()


@router.get("/")
def fetch_events():
    return get_all_events()