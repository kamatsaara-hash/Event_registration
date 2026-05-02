from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    college: str
    password: str
    confirmPassword: str