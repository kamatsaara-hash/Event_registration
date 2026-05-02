from app.config.db import registrations_collection, events_collection, teams_collection
from app.services.qr_service import generate_qr_data
from fastapi import HTTPException
from bson import ObjectId


# 🔹 REGISTER EVENT
def register_event(user_id, data):
    user_id = str(user_id)  # ✅ ensure consistency

    try:
        event_id = ObjectId(data.eventId)
    except:
        raise HTTPException(status_code=400, detail="Invalid event ID")

    event = events_collection.find_one({"_id": event_id})

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # ❌ prevent duplicate registration
    existing = registrations_collection.find_one({
        "userId": user_id,
        "eventId": event_id
    })

    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")

    team_id = None

    # 👥 group event check
    if event["type"] == "group":
        team = teams_collection.find_one({
            "eventId": event_id,
            "members": user_id
        })

        if not team:
            raise HTTPException(status_code=400, detail="Join or create a team first")

        team_id = team["_id"]

    registration = {
        "userId": user_id,
        "eventId": event_id,
        "teamId": team_id,
        "checkedIn": False
    }

    result = registrations_collection.insert_one(registration)

    qr_data = generate_qr_data(result.inserted_id)

    return {
        "message": "Registered successfully",
        "qrData": qr_data
    }


# 🔹 GET MY REGISTRATIONS
def get_my_registrations(user_id):
    user_id = str(user_id)

    registrations = list(registrations_collection.find({"userId": user_id}))

    result = []

    for reg in registrations:
        event = events_collection.find_one({"_id": reg["eventId"]})

        result.append({
            "registrationId": str(reg["_id"]),
            "eventId": str(reg["eventId"]),
            "eventName": event["name"] if event else None,
            "teamId": str(reg["teamId"]) if reg.get("teamId") else None,
            "checkedIn": reg.get("checkedIn", False)
        })

    return result