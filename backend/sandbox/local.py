"""Local sandbox implementation for Haw Chat Backend."""

import os
import subprocess
from pathlib import Path
from typing import Optional

from .base import Sandbox


class LocalSandbox(Sandbox):
    """Local filesystem sandbox implementation."""

    def __init__(self, base_path: Optional[str] = None):
        """
        Initialize local sandbox.

        Args:
            base_path: Base path for sandbox. Defaults to ./workspace
        """
        if base_path is None:
            base_path = "./workspace"

        self._base_path = Path(base_path).resolve()
        self._base_path.mkdir(parents=True, exist_ok=True)

    def execute_command(self, command: str, cwd: Optional[str] = None) -> str:
        """Execute a shell command in the local sandbox."""
        try:
            working_dir = Path(cwd) if cwd else self._base_path
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                cwd=str(working_dir),
                timeout=300,  # 5 minute timeout
            )
            output = result.stdout + result.stderr
            return output.strip() if output else "(no output)"
        except subprocess.TimeoutExpired:
            return "(command timed out after 300 seconds)"
        except Exception as e:
            return f"(error: {str(e)})"

    def read_file(self, path: str) -> str:
        """Read file contents from local sandbox."""
        file_path = self._resolve_path(path)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            return f"(file not found: {path})"
        except Exception as e:
            return f"(error reading {path}: {str(e)})"

    def write_file(self, path: str, content: str) -> None:
        """Write content to a file in local sandbox."""
        file_path = self._resolve_path(path)
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

    def list_dir(self, path: str = ".", max_depth: int = 2) -> list[str]:
        """List directory contents in local sandbox."""
        dir_path = self._resolve_path(path)
        if not dir_path.exists():
            return [f"(directory not found: {path})"]

        results = []
        try:
            for item in sorted(dir_path.iterdir()):
                rel_path = item.relative_to(self._base_path)
                if item.is_dir():
                    results.append(f"{rel_path}/")
                    if len(results) < 100:  # Limit output
                        results.append(f"  (directory with {len(list(item.iterdir()))} items)")
                else:
                    results.append(str(rel_path))
        except Exception as e:
            return [f"(error listing {path}: {str(e)})"]

        return results

    def exists(self, path: str) -> bool:
        """Check if a path exists in local sandbox."""
        return self._resolve_path(path).exists()

    def get_workspace_path(self) -> str:
        """Get the workspace root path."""
        return str(self._base_path)

    def _resolve_path(self, path: str) -> Path:
        """Resolve a path to an absolute path within the sandbox."""
        if os.path.isabs(path):
            # For absolute paths, verify they're within sandbox
            resolved = Path(path).resolve()
            if not str(resolved).startswith(str(self._base_path)):
                # Redirect to sandbox root for safety
                return self._base_path / Path(path).name
            return resolved
        else:
            return self._base_path / path