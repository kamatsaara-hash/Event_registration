from app.config.db import users_collection, sessions_collection, email_tokens_collection
from app.utils.security import hash_password, verify_password
from app.models.session_model import create_session
from app.models.email_token_model import create_email_token
from app.services.email_service import send_verification_email
from app.config.settings import ADMIN_EMAIL, ADMIN_PASSWORD

from fastapi import HTTPException
from datetime import datetime
from bson import ObjectId


# 🔹 SIGNUP
def signup_user(data):
    if data.password != data.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = {
        "fullName": data.fullName,
        "email": data.email,
        "phone": data.phone,
        "college": data.college,
        "password": hash_password(data.password),
        "isVerified": False,
        "createdAt": datetime.utcnow(),
    }

    result = users_collection.insert_one(user)

    token_data = create_email_token(str(result.inserted_id))
    email_tokens_collection.insert_one(token_data)

    send_verification_email(data.email, token_data["token"])

    return {"message": "User registered. Verify your email."}


# 🔹 VERIFY EMAIL
def verify_email(token: str):
    token_data = email_tokens_collection.find_one({"token": token})

    if not token_data:
        raise HTTPException(status_code=400, detail="Invalid token")

    if token_data["expiresAt"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    users_collection.update_one(
        {"_id": ObjectId(token_data["userId"])},
        {"$set": {"isVerified": True}},
    )

    email_tokens_collection.delete_one({"token": token})

    return {"message": "Email verified successfully"}


# 🔹 USER LOGIN
def login_user(data):
    user = users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not user.get("isVerified", False):
        raise HTTPException(status_code=403, detail="Email not verified")

    session = create_session(str(user["_id"]))
    sessions_collection.insert_one(session)

    return {
        "message": "Login successful",
        "sessionId": session["sessionId"],  # ✅ FIXED
    }


# 🔹 ADMIN LOGIN
def admin_login(data):
    if data.email != ADMIN_EMAIL or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    session = create_session("admin")
    sessions_collection.insert_one(session)

    return {
        "message": "Admin login successful",
        "sessionId": session["sessionId"],  # ✅ FIXED
    }


# 🔹 GET CURRENT USER DATA
def get_me_service(user_id: str):
    if user_id == "admin":
        return {
            "id": "admin",
            "fullName": "Admin User",
            "email": ADMIN_EMAIL,
            "role": "admin",
            "emailVerified": True,
        }

    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "fullName": user["fullName"],
        "email": user["email"],
        "phone": user.get("phone", ""),
        "college": user.get("college", ""),
        "role": "participant",
        "emailVerified": user.get("isVerified", False),
    }