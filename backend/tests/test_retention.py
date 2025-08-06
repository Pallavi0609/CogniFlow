"""
Unit tests for RetentionAgent SRS scheduling functionality.
Tests SM-2 algorithm implementation and schedule updates.
"""

import pytest
from datetime import datetime, timedelta
from app.agents.retention_agent import retention_agent
from app.models import SRSItem, QuizResult

@pytest.mark.asyncio
async def test_sm2_scheduling():
    """Test SM-2 algorithm implementation"""
    
    # Arrange - Create initial SRS item
    item = SRSItem(
        item_id="test_item",
        user_id="test_user",
        content="Test question",
        easiness=2.5,
        interval=1,
        repetitions=0,
        next_due=datetime.now()
    )
    
    # Act - Report correct answer (quality = 4)
    quiz_result = QuizResult(
        item_id="test_item",
        user_id="test_user",
        quality=4,
        response_time_ms=3000
    )
    
    result = await retention_agent.report_quiz_result(quiz_result)
    
    # Assert
    assert result["schedule_updated"] is True
    assert result["interval_days"] > 1  # Should increase interval
    assert result["repetitions"] == 1  # Should increment repetitions
    
    # Get updated item
    updated_item = retention_agent.srs_items["test_item"]
    assert updated_item.repetitions == 1
    assert updated_item.interval > 1

@pytest.mark.asyncio
async def test_incorrect_answer_reset():
    """Test that incorrect answers reset the schedule"""
    
    # Arrange - Item with some progress
    item = SRSItem(
        item_id="test_item_2",
        user_id="test_user",
        content="Test question 2",
        easiness=2.8,
        interval=6,
        repetitions=2,
        next_due=datetime.now()
    )
    retention_agent.srs_items["test_item_2"] = item
    
    # Act - Report incorrect answer (quality = 1)
    quiz_result = QuizResult(
        item_id="test_item_2",
        user_id="test_user",
        quality=1,
        response_time_ms=8000
    )
    
    result = await retention_agent.report_quiz_result(quiz_result)
    
    # Assert - Should reset progress
    updated_item = retention_agent.srs_items["test_item_2"]
    assert updated_item.repetitions == 0  # Reset to 0
    assert updated_item.interval == 1  # Reset to 1 day
    assert result["repetitions"] == 0

@pytest.mark.asyncio
async def test_get_due_items():
    """Test retrieval of items due for review"""
    
    # Arrange - Add items with different due dates
    past_due = datetime.now() - timedelta(days=1)
    future_due = datetime.now() + timedelta(days=1)
    
    await retention_agent.add_item("user1", "Past due item", "past_item")
    await retention_agent.add_item("user1", "Future item", "future_item")
    
    # Manually set due dates
    retention_agent.srs_items["past_item"].next_due = past_due
    retention_agent.srs_items["future_item"].next_due = future_due
    
    # Act
    due_items = await retention_agent.get_due_items("user1")
    
    # Assert
    assert len(due_items) >= 1  # At least the past due item
    due_item_ids = [item.item_id for item in due_items]
    assert "past_item" in due_item_ids
    assert "future_item" not in due_item_ids

def test_easiness_bounds():
    """Test that easiness factor stays within bounds"""
    
    item = SRSItem(
        item_id="bounds_test",
        user_id="test_user",
        content="Test",
        easiness=1.5,  # Low easiness
        interval=1,
        repetitions=0,
        next_due=datetime.now()
    )
    
    # Test with very poor quality (0)
    updated_item = retention_agent._update_sm2_schedule(item, 0)
    
    # Easiness should not go below 1.3
    assert updated_item.easiness >= 1.3
