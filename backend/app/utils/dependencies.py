from fastapi import Request, HTTPException
from app.config.db import sessions_collection
from datetime import datetime


def get_current_user(request: Request):
    # ✅ get sessionId from cookie OR header
    session_id = request.cookies.get("sessionId") or request.headers.get("sessionId")

    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # ✅ fetch session by sessionId (not _id)
    session = sessions_collection.find_one({"sessionId": session_id})

    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    # ✅ check session expiry
    if session.get("expiresAt") and session["expiresAt"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Session expired")

    return session["userId"]