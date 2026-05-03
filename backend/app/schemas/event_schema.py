from pydantic import BaseModel


class EventResponse(BaseModel):
    id: str
    name: str
    type: str
    maxTeamSize: int

class EventCreateSchema(BaseModel):
    name: str
    type: str
    description: str
    maxTeamSize: int = 4