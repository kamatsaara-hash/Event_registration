from fastapi import APIRouter, Response, Query
from app.schemas.user_schema import UserSignup
from app.schemas.auth_schema import LoginSchema
from app.services.auth_service import (
    signup_user,
    login_user,
    verify_email,
    admin_login
)

router = APIRouter()


# 🔹 SIGNUP
@router.post("/signup")
def signup(data: UserSignup):
    return signup_user(data)


# 🔹 USER LOGIN
@router.post("/login")
def login(data: LoginSchema, response: Response):
    result = login_user(data)

    response.set_cookie(
        key="sessionId",
        value=result["sessionId"],
        httponly=True
    )

    return {"message": result["message"]}


# 🔹 ADMIN LOGIN
@router.post("/admin-login")
def admin_login_route(data: LoginSchema, response: Response):
    result = admin_login(data)

    response.set_cookie(
        key="sessionId",
        value=result["sessionId"],
        httponly=True
    )

    return {"message": result["message"]}


# 🔹 VERIFY EMAIL
@router.get("/verify-email")
def verify(token: str = Query(...)):
    return verify_email(token)