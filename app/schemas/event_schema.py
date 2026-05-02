from pydantic import BaseModel


class EventResponse(BaseModel):
    id: str
    name: str
    type: str
    maxTeamSize: int