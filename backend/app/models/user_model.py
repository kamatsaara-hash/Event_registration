def user_model(user) -> dict:
    return {
        "id": str(user["_id"]),
        "fullName": user["fullName"],
        "email": user["email"],
        "phone": user["phone"],
        "college": user["college"],
        "isVerified": user["isVerified"]
    }