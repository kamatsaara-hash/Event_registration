import uuid
from datetime import datetime, timedelta
from app.config.settings import SESSION_EXPIRE_HOURS


def create_session(user_id):
    return {
        "sessionId": str(uuid.uuid4()),  # 🔥 ADD THIS
        "userId": user_id,
        "createdAt": datetime.utcnow(),
        "expiresAt": datetime.utcnow() + timedelta(hours=SESSION_EXPIRE_HOURS)
    }