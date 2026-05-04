"""Thread data middleware for creating thread directory structure."""

import os
from pathlib import Path
from datetime import datetime

from .base import BaseMiddleware, MiddlewareResult
from agent.thread_state import ThreadState


class ThreadDataMiddleware(BaseMiddleware):
    """Middleware for managing thread directory structure and metadata."""

    def __init__(self, workspace_root: str = "./workspace/threads"):
        """
        Initialize thread data middleware.

        Args:
            workspace_root: Root directory for thread data
        """
        super().__init__("thread_data", enabled=True)
        self._workspace_root = Path(workspace_root)

    async def before_model(self, state: ThreadState) -> MiddlewareResult:
        """Create thread directory and inject path into state."""
        thread_id = state.get("thread_id")
        if not thread_id:
            return MiddlewareResult(state=state, proceed=True)

        # Create thread directory
        thread_dir = self._workspace_root / thread_id
        thread_dir.mkdir(parents=True, exist_ok=True)

        # Create subdirectories
        (thread_dir / "inputs").mkdir(exist_ok=True)
        (thread_dir / "outputs").mkdir(exist_ok=True)
        (thread_dir / "artifacts").mkdir(exist_ok=True)

        # Update state with thread path
        state["thread_data"] = {
            "path": str(thread_dir),
            "inputs": str(thread_dir / "inputs"),
            "outputs": str(thread_dir / "outputs"),
            "artifacts": str(thread_dir / "artifacts"),
        }
        state["sandbox_path"] = str(thread_dir)

        return MiddlewareResult(state=state, proceed=True)

    async def after_model(self, state: ThreadState) -> MiddlewareResult:
        """Save thread metadata after model response."""
        thread_id = state.get("thread_id")
        if not thread_id:
            return MiddlewareResult(state=state, proceed=True)

        # Update thread metadata file
        thread_dir = self._workspace_root / thread_id
        metadata_file = thread_dir / "metadata.json"

        import json

        metadata = {
            "thread_id": thread_id,
            "created_at": state.get("created_at", datetime.now().isoformat()),
            "updated_at": datetime.now().isoformat(),
            "title": state.get("title"),
            "message_count": len(state.get("messages", [])),
        }

        try:
            with open(metadata_file, "w", encoding="utf-8") as f:
                json.dump(metadata, f, indent=2)
        except Exception:
            pass  # Non-critical, continue

        return MiddlewareResult(state=state, proceed=True)