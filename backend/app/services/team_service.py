from app.config.db import teams_collection, events_collection
from app.utils.generate_code import generate_team_code
from fastapi import HTTPException
from bson import ObjectId


# 🔹 CREATE TEAM
def create_team(user_id, data):
    user_id = str(user_id)  # ✅ FIX: always string

    try:
        event_id = ObjectId(data.eventId)
    except:
        raise HTTPException(status_code=400, detail="Invalid event ID")

    event = events_collection.find_one({"_id": event_id})

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event["type"] != "group":
        raise HTTPException(status_code=400, detail="Solo event cannot have teams")

    # ❌ already in team
    existing = teams_collection.find_one({
        "eventId": event_id,
        "members": user_id
    })

    if existing:
        raise HTTPException(status_code=400, detail="Already in a team for this event")

    # ✅ unique team code
    while True:
        team_code = generate_team_code()
        if not teams_collection.find_one({"teamCode": team_code}):
            break

    team = {
        "eventId": event_id,
        "teamName": data.teamName,
        "teamCode": team_code,
        "leaderId": user_id,
        "members": [user_id],
        "maxSize": data.teamSize
    }

    result = teams_collection.insert_one(team)

    return {
        "message": "Team created successfully",
        "teamCode": team_code,
        "teamId": str(result.inserted_id)
    }


# 🔹 JOIN TEAM
def join_team(user_id, data):
    user_id = str(user_id)  # ✅ FIX

    try:
        event_id = ObjectId(data.eventId)
    except:
        raise HTTPException(status_code=400, detail="Invalid event ID")

    event = events_collection.find_one({"_id": event_id})

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event["type"] != "group":
        raise HTTPException(status_code=400, detail="Solo event cannot have teams")

    # ❌ already in team
    existing = teams_collection.find_one({
        "eventId": event_id,
        "members": user_id
    })

    if existing:
        raise HTTPException(status_code=400, detail="Already in a team")

    team = teams_collection.find_one({
        "teamCode": data.teamCode,
        "eventId": event_id
    })

    if not team:
        raise HTTPException(status_code=404, detail="Invalid team code")

    if user_id in team["members"]:
        raise HTTPException(status_code=400, detail="Already in this team")

    if len(team["members"]) >= team["maxSize"]:
        raise HTTPException(status_code=400, detail="Team is full")

    teams_collection.update_one(
        {"_id": team["_id"]},
        {"$push": {"members": user_id}}
    )

    return {"message": "Joined team successfully"}


# 🔹 LEAVE TEAM
def leave_team(user_id, team_id):
    user_id = str(user_id)  # ✅ FIX

    try:
        team_object_id = ObjectId(team_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid team ID")

    team = teams_collection.find_one({"_id": team_object_id})

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if user_id not in team["members"]:
        raise HTTPException(status_code=400, detail="Not part of team")

    updated_members = [m for m in team["members"] if m != user_id]

    # 🔹 leader leaving
    if team["leaderId"] == user_id:
        if len(updated_members) == 0:
            teams_collection.delete_one({"_id": team["_id"]})
            return {"message": "Team deleted (no members left)"}

        new_leader = updated_members[0]

        teams_collection.update_one(
            {"_id": team["_id"]},
            {
                "$set": {
                    "leaderId": new_leader,
                    "members": updated_members
                }
            }
        )
    else:
        teams_collection.update_one(
            {"_id": team["_id"]},
            {"$set": {"members": updated_members}}
        )

    return {"message": "Left team successfully"}


# 🔹 GET USER TEAM
def get_user_team(user_id, event_id):
    user_id = str(user_id)  # ✅ FIX

    try:
        event_object_id = ObjectId(event_id)
    except:
        return None

    team = teams_collection.find_one({
        "eventId": event_object_id,
        "members": user_id
    })

    return team