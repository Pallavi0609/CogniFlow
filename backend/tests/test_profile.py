"""
Unit tests for ProfileAgent functionality.
Tests profile creation and data validation.
"""

import pytest
from app.agents.profile_agent import profile_agent
from app.models import OnboardingData, Profile

@pytest.mark.asyncio
async def test_build_profile():
    """Test profile creation from onboarding data"""
    
    # Arrange
    onboarding_data = OnboardingData(
        age_range="18-25",
        learning_goals=["improve focus", "better retention"],
        previous_experience="some online courses",
        attention_challenges=["easily distracted", "short attention span"],
        preferred_pace="moderate",
        accessibility_needs=["clear instructions"]
    )
    
    # Act
    profile = await profile_agent.build_profile("test_user", onboarding_data)
    
    # Assert
    assert isinstance(profile, Profile)
    assert profile.user_id == "test_user"
    assert 5 <= profile.attention_span_minutes <= 120
    assert 0.0 <= profile.working_memory_index <= 1.0
    assert len(profile.preferred_modalities) > 0
    assert len(profile.suggestions) > 0
    assert len(profile.embedding) == 384  # Expected embedding dimension

def test_profile_validation():
    """Test profile model validation"""
    
    # Test valid profile
    valid_profile = Profile(
        user_id="test",
        attention_span_minutes=25,
        preferred_modalities=["visual", "reading"],
        working_memory_index=0.7,
        anxiety_triggers=["time_pressure"],
        best_time_of_day="morning",
        suggestions=["Use visual aids"]
    )
    
    assert valid_profile.user_id == "test"
    
    # Test invalid attention span
    with pytest.raises(ValueError):
        Profile(
            user_id="test",
            attention_span_minutes=200,  # Too high
            preferred_modalities=["visual"],
            working_memory_index=0.7,
            anxiety_triggers=[],
            best_time_of_day="morning",
            suggestions=[]
        )

def test_embedding_generation():
    """Test that embeddings are generated consistently"""
    
    profile_data = {
        "attention_span_minutes": 25,
        "preferred_modalities": ["visual"],
        "working_memory_index": 0.7
    }
    
    # Generate embedding twice with same data
    embedding1 = profile_agent._generate_embedding(profile_data)
    embedding2 = profile_agent._generate_embedding(profile_data)
    
    # Should be identical (deterministic)
    assert embedding1 == embedding2
    assert len(embedding1) == 384
