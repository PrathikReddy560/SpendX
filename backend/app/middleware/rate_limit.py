# Rate Limiting Middleware
# Simple in-memory rate limiter for AI endpoints

import time
import logging
from collections import defaultdict
from typing import Optional
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Track requests per user: {user_id: [timestamp1, timestamp2, ...]}
_request_times: dict = defaultdict(list)

# Configuration
MAX_REQUESTS_PER_MINUTE = 10
WINDOW_SECONDS = 60


class RateLimitExceeded(HTTPException):
    """Rate limit exceeded exception with retry-after header."""
    
    def __init__(self, retry_after: int = 60):
        super().__init__(
            status_code=429,
            detail=f"Too many requests. Please wait {retry_after} seconds.",
            headers={"Retry-After": str(retry_after)}
        )


def check_rate_limit(user_id: str, max_requests: int = MAX_REQUESTS_PER_MINUTE) -> None:
    """
    Check if user has exceeded rate limit.
    
    Args:
        user_id: Unique identifier for the user
        max_requests: Maximum allowed requests per minute
        
    Raises:
        RateLimitExceeded: If user has exceeded the limit
    """
    now = time.time()
    window_start = now - WINDOW_SECONDS
    
    # Clean old entries outside the window
    _request_times[user_id] = [
        t for t in _request_times[user_id] if t > window_start
    ]
    
    current_count = len(_request_times[user_id])
    
    if current_count >= max_requests:
        # Calculate retry-after based on oldest request in window
        if _request_times[user_id]:
            oldest_request = min(_request_times[user_id])
            retry_after = int(oldest_request + WINDOW_SECONDS - now) + 1
        else:
            retry_after = WINDOW_SECONDS
        
        logger.warning(f"Rate limit exceeded for user {user_id}: {current_count}/{max_requests}")
        raise RateLimitExceeded(retry_after=max(1, retry_after))
    
    # Record this request
    _request_times[user_id].append(now)
    logger.debug(f"Rate limit check passed for user {user_id}: {current_count + 1}/{max_requests}")


def get_remaining_requests(user_id: str) -> int:
    """Get remaining requests for user in current window."""
    now = time.time()
    window_start = now - WINDOW_SECONDS
    
    current_requests = [
        t for t in _request_times.get(user_id, []) if t > window_start
    ]
    
    return max(0, MAX_REQUESTS_PER_MINUTE - len(current_requests))


def reset_rate_limit(user_id: Optional[str] = None) -> None:
    """
    Reset rate limit tracking.
    
    Args:
        user_id: If provided, reset only for this user. Otherwise reset all.
    """
    global _request_times
    if user_id:
        _request_times.pop(user_id, None)
    else:
        _request_times.clear()
