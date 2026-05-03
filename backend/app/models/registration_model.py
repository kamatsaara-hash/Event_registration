def registration_model(reg) -> dict:
    return {
        "id": str(reg["_id"]),
        "userId": reg["userId"],
        "eventId": str(reg["eventId"]),
        "teamId": reg.get("teamId"),
        "checkedIn": reg.get("checkedIn", False)
    }