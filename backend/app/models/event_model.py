from app.config.db import registrations_collection

def event_model(event) -> dict:
    reg_count = registrations_collection.count_documents({"eventId": event["_id"]})
    return {
        "id": str(event["_id"]),
        "name": event.get("name", ""),
        "type": event.get("type", "solo"),
        "maxTeamSize": event.get("maxTeamSize", 4),
        "description": event.get("description", ""),
        "registrations": reg_count
    }