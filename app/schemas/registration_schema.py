from pydantic import BaseModel


class RegisterEventSchema(BaseModel):
    eventId: str