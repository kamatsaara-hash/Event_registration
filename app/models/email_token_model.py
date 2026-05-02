from datetime import datetime, timedelta
import uuid
from app.config.settings import EMAIL_TOKEN_EXPIRE_MINUTES


def create_email_token(user_id):
    return {
        "userId": user_id,
        "token": str(uuid.uuid4()),
        "createdAt": datetime.utcnow(),
        "expiresAt": datetime.utcnow() + timedelta(minutes=EMAIL_TOKEN_EXPIRE_MINUTES)
    }