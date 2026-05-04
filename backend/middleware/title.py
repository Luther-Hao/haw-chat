"""Title middleware for generating conversation thread titles."""

from datetime import datetime

from .base import BaseMiddleware, MiddlewareResult
from agent.thread_state import ThreadState


class TitleMiddleware(BaseMiddleware):
    """Middleware for generating thread titles from first message."""

    def __init__(self, max_title_length: int = 50):
        """
        Initialize title middleware.

        Args:
            max_title_length: Maximum length for generated titles
        """
        super().__init__("title", enabled=True)
        self._max_title_length = max_title_length

    async def before_model(self, state: ThreadState) -> MiddlewareResult:
        """Check if title needs to be generated."""
        # Title is generated after first response if not set
        return MiddlewareResult(state=state, proceed=True)

    async def after_model(self, state: ThreadState) -> MiddlewareResult:
        """Generate title from first user message if not set."""
        if state.get("title"):
            return MiddlewareResult(state=state, proceed=True)

        # Get first user message
        messages = state.get("messages", [])
        first_user_msg = None
        for msg in messages:
            if msg.get("role") == "user":
                first_user_msg = msg.get("content", "")
                break

        if not first_user_msg:
            return MiddlewareResult(state=state, proceed=True)

        # Generate title from first message
        title = self._generate_title(first_user_msg)
        state["title"] = title

        return MiddlewareResult(state=state, proceed=True)

    def _generate_title(self, message: str) -> str:
        """Generate a title from a message."""
        # Clean up the message
        title = message.strip()

        # Remove common prefixes
        prefixes_to_remove = [
            "please ", "can you ", "could you ", "would you ",
            "i want ", "i need ", "help me ",
        ]
        for prefix in prefixes_to_remove:
            if title.lower().startswith(prefix):
                title = title[len(prefix):]
                break

        # Take first sentence or clause
        for sep in [". ", "? ", "! ", ", "]:
            if sep in title:
                title = title.split(sep)[0]
                break

        # Truncate if too long
        if len(title) > self._max_title_length:
            title = title[:self._max_title_length - 3] + "..."

        # Capitalize first letter
        if title:
            title = title[0].upper() + title[1:]

        return title or "New Chat"