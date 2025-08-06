"""
ProfileAgent: Builds learner profiles from onboarding data and learning history.
Generates embeddings for semantic matching and personalization.
"""

from ..models import Profile, OnboardingData
from ..llm_client import llm_client
from ..db import vector_db
import numpy as np
from typing import Dict, Any

class ProfileAgent:
    """Builds and maintains learner profiles"""
    
    async def build_profile(self, user_id: str, onboarding_data: OnboardingData) -> Profile:
        """
        Create a learner profile from onboarding data.
        Uses LLM to analyze preferences and generate recommendations.
        """
        
        # Convert onboarding data to dict for LLM processing
        onboarding_dict = onboarding_data.dict()
        
        # Use LLM to analyze and summarize profile
        profile_data = await llm_client.summarize_profile(onboarding_dict)
        
        # Generate embedding vector
        embedding = self._generate_embedding(profile_data)
        
        # Create profile object
        profile = Profile(
            user_id=user_id,
            attention_span_minutes=profile_data["attention_span_minutes"],
            preferred_modalities=profile_data["preferred_modalities"],
            working_memory_index=profile_data["working_memory_index"],
            anxiety_triggers=profile_data["anxiety_triggers"],
            best_time_of_day=profile_data["best_time_of_day"],
            suggestions=profile_data["suggestions"],
            embedding=embedding
        )
        
        # Store embedding in vector DB
        vector_db.store_embedding(
            user_id, 
            embedding, 
            {"profile_type": "learner", "created_at": profile.created_at.isoformat()}
        )
        
        return profile
    
    def _generate_embedding(self, profile_data: Dict[str, Any]) -> list[float]:
        """
        Generate embedding vector for profile.
        Stub implementation - replace with actual embedding model.
        """
        # Simple hash-based embedding for development
        profile_str = str(sorted(profile_data.items()))
        np.random.seed(hash(profile_str) % 2**32)
        return np.random.normal(0, 1, 384).tolist()  # 384-dim vector
    
    async def update_profile(self, user_id: str, learning_data: Dict[str, Any]) -> Profile:
        """Update profile based on learning behavior and performance"""
        # TODO: Implement profile updates based on learning analytics
        pass

# Global agent instance
profile_agent = ProfileAgent()
