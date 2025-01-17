from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.v1 import auth, cards, tokens

app = FastAPI(title=settings.PROJECT_NAME)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Error handling middleware
@app.middleware("http")
async def errors_handling(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )

# API routes
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(cards.router, prefix=f"{settings.API_V1_STR}/cards", tags=["cards"])
app.include_router(tokens.router, prefix=f"{settings.API_V1_STR}/tokens", tags=["tokens"])

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
