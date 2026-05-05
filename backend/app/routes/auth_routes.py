from fastapi import APIRouter, Response, Request, HTTPException, Query
from datetime import datetime

from app.schemas.user_schema import UserSignup
from app.schemas.auth_schema import LoginSchema
from app.services.auth_service import (
    signup_user,
    login_user,
    verify_email,
    admin_login,
    get_me_service,
)
from app.config.db import sessions_collection

router = APIRouter()


# 🔹 SIGNUP
@router.post("/signup")
def signup(data: UserSignup):
    return signup_user(data)


# 🔹 LOGIN
@router.post("/login")
def login(data: LoginSchema, response: Response):
    result = login_user(data)

    # ✅ Allow both HTTP (localhost) and HTTPS (production)
    is_production = False  # Change to True in production
    response.set_cookie(
        key="sessionId",
        value=result["sessionId"],
        httponly=True,
        secure=is_production,
        samesite="lax" if not is_production else "none",
    )

    return {"message": result["message"]}


# 🔹 ADMIN LOGIN
@router.post("/admin-login")
def admin_login_route(data: LoginSchema, response: Response):
    result = admin_login(data)

    # ✅ Allow both HTTP (localhost) and HTTPS (production)
    is_production = False  # Change to True in production
    response.set_cookie(
        key="sessionId",
        value=result["sessionId"],
        httponly=True,
        secure=is_production,
        samesite="lax" if not is_production else "none",
    )

    return {"message": result["message"]}


# 🔹 GET CURRENT USER (🔥 MOST IMPORTANT FIX)
@router.get("/me")
def get_me(request: Request):
    session_id = request.cookies.get("sessionId")

    if not session_id:
        raise HTTPException(status_code=401, detail="No session")

    session = sessions_collection.find_one({"sessionId": session_id})

    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    from datetime import datetime

    print("NOW:", datetime.utcnow())
    print("EXPIRES:", session.get("expiresAt"))

    if "expiresAt" in session:
        if session["expiresAt"] < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Session expired")

    return get_me_service(session["userId"])


# 🔹 VERIFY EMAIL
@router.get("/verify-email")
def verify(token: str = Query(...)):
    return verify_email(token)


# 🔹 DEV ONLY: Verify by email (for testing without email service)
@router.get("/dev/verify-email/{email}")
def dev_verify(email: str):
    """Dev-only endpoint to verify email without token (testing purposes)"""
    from app.config.db import users_collection
    from bson import ObjectId
    
    result = users_collection.update_one(
        {"email": email},
        {"$set": {"isVerified": True}},
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"Email {email} verified successfully (dev mode)"}