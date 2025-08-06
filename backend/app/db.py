"""
Simple SQLite database setup with SQLAlchemy.
Provides in-memory storage for development and testing.
"""

import sqlite3
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

DATABASE_URL = "sqlite:///./cogniflow.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ProfileDB(Base):
    __tablename__ = "profiles"
    
    user_id = Column(String, primary_key=True)
    attention_span_minutes = Column(Integer)
    preferred_modalities = Column(Text)  # JSON string
    working_memory_index = Column(Float)
    anxiety_triggers = Column(Text)  # JSON string
    best_time_of_day = Column(String)
    suggestions = Column(Text)  # JSON string
    embedding = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.now)

class SRSItemDB(Base):
    __tablename__ = "srs_items"
    
    item_id = Column(String, primary_key=True)
    user_id = Column(String)
    content = Column(Text)
    easiness = Column(Float, default=2.5)
    interval = Column(Integer, default=1)
    repetitions = Column(Integer, default=0)
    next_due = Column(DateTime)
    last_reviewed = Column(DateTime)

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# In-memory storage for development (replace with Redis in production)
focus_events_store = []
session_store = {}

# Vector DB interface stub
class VectorDB:
    """Stub interface for vector database operations"""
    
    def __init__(self):
        self.vectors = {}  # In-memory storage for development
    
    def store_embedding(self, id: str, embedding: list, metadata: dict = None):
        """Store embedding with metadata"""
        self.vectors[id] = {
            "embedding": embedding,
            "metadata": metadata or {}
        }
    
    def search_similar(self, query_embedding: list, limit: int = 5) -> list:
        """Search for similar embeddings (stub implementation)"""
        # Simple cosine similarity stub
        import numpy as np
        
        results = []
        query_vec = np.array(query_embedding)
        
        for id, data in self.vectors.items():
            stored_vec = np.array(data["embedding"])
            similarity = np.dot(query_vec, stored_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(stored_vec))
            results.append({
                "id": id,
                "similarity": float(similarity),
                "metadata": data["metadata"]
            })
        
        return sorted(results, key=lambda x: x["similarity"], reverse=True)[:limit]

# Global vector DB instance
vector_db = VectorDB()
