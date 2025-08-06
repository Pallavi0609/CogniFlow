"""
FocusTrackerAgent: Processes focus events from client-side attention tracking.
Maintains focus state and triggers interventions when needed.
"""

from ..models import FocusEvent
from ..db import focus_events_store
from typing import List, Dict, Any
from datetime import datetime, timedelta

class FocusTrackerAgent:
    """Processes and analyzes focus events from client-side tracking"""
    
    def __init__(self):
        self.focus_threshold = 0.7  # Minimum confidence for "focused" state
        self.distraction_window = 300  # 5 minutes in seconds
    
    async def log_focus_event(self, event: FocusEvent) -> Dict[str, Any]:
        """
        Log a focus event and return current focus state.
        Events come from client-side TensorFlow.js processing.
        """
        
        # Store event (in production, use Redis or database)
        focus_events_store.append(event.dict())
        
        # Analyze recent focus pattern
        focus_state = self._analyze_focus_state(event.session_id)
        
        return {
            "event_logged": True,
            "current_focus_score": focus_state["focus_score"],
            "trend": focus_state["trend"],
            "needs_intervention": focus_state["needs_intervention"]
        }
    
    def _analyze_focus_state(self, session_id: str) -> Dict[str, Any]:
        """Analyze recent focus events to determine current state"""
        
        # Get recent events for this session
        cutoff_time = datetime.now() - timedelta(seconds=self.distraction_window)
        recent_events = [
            event for event in focus_events_store
            if (event["session_id"] == session_id and 
                datetime.fromisoformat(event["timestamp"]) > cutoff_time)
        ]
        
        if not recent_events:
            return {
                "focus_score": 0.5,
                "trend": "unknown",
                "needs_intervention": False
            }
        
        # Calculate average focus score
        focus_scores = [event["confidence"] for event in recent_events]
        avg_focus = sum(focus_scores) / len(focus_scores)
        
        # Determine trend
        if len(focus_scores) >= 3:
            recent_avg = sum(focus_scores[-3:]) / 3
            older_avg = sum(focus_scores[:-3]) / max(1, len(focus_scores) - 3)
            trend = "improving" if recent_avg > older_avg else "declining"
        else:
            trend = "stable"
        
        # Check if intervention is needed
        distraction_events = [e for e in recent_events if e["event_type"] == "distraction"]
        needs_intervention = (
            avg_focus < self.focus_threshold or 
            len(distraction_events) >= 3
        )
        
        return {
            "focus_score": avg_focus,
            "trend": trend,
            "needs_intervention": needs_intervention
        }
    
    async def get_session_summary(self, session_id: str) -> Dict[str, Any]:
        """Get focus summary for a learning session"""
        
        session_events = [
            event for event in focus_events_store
            if event["session_id"] == session_id
        ]
        
        if not session_events:
            return {"error": "No events found for session"}
        
        focus_scores = [event["confidence"] for event in session_events]
        distraction_count = len([e for e in session_events if e["event_type"] == "distraction"])
        
        return {
            "total_events": len(session_events),
            "average_focus": sum(focus_scores) / len(focus_scores),
            "distraction_count": distraction_count,
            "session_duration_minutes": self._calculate_session_duration(session_events)
        }
    
    def _calculate_session_duration(self, events: List[Dict]) -> float:
        """Calculate session duration from events"""
        if len(events) < 2:
            return 0
        
        start_time = datetime.fromisoformat(events[0]["timestamp"])
        end_time = datetime.fromisoformat(events[-1]["timestamp"])
        duration = (end_time - start_time).total_seconds() / 60
        
        return round(duration, 2)

# Global agent instance
focus_tracker = FocusTrackerAgent()
