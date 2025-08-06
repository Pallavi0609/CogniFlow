"""
FastAPI routes for CogniFlow agents and session orchestration.
Provides REST API endpoints for all agent interactions.
"""

from fastapi import APIRouter, HTTPException, Depends
from .models import *
from .agents.profile_agent import profile_agent
from .agents.content_adapter import content_adapter
from .agents.focus_tracker import focus_tracker
from .agents.nudge_agent import nudge_agent
from .agents.retention_agent import retention_agent
from .db import get_db, session_store
from typing import Dict, Any

router = APIRouter()

# Profile Agent Routes
@router.post("/agents/profile/build", response_model=Profile)
async def build_profile(user_id: str, onboarding_data: OnboardingData):
    """Build learner profile from onboarding data"""
    try:
        profile = await profile_agent.build_profile(user_id, onboarding_data)
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Content Adapter Routes
@router.post("/agents/content/convert", response_model=ContentVariant)
async def convert_content(request: ContentRequest):
    """Convert content to multiple adapted variants"""
    try:
        variants = await content_adapter.convert_content(request)
        return variants
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Focus Tracker Routes
@router.post("/agents/focus/events")
async def log_focus_event(event: FocusEvent):
    """Log focus event from client-side tracking"""
    try:
        result = await focus_tracker.log_focus_event(event)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents/focus/session/{session_id}/summary")
async def get_focus_summary(session_id: str):
    """Get focus summary for a session"""
    try:
        summary = await focus_tracker.get_session_summary(session_id)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Nudge Agent Routes
@router.post("/agents/nudge/act", response_model=NudgeAction)
async def generate_nudge(focus_event: FocusEvent, profile: Profile, context: Dict[str, Any] = {}):
    """Generate contextual nudge based on focus state"""
    try:
        nudge = await nudge_agent.generate_nudge(focus_event, profile, context)
        return nudge
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Retention Agent Routes
@router.post("/agents/retention/report")
async def report_quiz_result(result: QuizResult):
    """Report quiz result and update SRS schedule"""
    try:
        schedule_update = await retention_agent.report_quiz_result(result)
        return schedule_update
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents/retention/due/{user_id}")
async def get_due_items(user_id: str, limit: int = 10):
    """Get items due for review"""
    try:
        due_items = await retention_agent.get_due_items(user_id, limit)
        return {"due_items": due_items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Session Orchestration
@router.post("/session/{session_id}/step")
async def orchestrate_session_step(session_id: str, step: SessionStep):
    """Orchestrate a learning session step across multiple agents"""
    try:
        # Store session state
        if session_id not in session_store:
            session_store[session_id] = {"steps": [], "profile": None}
        
        session_store[session_id]["steps"].append(step.dict())
        
        # Orchestration logic would go here
        # For now, return a simple response
        return {
            "session_id": session_id,
            "step_completed": True,
            "next_action": "continue",
            "message": "Session step processed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}")
async def get_session_state(session_id: str):
    """Get current session state"""
    if session_id not in session_store:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session_store[session_id]

# Admin endpoint for user data export (privacy compliance)
@router.get("/admin/user/{user_id}/export")
async def export_user_data(user_id: str):
    """Export user profile summary (no raw telemetry)"""
    try:
        # Return only aggregated, non-sensitive data
        return {
            "user_id": user_id,
            "profile_summary": "Profile data would be here",
            "learning_stats": "Aggregated learning statistics",
            "note": "Raw focus events and detailed telemetry are not included for privacy"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
