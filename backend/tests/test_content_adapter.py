"""
Unit tests for ContentAdapterAgent functionality.
Tests content adaptation and output format validation.
"""

import pytest
from app.agents.content_adapter import content_adapter
from app.models import ContentRequest, ContentVariant, Profile

@pytest.mark.asyncio
async def test_convert_content():
    """Test content adaptation with different profile types"""
    
    # Arrange
    profile = Profile(
        user_id="test_user",
        attention_span_minutes=15,  # Short attention span
        preferred_modalities=["visual", "reading"],
        working_memory_index=0.4,  # Low working memory
        anxiety_triggers=["time_pressure"],
        best_time_of_day="morning",
        suggestions=["Use visual aids"]
    )
    
    request = ContentRequest(
        raw_text="Photosynthesis is the process by which plants convert light energy into chemical energy. This complex biological process involves chlorophyll and occurs in the chloroplasts of plant cells.",
        profile=profile,
        subject="biology"
    )
    
    # Act
    variants = await content_adapter.convert_content(request)
    
    # Assert
    assert isinstance(variants, ContentVariant)
    assert len(variants.simplified) > 0
    assert len(variants.bullets) > 0
    assert len(variants.micro_tasks) > 0
    
    # Check that visual modality suggestion is included
    assert "visual" in variants.bullets.lower() or "diagram" in variants.bullets.lower()

def test_profile_adaptations():
    """Test profile-specific content adaptations"""
    
    # Test short attention span adaptation
    profile_short_attention = Profile(
        user_id="test",
        attention_span_minutes=10,
        preferred_modalities=["visual"],
        working_memory_index=0.8,
        anxiety_triggers=[],
        best_time_of_day="morning",
        suggestions=[]
    )
    
    original_content = "Step 1: This is a very long step that contains multiple concepts and requires significant cognitive processing to understand completely."
    
    adapted = content_adapter._break_into_smaller_chunks(original_content)
    
    # Should break long steps into smaller chunks
    assert "..." in adapted or "→" in adapted

def test_cognitive_load_reduction():
    """Test cognitive load reduction for low working memory"""
    
    original = "However, this process is complex. Therefore, we must consider the consequences."
    reduced = content_adapter._reduce_cognitive_load(original)
    
    # Should replace complex connectors with simpler ones
    assert "but" in reduced
    assert "so" in reduced
    assert "however" not in reduced.lower()
    assert "therefore" not in reduced.lower()

@pytest.mark.asyncio
async def test_content_variant_format():
    """Test that content variants follow expected format"""
    
    profile = Profile(
        user_id="test",
        attention_span_minutes=25,
        preferred_modalities=["reading"],
        working_memory_index=0.6,
        anxiety_triggers=[],
        best_time_of_day="morning",
        suggestions=[]
    )
    
    request = ContentRequest(
        raw_text="Test content for adaptation",
        profile=profile
    )
    
    variants = await content_adapter.convert_content(request)
    
    # Check that all variants are strings
    assert isinstance(variants.simplified, str)
    assert isinstance(variants.bullets, str)
    assert isinstance(variants.micro_tasks, str)
    
    # Check that micro_tasks contains step-like structure
    assert "step" in variants.micro_tasks.lower() or "1" in variants.micro_tasks
