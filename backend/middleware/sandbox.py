"""Sandbox middleware for initializing sandbox environment."""

from .base import BaseMiddleware, MiddlewareResult
from agent.thread_state import ThreadState
from sandbox import LocalSandbox


class SandboxMiddleware(BaseMiddleware):
    """Middleware for initializing and managing sandbox environment."""

    def __init__(self, sandbox: LocalSandbox = None):
        """
        Initialize sandbox middleware.

        Args:
            sandbox: Sandbox instance (creates LocalSandbox if None)
        """
        super().__init__("sandbox", enabled=True)
        self._sandbox = sandbox or LocalSandbox()

    async def before_model(self, state: ThreadState) -> MiddlewareResult:
        """Initialize sandbox context in state."""
        # Get or create sandbox path
        sandbox_path = state.get("sandbox_path") or self._sandbox.get_workspace_path()

        # Initialize sandbox state
        state["sandbox"] = {
            "type": "local",
            "path": sandbox_path,
            "initialized": True,
        }

        return MiddlewareResult(state=state, proceed=True)

    async def after_model(self, state: ThreadState) -> MiddlewareResult:
        """Save sandbox state if needed."""
        # Sandbox state is managed directly by the sandbox instance
        return MiddlewareResult(state=state, proceed=True)