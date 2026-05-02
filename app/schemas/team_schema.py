from pydantic import BaseModel


class CreateTeamSchema(BaseModel):
    eventId: str
    teamName: str


class JoinTeamSchema(BaseModel):
    eventId: str
    teamCode: str