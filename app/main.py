from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_routes import router as auth_router
from app.routes.event_routes import router as event_router
from app.services.event_service import seed_events
from app.routes.team_routes import router as team_router
from app.routes.user_routes import router as user_router
from app.routes.admin_routes import router as admin_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    seed_events()

# ✅ ROUTES
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(event_router, prefix="/api/events", tags=["Events"])  # ← THIS WAS MISSING
app.include_router(team_router, prefix="/api/team", tags=["Team"])
app.include_router(user_router, prefix="/api/user", tags=["User"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])


@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}