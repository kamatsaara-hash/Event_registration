# app/services/email_service.py

import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


def send_verification_email(to_email: str, token: str):
    verify_link = f"http://localhost:8000/api/auth/verify-email?token={token}"

    subject = "Verify Your Email"
    body = f"""
Hi,

Click the link below to verify your email:

{verify_link}

If you didn’t sign up, ignore this email.
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    try:
        print("📧 Sending email to:", to_email)

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        print("✅ Email sent successfully")

    except Exception as e:
        print("❌ Email sending error:", e)