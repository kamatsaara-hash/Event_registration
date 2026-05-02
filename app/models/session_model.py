from datetime import datetime, timedelta
from app.config.settings import SESSION_EXPIRE_HOURS


def create_session(user_id):
    return {
        "userId": user_id,
        "createdAt": datetime.utcnow(),
        "expiresAt": datetime.utcnow() + timedelta(hours=SESSION_EXPIRE_HOURS)
    }