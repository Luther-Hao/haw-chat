"""Bash tool for executing shell commands."""

from typing import Optional

from .base import BaseTool, ToolResult


class BashTool(BaseTool):
    """Tool for executing bash/shell commands."""

    def __init__(self, sandbox=None):
        """
        Initialize bash tool.

        Args:
            sandbox: Optional sandbox instance for command execution
        """
        super().__init__(
            name="bash",
            description="Execute shell commands. Use for file operations, running scripts, git commands, etc. Commands run in the sandbox workspace directory.",
            parameters={
                "type": "object",
                "properties": {
                    "command": {
                        "type": "string",
                        "description": "The shell command to execute"
                    },
                    "cwd": {
                        "type": "string",
                        "description": "Optional working directory for the command"
                    },
                    "timeout": {
                        "type": "number",
                        "description": "Optional timeout in seconds (default: 60)"
                    }
                },
                "required": ["command"]
            }
        )
        self._sandbox = sandbox

    def run(self, command: str, cwd: Optional[str] = None, timeout: int = 60) -> str:
        """
        Execute a shell command.

        Args:
            command: Shell command to execute
            cwd: Optional working directory
            timeout: Command timeout in seconds

        Returns:
            Command output or error message
        """
        if self._sandbox:
            return self._sandbox.execute_command(command, cwd)
        else:
            import subprocess
            try:
                result = subprocess.run(
                    command,
                    shell=True,
                    capture_output=True,
                    text=True,
                    cwd=cwd,
                    timeout=timeout,
                )
                output = result.stdout + result.stderr
                return output if output else "(command completed with no output)"
            except subprocess.TimeoutExpired:
                return f"(command timed out after {timeout} seconds)"
            except Exception as e:
                return f"(error: {str(e)})"

    def to_dict(self) -> dict:
        result = super().to_dict()
        result["description"] += "\n\nWARNING: Be careful with destructive commands like rm -rf"
        return result