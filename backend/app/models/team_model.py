def team_model(team) -> dict:
    return {
        "id": str(team["_id"]),
        "eventId": str(team["eventId"]),
        "teamName": team["teamName"],
        "teamCode": team["teamCode"],
        "leaderId": team["leaderId"],
        "members": team["members"],
        "maxSize": team["maxSize"]
    }