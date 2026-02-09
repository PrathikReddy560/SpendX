# Gemini Client Wrapper
# Production-ready Gemini API client with retry, fallback, and error handling

import asyncio
import logging
from typing import Optional
from dataclasses import dataclass
from enum import Enum

import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

logger = logging.getLogger(__name__)


class GeminiStatus(Enum):
    """Status codes for Gemini API responses."""
    OK = "ok"
    RATE_LIMITED = "rate_limited"
    QUOTA_EXCEEDED = "quota_exceeded"
    INVALID_KEY = "invalid_key"
    MODEL_NOT_FOUND = "model_not_found"
    ERROR = "error"


@dataclass
class GeminiResponse:
    """Structured response from Gemini API."""
    success: bool
    content: str
    status: GeminiStatus
    model_used: Optional[str] = None
    error_message: Optional[str] = None


# Supported models in fallback order
# Using models that work with google.generativeai SDK
FALLBACK_MODELS = [
    "models/gemini-pro",
    "gemini-pro",
]


class GeminiClient:
    """
    Production-safe Gemini API wrapper.
    
    Features:
    - Automatic retry with exponential backoff
    - Model fallback chain when quota exceeded
    - Structured error handling
    - Request logging
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self._configured = False
        self._models: dict = {}
        
        if api_key:
            self._configure()
    
    def _configure(self) -> None:
        """Configure Gemini SDK with API key."""
        try:
            genai.configure(api_key=self.api_key)
            self._configured = True
            logger.info("Gemini API configured successfully")
        except Exception as e:
            logger.error(f"Failed to configure Gemini: {e}")
            self._configured = False
    
    def _get_model(self, model_name: str):
        """Get or create a model instance (cached)."""
        if model_name not in self._models:
            self._models[model_name] = genai.GenerativeModel(model_name)
        return self._models[model_name]
    
    @property
    def is_configured(self) -> bool:
        """Check if client is properly configured."""
        return self._configured
    
    async def generate(
        self,
        prompt: str,
        max_retries: int = 3,
        initial_delay: float = 1.0,
    ) -> GeminiResponse:
        """
        Generate content with automatic retry and model fallback.
        
        Args:
            prompt: The prompt to send to Gemini
            max_retries: Max retry attempts per model
            initial_delay: Initial delay for exponential backoff (seconds)
            
        Returns:
            GeminiResponse with success status and content
        """
        if not self._configured:
            logger.warning("Gemini API not configured, returning fallback")
            return GeminiResponse(
                success=False,
                content=self._get_fallback_message(),
                status=GeminiStatus.INVALID_KEY,
                error_message="Gemini API not configured"
            )
        
        last_error = None
        
        # Try each model in fallback order
        for model_name in FALLBACK_MODELS:
            result = await self._try_model_with_retry(
                model_name=model_name,
                prompt=prompt,
                max_retries=max_retries,
                initial_delay=initial_delay,
            )
            
            if result.success:
                logger.info(f"Successfully generated with model: {model_name}")
                return result
            
            last_error = result.error_message
            
            # Don't try other models for certain errors
            if result.status == GeminiStatus.INVALID_KEY:
                logger.error("Invalid API key, stopping fallback chain")
                break
            
            logger.warning(f"Model {model_name} failed: {result.status.value}, trying next...")
        
        # All models failed - return fallback
        logger.error(f"All Gemini models failed. Last error: {last_error}")
        return GeminiResponse(
            success=False,
            content=self._get_fallback_message(),
            status=GeminiStatus.ERROR,
            error_message=last_error
        )
    
    async def _try_model_with_retry(
        self,
        model_name: str,
        prompt: str,
        max_retries: int,
        initial_delay: float,
    ) -> GeminiResponse:
        """Try a specific model with exponential backoff retry."""
        model = self._get_model(model_name)
        delay = initial_delay
        
        for attempt in range(max_retries):
            try:
                # Run in executor since genai is synchronous
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: model.generate_content(prompt)
                )
                
                return GeminiResponse(
                    success=True,
                    content=response.text,
                    status=GeminiStatus.OK,
                    model_used=model_name
                )
                
            except google_exceptions.ResourceExhausted as e:
                # Rate limit / quota exceeded
                error_str = str(e).lower()
                if "quota" in error_str:
                    status = GeminiStatus.QUOTA_EXCEEDED
                else:
                    status = GeminiStatus.RATE_LIMITED
                
                if attempt < max_retries - 1:
                    logger.warning(
                        f"Rate limited on {model_name}, "
                        f"retrying in {delay:.1f}s (attempt {attempt + 1}/{max_retries})"
                    )
                    await asyncio.sleep(delay)
                    delay *= 2  # Exponential backoff
                else:
                    return GeminiResponse(
                        success=False,
                        content="",
                        status=status,
                        error_message=str(e)[:100]
                    )
                    
            except google_exceptions.NotFound as e:
                # Model doesn't exist
                return GeminiResponse(
                    success=False,
                    content="",
                    status=GeminiStatus.MODEL_NOT_FOUND,
                    error_message=f"Model {model_name} not found"
                )
                
            except google_exceptions.InvalidArgument as e:
                # Invalid API key or bad request
                return GeminiResponse(
                    success=False,
                    content="",
                    status=GeminiStatus.INVALID_KEY,
                    error_message="Invalid API key or request"
                )
                
            except Exception as e:
                # Catch any other errors
                error_msg = str(e)[:100]
                logger.error(f"Unexpected error with {model_name}: {error_msg}")
                
                # Check for common error patterns
                if "404" in error_msg or "not found" in error_msg.lower():
                    return GeminiResponse(
                        success=False,
                        content="",
                        status=GeminiStatus.MODEL_NOT_FOUND,
                        error_message=f"Model {model_name} not available"
                    )
                
                if "quota" in error_msg.lower() or "rate" in error_msg.lower():
                    if attempt < max_retries - 1:
                        await asyncio.sleep(delay)
                        delay *= 2
                        continue
                
                return GeminiResponse(
                    success=False,
                    content="",
                    status=GeminiStatus.ERROR,
                    error_message=error_msg
                )
        
        return GeminiResponse(
            success=False,
            content="",
            status=GeminiStatus.ERROR,
            error_message="Max retries exceeded"
        )
    
    def _get_fallback_message(self) -> str:
        """Return a friendly fallback message when AI is unavailable."""
        return (
            "I'm currently unable to process your request due to high demand. "
            "Please try again in a few moments. "
            "In the meantime, you can view your spending summary and transactions above."
        )
    
    async def validate_api_key(self) -> tuple[bool, str]:
        """
        Validate API key by making a minimal test request.
        
        Returns:
            Tuple of (is_valid, status_message)
        """
        if not self._configured:
            return False, "API key not configured"
        
        try:
            result = await self.generate("Say 'ok'", max_retries=1, initial_delay=0.5)
            if result.success:
                return True, f"Valid (using {result.model_used})"
            else:
                return False, f"Failed: {result.status.value}"
        except Exception as e:
            return False, f"Error: {str(e)[:50]}"


# Singleton instance
_client: Optional[GeminiClient] = None


def get_gemini_client(api_key: str) -> GeminiClient:
    """Get or create singleton Gemini client."""
    global _client
    if _client is None or _client.api_key != api_key:
        _client = GeminiClient(api_key)
    return _client


def reset_gemini_client() -> None:
    """Reset the singleton client (useful for testing or key changes)."""
    global _client
    _client = None
