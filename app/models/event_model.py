def event_model(event) -> dict:
    return {
        "id": str(event["_id"]),
        "name": event["name"],
        "type": event["type"],
        "maxTeamSize": event["maxTeamSize"]
    }