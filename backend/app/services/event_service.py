from app.config.db import events_collection
from app.constants.events import EVENTS
from app.models.event_model import event_model   # 👈 ADD THIS


def seed_events():
    if events_collection.count_documents({}) > 0:
        return

    events_collection.insert_many(EVENTS)


def get_all_events():
    events = list(events_collection.find())

    # ✅ clean transformation
    return [event_model(event) for event in events]