def send_verification_email(email: str, token: str):
    print(f"""
    VERIFY EMAIL:
    http://localhost:8000/api/auth/verify-email?token={token}
    """)