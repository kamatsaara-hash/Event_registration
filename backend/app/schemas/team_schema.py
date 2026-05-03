from pydantic import BaseModel


class CreateTeamSchema(BaseModel):
    eventId: str
    teamName: str
    teamSize: int = 6


class JoinTeamSchema(BaseModel):
    eventId: str
    teamCode: str