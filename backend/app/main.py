"""
FastAPI application entry point for CogniFlow adaptive learning platform.
Mounts agent routes and provides session orchestration.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
from .db import init_db

app = FastAPI(
    title="CogniFlow API",
    description="Adaptive e-learning platform with privacy-first AI agents",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Mount agent routes
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "CogniFlow API - Adaptive Learning Platform"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
