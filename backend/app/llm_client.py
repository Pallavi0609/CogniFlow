"""
Pluggable LLM client interface with OpenAI and local stub implementations.
Provides consistent API for all agent LLM interactions.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List
import json
import random
import os
from openai import OpenAI

class LLMClient(ABC):
    """Abstract base class for LLM integrations"""
    
    @abstractmethod
    async def summarize_profile(self, onboarding_data: Dict[str, Any]) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def adapt_content(self, text: str, profile: Dict[str, Any]) -> Dict[str, str]:
        pass
    
    @abstractmethod
    async def generate_nudge(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

class OpenAIClient(LLMClient):
    """OpenAI API client for production use"""
    
    def __init__(self, api_key: str = None):
        self.client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
    
    async def summarize_profile(self, onboarding_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate learner profile using OpenAI"""
        
        # Load prompt template
        with open("app/prompts/profile_prompt.txt", "r") as f:
            prompt_template = f.read()
        
        prompt = prompt_template.format(onboarding_data=json.dumps(onboarding_data, indent=2))
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a learning profile analyzer for neurodivergent students."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            # Fallback to stub response if JSON parsing fails
            return LocalStubClient().summarize_profile(onboarding_data)
    
    async def adapt_content(self, text: str, profile: Dict[str, Any]) -> Dict[str, str]:
        """Adapt content using OpenAI"""
        
        with open("app/prompts/content_adapter_prompt.txt", "r") as f:
            prompt_template = f.read()
        
        prompt = prompt_template.format(
            content=text,
            profile=json.dumps(profile, indent=2)
        )
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a content adaptation specialist for neurodivergent learners."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=800
        )
        
        content = response.choices[0].message.content
        
        # Parse the structured response
        try:
            sections = content.split("SIMPLIFIED:")
            if len(sections) > 1:
                simplified = sections[1].split("BULLETS:")[0].strip()
                bullets = sections[1].split("BULLETS:")[1].split("MICRO_TASKS:")[0].strip()
                micro_tasks = sections[1].split("MICRO_TASKS:")[1].strip()
                
                return {
                    "simplified": simplified,
                    "bullets": bullets,
                    "micro_tasks": micro_tasks
                }
        except:
            pass
        
        # Fallback to stub if parsing fails
        return await LocalStubClient().adapt_content(text, profile)
    
    async def generate_nudge(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate nudge using OpenAI"""
        
        with open("app/prompts/nudge_prompt.txt", "r") as f:
            prompt_template = f.read()
        
        prompt = prompt_template.format(context=json.dumps(context, indent=2))
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a supportive learning coach for neurodivergent students."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=300
        )
        
        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            return await LocalStubClient().generate_nudge(context)

class LocalStubClient(LLMClient):
    """Deterministic stub for testing and development"""
    
    async def summarize_profile(self, onboarding_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate deterministic profile for testing"""
        return {
            "attention_span_minutes": 25,
            "preferred_modalities": ["visual", "reading"],
            "working_memory_index": 0.7,
            "anxiety_triggers": ["time_pressure", "complex_instructions"],
            "best_time_of_day": "morning",
            "suggestions": [
                "Use visual aids and diagrams",
                "Break tasks into 20-minute chunks",
                "Provide clear step-by-step instructions"
            ]
        }
    
    async def adapt_content(self, text: str, profile: Dict[str, Any]) -> Dict[str, str]:
        """Generate deterministic content variants"""
        word_count = len(text.split())
        
        return {
            "simplified": f"Simplified version of {word_count} words: {text[:100]}...",
            "bullets": f"• Key point 1\n• Key point 2\n• Key point 3",
            "micro_tasks": f"Step 1: Read first paragraph\nStep 2: Take notes\nStep 3: Review key concepts"
        }
    
    async def generate_nudge(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate deterministic nudge for testing"""
        nudges = [
            {
                "type": "break",
                "payload": {"duration_minutes": 5},
                "message": "Time for a quick break! Step away from the screen for 5 minutes.",
                "priority": 3
            },
            {
                "type": "breathing",
                "payload": {"technique": "4-7-8"},
                "message": "Let's try a breathing exercise to refocus.",
                "priority": 2
            }
        ]
        return random.choice(nudges)

# Global client instance - can be swapped for OpenAI in production
llm_client = LocalStubClient()
# Uncomment for OpenAI integration:
# llm_client = OpenAIClient()
