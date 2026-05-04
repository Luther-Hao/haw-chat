"""Base middleware class for Haw Chat Backend."""

from abc import ABC, abstractmethod
from typing import Optional

from agent.thread_state import ThreadState


class MiddlewareResult:
    """Result of middleware execution."""

    def __init__(
        self,
        state: ThreadState,
        proceed: bool = True,
        skip_remaining: bool = False,
        error: Optional[str] = None,
    ):
        self.state = state
        self.proceed = proceed  # Whether to continue to next middleware/model
        self.skip_remaining = skip_remaining  # Skip remaining middlewares
        self.error = error


class BaseMiddleware(ABC):
    """Abstract base class for middleware."""

    def __init__(self, name: str, enabled: bool = True):
        """
        Initialize middleware.

        Args:
            name: Middleware name
            enabled: Whether middleware is enabled
        """
        self.name = name
        self.enabled = enabled

    async def before_model(self, state: ThreadState) -> MiddlewareResult:
        """
        Execute before model call.

        Args:
            state: Current thread state

        Returns:
            MiddlewareResult with updated state
        """
        return MiddlewareResult(state=state, proceed=True)

    async def after_model(self, state: ThreadState) -> MiddlewareResult:
        """
        Execute after model call.

        Args:
            state: Current thread state (with model response)

        Returns:
            MiddlewareResult with updated state
        """
        return MiddlewareResult(state=state, proceed=True)


class MiddlewareChain:
    """Chain of middleware to execute."""

    def __init__(self, middlewares: list[BaseMiddleware]):
        """
        Initialize middleware chain.

        Args:
            middlewares: List of middleware instances
        """
        self._middlewares = [m for m in middlewares if m.enabled]

    async def run_before(self, state: ThreadState) -> tuple[ThreadState, bool]:
        """
        Run before-model middlewares.

        Args:
            state: Current thread state

        Returns:
            Tuple of (updated state, should_proceed)
        """
        for middleware in self._middlewares:
            result = await middleware.before_model(state)
            state = result.state

            if not result.proceed or result.skip_remaining:
                return state, result.proceed

        return state, True

    async def run_after(self, state: ThreadState) -> tuple[ThreadState, bool]:
        """
        Run after-model middlewares.

        Args:
            state: Current thread state

        Returns:
            Tuple of (updated state, should_proceed)
        """
        for middleware in self._middlewares:
            result = await middleware.after_model(state)
            state = result.state

            if not result.proceed or result.skip_remaining:
                return state, result.proceed

        return state, True