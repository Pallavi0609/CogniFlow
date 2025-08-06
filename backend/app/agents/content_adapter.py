"""
ContentAdapterAgent: Adapts educational content to learner preferences and needs.
Generates multiple variants optimized for different learning styles.
"""

from ..models import ContentVariant, ContentRequest, Profile
from ..llm_client import llm_client
from typing import Dict, Any

class ContentAdapterAgent:
    """Adapts content to learner profiles and preferences"""
    
    async def convert_content(self, request: ContentRequest) -> ContentVariant:
        """
        Convert raw educational content into multiple adapted variants.
        Uses profile data to optimize for learner preferences.
        """
        
        # Prepare context for LLM
        profile_dict = request.profile.dict()
        
        # Use LLM to generate adapted content variants
        variants = await llm_client.adapt_content(request.raw_text, profile_dict)
        
        # Apply profile-specific adaptations
        adapted_variants = self._apply_profile_adaptations(variants, request.profile)
        
        return ContentVariant(**adapted_variants)
    
    def _apply_profile_adaptations(self, variants: Dict[str, str], profile: Profile) -> Dict[str, str]:
        """Apply profile-specific adaptations to content variants"""
        
        adapted = variants.copy()
        
        # Adjust for attention span
        if profile.attention_span_minutes < 15:
            adapted["micro_tasks"] = self._break_into_smaller_chunks(variants["micro_tasks"])
        
        # Add modality-specific suggestions
        if "auditory" in profile.preferred_modalities:
            adapted["simplified"] += "\n\n💡 Consider reading this aloud or using text-to-speech."
        
        if "visual" in profile.preferred_modalities:
            adapted["bullets"] += "\n\n📊 Try creating a mind map or diagram of these points."
        
        # Adjust for working memory
        if profile.working_memory_index < 0.5:
            adapted["simplified"] = self._reduce_cognitive_load(adapted["simplified"])
        
        return adapted
    
    def _break_into_smaller_chunks(self, content: str) -> str:
        """Break content into smaller, more manageable chunks"""
        lines = content.split('\n')
        chunked_lines = []
        
        for line in lines:
            if line.startswith('Step') and len(line) > 50:
                # Split long steps into sub-steps
                chunked_lines.append(line[:50] + "...")
                chunked_lines.append(f"  → {line[50:]}")
            else:
                chunked_lines.append(line)
        
        return '\n'.join(chunked_lines)
    
    def _reduce_cognitive_load(self, content: str) -> str:
        """Reduce cognitive load by simplifying language and structure"""
        # Simple implementation - in production, use more sophisticated NLP
        simplified = content.replace("however", "but")
        simplified = simplified.replace("therefore", "so")
        simplified = simplified.replace("consequently", "as a result")
        return simplified

# Global agent instance
content_adapter = ContentAdapterAgent()
