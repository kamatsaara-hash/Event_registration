from app.config.db import users_collection
from fastapi import HTTPException
from bson import ObjectId

def update_user_profile(user_id: str, data):
    try:
        user_object_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    # Update only the allowed fields
    update_data = {
        "fullName": data.fullName,
        "phone": data.phone,
        "college": data.college
    }

    result = users_collection.update_one(
        {"_id": user_object_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Profile updated successfully"}
