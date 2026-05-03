from app.config.db import users_collection, teams_collection, events_collection, registrations_collection
from fastapi import HTTPException
from bson import ObjectId

def get_analytics():
    total_users = users_collection.count_documents({})
    total_teams = teams_collection.count_documents({})
    total_events = events_collection.count_documents({})
    total_registrations = registrations_collection.count_documents({})
    
    # Just simplistic counts for now
    recent_registrations = registrations_collection.count_documents({})
    active_teams = teams_collection.count_documents({"members.1": {"$exists": True}}) # At least 2 members

    # Mock growth data since we don't have historical data yet
    users_growth = 12.5
    teams_growth = 8.2
    registrations_growth = 24.1
    
    # Calculate top events
    all_events = list(events_collection.find({}))
    top_events = []
    for event in all_events:
        reg_count = registrations_collection.count_documents({"eventId": event["_id"]})
        top_events.append({"name": event["name"], "registrations": reg_count})
    
    # Sort and take top 5
    top_events = sorted(top_events, key=lambda x: x["registrations"], reverse=True)[:5]
    if not top_events:
        top_events = [{"name": "No Events", "registrations": 0}]

    # Mock recent registrations array (last 7 days) since we don't have time series data
    recent_registrations_array = [
        {"date": "Mon", "count": max(0, total_registrations - 10)},
        {"date": "Tue", "count": max(0, total_registrations - 8)},
        {"date": "Wed", "count": max(0, total_registrations - 6)},
        {"date": "Thu", "count": max(0, total_registrations - 4)},
        {"date": "Fri", "count": max(0, total_registrations - 2)},
        {"date": "Sat", "count": total_registrations},
        {"date": "Sun", "count": total_registrations},
    ]

    return {
        "totalUsers": total_users,
        "totalTeams": total_teams,
        "totalEvents": total_events,
        "totalRegistrations": total_registrations,
        "recentRegistrations": recent_registrations_array,
        "activeTeams": active_teams,
        "usersGrowth": users_growth,
        "teamsGrowth": teams_growth,
        "registrationsGrowth": registrations_growth,
        "topEvents": top_events
    }

def get_all_participants():
    users = list(users_collection.find({}))
    participants = []
    
    for u in users:
        reg_count = registrations_collection.count_documents({"userId": str(u["_id"])})
        participants.append({
            "id": str(u["_id"]),
            "fullName": u.get("fullName", ""),
            "email": u.get("email", ""),
            "phone": u.get("phone", ""),
            "college": u.get("college", ""),
            "emailVerified": u.get("emailVerified", False),
            "registeredEvents": reg_count,
            "createdAt": u.get("createdAt", "")
        })
        
    return {"participants": participants}

def delete_participant(user_id: str):
    try:
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    # Delete user
    res = users_collection.delete_one({"_id": obj_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Cascade delete their registrations
    registrations_collection.delete_many({"userId": user_id})
    
    # Remove from teams (basic cleanup)
    teams_collection.update_many(
        {"members": user_id},
        {"$pull": {"members": user_id}}
    )
    
    return {"message": "Participant deleted"}

def get_all_teams():
    teams = list(teams_collection.find({}))
    result = []
    
    for t in teams:
        event = events_collection.find_one({"_id": t.get("eventId")})
        event_name = event["name"] if event else "Unknown Event"
        
        members = []
        for m_id in t.get("members", []):
            try:
                user = users_collection.find_one({"_id": ObjectId(m_id)})
                if user:
                    members.append({
                        "id": str(user["_id"]),
                        "fullName": user.get("fullName", ""),
                        "email": user.get("email", ""),
                        "isLeader": str(user["_id"]) == str(t.get("leaderId"))
                    })
            except:
                pass
                
        result.append({
            "id": str(t["_id"]),
            "name": t.get("teamName", ""),
            "eventName": event_name,
            "teamCode": t.get("teamCode", ""),
            "maxSize": t.get("maxSize", 6),
            "members": members
        })
        
    return {"teams": result}

def create_event(data):
    event_dict = data.dict()
    res = events_collection.insert_one(event_dict)
    return {"id": str(res.inserted_id), "message": "Event created"}

def update_event(event_id: str, data):
    try:
        obj_id = ObjectId(event_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid event ID")
        
    res = events_collection.update_one({"_id": obj_id}, {"$set": data.dict()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
        
    return {"message": "Event updated"}

def delete_event(event_id: str):
    try:
        obj_id = ObjectId(event_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid event ID")
        
    res = events_collection.delete_one({"_id": obj_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Also delete registrations and teams? We'll just delete the event for now
    registrations_collection.delete_many({"eventId": obj_id})
    teams_collection.delete_many({"eventId": obj_id})
        
    return {"message": "Event deleted"}
