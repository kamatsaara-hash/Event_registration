from fastapi import APIRouter, Depends
from app.schemas.registration_schema import RegisterEventSchema
from app.services.registration_service import register_event, get_my_registrations
from app.utils.dependencies import get_current_user

router = APIRouter()


# 🔹 REGISTER EVENT
@router.post("/register")
def register(data: RegisterEventSchema, user_id=Depends(get_current_user)):
    return register_event(user_id, data)


# 🔹 GET MY REGISTRATIONS
@router.get("/my-registrations")
def my_registrations(user_id=Depends(get_current_user)):
    return get_my_registrations(user_id)