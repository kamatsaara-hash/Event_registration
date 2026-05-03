from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.config.db import registrations_collection, users_collection, events_collection
from bson import ObjectId
from app.services.admin_service import get_analytics, get_all_participants, delete_participant, get_all_teams, create_event, update_event, delete_event
from app.schemas.event_schema import EventCreateSchema
# In a real app we'd add admin verification to Depends, but keeping it simple for now

router = APIRouter()


# ✅ Schema for input
class QRScanSchema(BaseModel):
    registrationId: str


@router.get("/analytics")
def analytics_route():
    return get_analytics()

@router.get("/participants")
def participants_route():
    return get_all_participants()

@router.delete("/participants/{user_id}")
def delete_participant_route(user_id: str):
    return delete_participant(user_id)

@router.get("/teams")
def teams_route():
    return get_all_teams()

@router.post("/events")
def create_event_route(data: EventCreateSchema):
    return create_event(data)

@router.put("/events/{event_id}")
def update_event_route(event_id: str, data: EventCreateSchema):
    return update_event(event_id, data)

@router.delete("/events/{event_id}")
def delete_event_route(event_id: str):
    return delete_event(event_id)

@router.post("/scan")
def scan_qr(data: QRScanSchema):
    try:
        registration_id = ObjectId(data.registrationId)
    except:
        raise HTTPException(status_code=400, detail="Invalid registration ID format")

    registration = registrations_collection.find_one({"_id": registration_id})

    if not registration:
        raise HTTPException(status_code=404, detail="Invalid QR")

    user = users_collection.find_one({"_id": ObjectId(registration["userId"])})
    event = events_collection.find_one({"_id": ObjectId(registration["eventId"])})

    if not user or not event:
        raise HTTPException(status_code=404, detail="User or event not found")

    # ✅ prevent double scan (optional but good)
    if registration.get("checkedIn"):
        return {
            "participantName": user["fullName"],
            "eventName": event["name"],
            "message": "Already checked in"
        }

    # mark attendance
    registrations_collection.update_one(
        {"_id": registration["_id"]},
        {"$set": {"checkedIn": True}}
    )

    return {
        "participantName": user["fullName"],
        "eventName": event["name"],
        "message": "Check-in successful"
    }