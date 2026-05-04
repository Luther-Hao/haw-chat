"""Memory middleware for injecting user memory and context."""

from pathlib import Path
from typing import Optional

from .base import BaseMiddleware, MiddlewareResult
from agent.thread_state import ThreadState


class MemoryMiddleware(BaseMiddleware):
    """Middleware for managing conversation memory and context injection."""

    def __init__(self, memory_file: Optional[str] = None, max_context_length: int = 2000):
        """
        Initialize memory middleware.

        Args:
            memory_file: Path to memory JSON file
            max_context_length: Maximum context length to inject
        """
        super().__init__("memory", enabled=False)
        self._memory_file = memory_file
        self._max_context_length = max_context_length

    async def before_model(self, state: ThreadState) -> MiddlewareResult:
        """Load and inject memory context."""
        if not self.enabled:
            return MiddlewareResult(state=state, proceed=True)

        memory_context = self._load_memory()
        if memory_context:
            state["memory_context"] = memory_context

        return MiddlewareResult(state=state, proceed=True)

    async def after_model(self, state: ThreadState) -> MiddlewareResult:
        """Save any new context to memory."""
        return MiddlewareResult(state=state, proceed=True)

    def _load_memory(self) -> Optional[str]:
        """Load memory from file."""
        if not self._memory_file:
            return None

        memory_path = Path(self._memory_file)
        if not memory_path.exists():
            return None

        try:
            import json

            with open(memory_path, "r", encoding="utf-8") as f:
                memory = json.load(f)

            # Format memory as context string
            context_parts = []

            # User preferences
            if "preferences" in memory:
                prefs = memory["preferences"]
                if isinstance(prefs, dict):
                    prefs_text = ", ".join(f"{k}: {v}" for k, v in prefs.items())
                    context_parts.append(f"User preferences: {prefs_text}")

            # Recent context
            if "recent" in memory:
                recent = memory["recent"]
                if isinstance(recent, list):
                    for item in recent[-3:]:  # Last 3 items
                        context_parts.append(f"Recent: {item}")

            # Build context string
            context = "\n".join(context_parts)

            # Truncate if too long
            if len(context) > self._max_context_length:
                context = context[:self._max_context_length] + "..."

            return context if context else None

        except Exception:
            return None