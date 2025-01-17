from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.v1 import auth, cards, tokens
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Mount static files directory
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix=settings.API_V1_STR + "/auth", tags=["auth"])
app.include_router(cards.router, prefix=settings.API_V1_STR + "/cards", tags=["cards"])
app.include_router(tokens.router, prefix=settings.API_V1_STR + "/tokens", tags=["tokens"])

# Health check endpoint
@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
