"""
Pydantic models for CogniFlow data structures.
Defines schemas for profiles, content variants, focus events, and nudges.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AttentionSpan(str, Enum):
    SHORT = "short"  # 5-15 minutes
    MEDIUM = "medium"  # 15-30 minutes
    LONG = "long"  # 30+ minutes

class LearningModality(str, Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    KINESTHETIC = "kinesthetic"
    READING = "reading"

class Profile(BaseModel):
    user_id: str
    attention_span_minutes: int = Field(ge=5, le=120)
    preferred_modalities: List[LearningModality]
    working_memory_index: float = Field(ge=0.0, le=1.0)
    anxiety_triggers: List[str]
    best_time_of_day: str
    suggestions: List[str]
    embedding: List[float] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)

class OnboardingData(BaseModel):
    age_range: str
    learning_goals: List[str]
    previous_experience: str
    attention_challenges: List[str]
    preferred_pace: str
    accessibility_needs: List[str]

class ContentVariant(BaseModel):
    simplified: str = Field(description="Simplified version with clear language")
    bullets: str = Field(description="Bullet-point format")
    micro_tasks: str = Field(description="Broken into small actionable steps")

class ContentRequest(BaseModel):
    raw_text: str
    profile: Profile
    subject: Optional[str] = None

class FocusEvent(BaseModel):
    session_id: str
    event_type: str  # "attention_drop", "distraction", "focus_restored"
    confidence: float = Field(ge=0.0, le=1.0)
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class NudgeAction(BaseModel):
    type: str  # "break", "breathing", "adjust_difficulty"
    payload: Dict[str, Any]
    message: str
    priority: int = Field(ge=1, le=5)

class SRSItem(BaseModel):
    item_id: str
    user_id: str
    content: str
    easiness: float = 2.5
    interval: int = 1
    repetitions: int = 0
    next_due: datetime
    last_reviewed: Optional[datetime] = None

class QuizResult(BaseModel):
    item_id: str
    user_id: str
    quality: int = Field(ge=0, le=5)  # SM-2 quality rating
    response_time_ms: int
    timestamp: datetime = Field(default_factory=datetime.now)

class SessionStep(BaseModel):
    session_id: str
    user_id: str
    content_id: str
    step_type: str  # "content", "quiz", "break"
    completed: bool = False
