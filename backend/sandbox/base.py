"""Sandbox abstract interface for Haw Chat Backend."""

from abc import ABC, abstractmethod
from typing import Optional


class Sandbox(ABC):
    """Abstract base class for sandbox environments."""

    @abstractmethod
    def execute_command(self, command: str, cwd: Optional[str] = None) -> str:
        """
        Execute a shell command in the sandbox.

        Args:
            command: Shell command to execute
            cwd: Optional working directory

        Returns:
            Command output (stdout + stderr)
        """
        pass

    @abstractmethod
    def read_file(self, path: str) -> str:
        """
        Read file contents.

        Args:
            path: File path (relative to sandbox root or absolute)

        Returns:
            File contents as string
        """
        pass

    @abstractmethod
    def write_file(self, path: str, content: str) -> None:
        """
        Write content to a file.

        Args:
            path: File path
            content: Content to write
        """
        pass

    @abstractmethod
    def list_dir(self, path: str = ".", max_depth: int = 2) -> list[str]:
        """
        List directory contents.

        Args:
            path: Directory path
            max_depth: Maximum recursion depth

        Returns:
            List of file/directory paths
        """
        pass

    @abstractmethod
    def exists(self, path: str) -> bool:
        """
        Check if a path exists.

        Args:
            path: File or directory path

        Returns:
            True if path exists
        """
        pass

    @abstractmethod
    def get_workspace_path(self) -> str:
        """
        Get the workspace root path.

        Returns:
            Workspace root path
        """
        pass