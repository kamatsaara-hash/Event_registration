from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config.db import registrations_collection, users_collection, events_collection
from bson import ObjectId

router = APIRouter()


# ✅ Schema for input
class QRScanSchema(BaseModel):
    registrationId: str


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