"""
NudgeAgent: Generates contextual learning interventions based on focus state and profile.
Provides gentle, non-patronizing nudges to improve learning effectiveness.
"""

from ..models import NudgeAction, FocusEvent, Profile
from ..llm_client import llm_client
from typing import Dict, Any

class NudgeAgent:
    """Generates contextual nudges and interventions"""
    
    async def generate_nudge(self, focus_event: FocusEvent, profile: Profile, 
                           context: Dict[str, Any]) -> NudgeAction:
        """
        Generate a contextual nudge based on focus state and learner profile.
        Uses LLM to create personalized, appropriate interventions.
        """
        
        # Prepare context for LLM
        nudge_context = {
            "focus_event": focus_event.dict(),
            "profile": profile.dict(),
            "session_context": context,
            "current_time": focus_event.timestamp.isoformat()
        }
        
        # Generate nudge using LLM
        nudge_data = await llm_client.generate_nudge(nudge_context)
        
        # Apply profile-specific adjustments
        adjusted_nudge = self._adjust_for_profile(nudge_data, profile)
        
        return NudgeAction(**adjusted_nudge)
    
    def _adjust_for_profile(self, nudge_data: Dict[str, Any], profile: Profile) -> Dict[str, Any]:
        """Adjust nudge based on learner profile and preferences"""
        
        adjusted = nudge_data.copy()
        
        # Adjust tone for anxiety triggers
        if "time_pressure" in profile.anxiety_triggers:
            adjusted["message"] = adjusted["message"].replace("quickly", "when you're ready")
            adjusted["message"] = adjusted["message"].replace("hurry", "take your time")
        
        # Adjust break duration for attention span
        if adjusted["type"] == "break" and profile.attention_span_minutes < 20:
            adjusted["payload"]["duration_minutes"] = min(3, adjusted["payload"].get("duration_minutes", 5))
        
        # Add modality-specific suggestions
        if "kinesthetic" in profile.preferred_modalities and adjusted["type"] == "break":
            adjusted["payload"]["activity_suggestion"] = "Try some light stretching or walking"
        
        return adjusted
    
    async def should_nudge(self, session_id: str, profile: Profile) -> bool:
        """Determine if a nudge is appropriate at this time"""
        
        # Simple heuristic - in production, use more sophisticated logic
        from ..db import focus_events_store
        from datetime import datetime, timedelta
        
        # Don't nudge too frequently
        recent_cutoff = datetime.now() - timedelta(minutes=10)
        recent_events = [
            event for event in focus_events_store
            if (event["session_id"] == session_id and 
                datetime.fromisoformat(event["timestamp"]) > recent_cutoff)
        ]
        
        # Check if there have been multiple distraction events
        distraction_events = [e for e in recent_events if e["event_type"] == "distraction"]
        
        return len(distraction_events) >= 2

# Global agent instance
nudge_agent = NudgeAgent()
