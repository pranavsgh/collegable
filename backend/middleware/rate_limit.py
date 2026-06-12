from collections import defaultdict, deque
from fastapi import HTTPException
import time

CHAT_LIMIT = 10       # max messages
CHAT_WINDOW = 60      # per 60 seconds

_timestamps: dict[str, deque] = defaultdict(deque)


def check_chat_rate(user_id: str):
    now = time.time()
    window_start = now - CHAT_WINDOW
    dq = _timestamps[user_id]

    while dq and dq[0] < window_start:
        dq.popleft()

    if len(dq) >= CHAT_LIMIT:
        raise HTTPException(
            status_code=429,
            detail=f"Too many messages. Please wait a moment before sending another."
        )

    dq.append(now)
