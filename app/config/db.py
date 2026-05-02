from pymongo import MongoClient
from app.config.settings import MONGO_URL

client = MongoClient(MONGO_URL)

db = client["event_system"]

users_collection = db["users"]
events_collection = db["events"]
teams_collection = db["teams"]
registrations_collection = db["registrations"]
sessions_collection = db["sessions"]
email_tokens_collection = db["email_tokens"]