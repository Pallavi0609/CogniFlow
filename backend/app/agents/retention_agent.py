"""
RetentionAgent: Manages spaced repetition scheduling using SM-2 algorithm.
Optimizes review timing based on performance and forgetting curves.
"""

from ..models import SRSItem, QuizResult
from datetime import datetime, timedelta
from typing import Dict, Any, List
import math

class RetentionAgent:
    """Manages spaced repetition scheduling for optimal retention"""
    
    def __init__(self):
        # In-memory storage for development (replace with database)
        self.srs_items: Dict[str, SRSItem] = {}
    
    async def report_quiz_result(self, result: QuizResult) -> Dict[str, Any]:
        """
        Process quiz result and update SRS schedule using SM-2 algorithm.
        Returns updated schedule and next review time.
        """
        
        # Get or create SRS item
        srs_item = self.srs_items.get(result.item_id)
        if not srs_item:
            srs_item = SRSItem(
                item_id=result.item_id,
                user_id=result.user_id,
                content="",  # Would be populated from content database
                next_due=datetime.now()
            )
        
        # Apply SM-2 algorithm
        updated_item = self._update_sm2_schedule(srs_item, result.quality)
        self.srs_items[result.item_id] = updated_item
        
        return {
            "item_id": result.item_id,
            "next_review": updated_item.next_due.isoformat(),
            "interval_days": updated_item.interval,
            "easiness": updated_item.easiness,
            "repetitions": updated_item.repetitions,
            "schedule_updated": True
        }
    
    def _update_sm2_schedule(self, item: SRSItem, quality: int) -> SRSItem:
        """
        Update SRS item using SM-2 algorithm.
        Quality: 0-5 scale (0=complete blackout, 5=perfect response)
        """
        
        # Update easiness factor
        new_easiness = item.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        new_easiness = max(1.3, new_easiness)  # Minimum easiness
        
        # Update repetitions and interval
        if quality < 3:
            # Incorrect response - reset repetitions
            new_repetitions = 0
            new_interval = 1
        else:
            # Correct response - increase repetitions
            new_repetitions = item.repetitions + 1
            
            if new_repetitions == 1:
                new_interval = 1
            elif new_repetitions == 2:
                new_interval = 6
            else:
                new_interval = math.ceil(item.interval * new_easiness)
        
        # Calculate next due date
        next_due = datetime.now() + timedelta(days=new_interval)
        
        # Update item
        item.easiness = new_easiness
        item.repetitions = new_repetitions
        item.interval = new_interval
        item.next_due = next_due
        item.last_reviewed = datetime.now()
        
        return item
    
    async def get_due_items(self, user_id: str, limit: int = 10) -> List[SRSItem]:
        """Get items due for review for a specific user"""
        
        now = datetime.now()
        due_items = [
            item for item in self.srs_items.values()
            if item.user_id == user_id and item.next_due <= now
        ]
        
        # Sort by due date (oldest first)
        due_items.sort(key=lambda x: x.next_due)
        
        return due_items[:limit]
    
    async def add_item(self, user_id: str, content: str, item_id: str = None) -> SRSItem:
        """Add a new item to the SRS system"""
        
        if not item_id:
            item_id = f"{user_id}_{len(self.srs_items)}"
        
        item = SRSItem(
            item_id=item_id,
            user_id=user_id,
            content=content,
            next_due=datetime.now()  # Due immediately for first review
        )
        
        self.srs_items[item_id] = item
        return item

# Global agent instance
retention_agent = RetentionAgent()
