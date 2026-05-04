"""Base tool class for Haw Chat Backend."""

from abc import ABC, abstractmethod
from typing import Any, Optional
from dataclasses import dataclass


@dataclass
class ToolResult:
    """Result of a tool execution."""

    success: bool
    output: str
    error: Optional[str] = None
    metadata: Optional[dict] = None

    @classmethod
    def ok(cls, output: str, metadata: Optional[dict] = None) -> "ToolResult":
        """Create a successful result."""
        return cls(success=True, output=output, metadata=metadata)

    @classmethod
    def error(cls, error: str, output: str = "") -> "ToolResult":
        """Create an error result."""
        return cls(success=False, output=output, error=error)


class BaseTool(ABC):
    """Abstract base class for tools."""

    def __init__(self, name: str, description: str, parameters: Optional[dict] = None):
        """
        Initialize a tool.

        Args:
            name: Tool name
            description: Tool description
            parameters: JSON schema for tool parameters
        """
        self.name = name
        self.description = description
        self.parameters = parameters or {
            "type": "object",
            "properties": {},
            "required": [],
        }

    @abstractmethod
    def run(self, **kwargs) -> str:
        """
        Synchronously execute the tool.

        Args:
            **kwargs: Tool-specific arguments

        Returns:
            Tool output as string
        """
        pass

    async def arun(self, **kwargs) -> str:
        """
        Asynchronously execute the tool.

        Default implementation wraps run() in asyncio.

        Args:
            **kwargs: Tool-specific arguments

        Returns:
            Tool output as string
        """
        import asyncio
        return await asyncio.to_thread(self.run, **kwargs)

    def to_dict(self) -> dict:
        """Convert tool to dictionary for API exposure."""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters,
        }