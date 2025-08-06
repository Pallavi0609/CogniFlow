"""
Database bootstrap script for CogniFlow.
Creates tables and adds sample data for development.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import init_db, SessionLocal
from app.models import Profile, SRSItem
from datetime import datetime, timedelta

def bootstrap_database():
    """Initialize database with sample data"""
    
    print("Initializing database...")
    init_db()
    
    db = SessionLocal()
    
    try:
        # Add sample SRS items for testing
        from app.agents.retention_agent import retention_agent
        
        sample_items = [
            ("user1", "What is the capital of France?", "item1"),
            ("user1", "Define photosynthesis", "item2"),
            ("user1", "Explain Newton's first law", "item3"),
        ]
        
        for user_id, content, item_id in sample_items:
            item = await retention_agent.add_item(user_id, content, item_id)
            print(f"Added SRS item: {item_id}")
        
        print("Database bootstrap completed successfully!")
        
    except Exception as e:
        print(f"Error during bootstrap: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(bootstrap_database())
