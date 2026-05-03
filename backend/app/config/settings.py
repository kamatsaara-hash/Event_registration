import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL") or os.getenv("MONGO_URI")

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

SESSION_EXPIRE_HOURS = 24
EMAIL_TOKEN_EXPIRE_MINUTES = 30