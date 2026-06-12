# In-memory sliding-window rate limiter for the chat endpoint
from collections import defaultdict, deque
from fastapi import HTTPException
import time

CHAT_LIMIT = 10       # max messages
CHAT_WINDOW = 60      # per 60 seconds

# Per-user deque of timestamps; entries older than the window are pruned on each check
_timestamps: dict[str, deque] = defaultdict(deque)


def check_chat_rate(user_id: str):
    now = time.time()
    window_start = now - CHAT_WINDOW
    dq = _timestamps[user_id]

    # Drop timestamps that have fallen outside the rolling window
    while dq and dq[0] < window_start:
        dq.popleft()

    # Reject the request if the user has already hit the limit in this window
    if len(dq) >= CHAT_LIMIT:
        raise HTTPException(
            status_code=429,
            detail=f"Too many messages. Please wait a moment before sending another."
        )

    # Record this request's timestamp so future calls can count it
    dq.append(now)
