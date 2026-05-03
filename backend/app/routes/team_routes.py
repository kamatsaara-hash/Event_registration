from fastapi import APIRouter, Depends
from bson import ObjectId
from app.config.db import users_collection
from app.schemas.team_schema import CreateTeamSchema, JoinTeamSchema
from app.services.team_service import create_team, join_team, leave_team
from app.utils.dependencies import get_current_user
from app.services.team_service import get_user_team

router = APIRouter()


@router.post("/create")
def create(data: CreateTeamSchema, user_id=Depends(get_current_user)):
    return create_team(user_id, data)


@router.post("/join")
def join(data: JoinTeamSchema, user_id=Depends(get_current_user)):
    return join_team(user_id, data)


@router.post("/leave/{team_id}")
def leave(team_id: str, user_id=Depends(get_current_user)):
    return leave_team(user_id, team_id)

@router.get("/my/{event_id}")
def my_team(event_id: str, user_id=Depends(get_current_user)):
    team = get_user_team(user_id, event_id)

    if not team:
        return {"team": None}

    populated_members = []
    for m_id in team.get("members", []):
        try:
            user = users_collection.find_one({"_id": ObjectId(m_id)})
            if user:
                populated_members.append({
                    "id": str(user["_id"]),
                    "fullName": user["fullName"],
                    "email": user["email"],
                    "isLeader": str(user["_id"]) == str(team["leaderId"])
                })
        except:
            pass

    return {
        "teamId": str(team["_id"]),
        "teamName": team["teamName"],
        "teamCode": team["teamCode"],
        "leaderId": team["leaderId"],
        "members": populated_members
    }