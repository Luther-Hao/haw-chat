"""File operation tools for Haw Chat Backend."""

from typing import Optional

from .base import BaseTool


class ReadFileTool(BaseTool):
    """Tool for reading file contents."""

    def __init__(self, sandbox=None):
        super().__init__(
            name="read_file",
            description="Read the contents of a file from the sandbox workspace.",
            parameters={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Path to the file to read (relative to workspace or absolute path within sandbox)"
                    },
                    "max_lines": {
                        "type": "number",
                        "description": "Maximum number of lines to read (optional, for partial reads)"
                    },
                    "start_line": {
                        "type": "number",
                        "description": "Starting line number for partial reads (1-indexed, optional)"
                    }
                },
                "required": ["path"]
            }
        )
        self._sandbox = sandbox

    def run(self, path: str, max_lines: Optional[int] = None, start_line: int = 1) -> str:
        """Read file contents."""
        if self._sandbox:
            content = self._sandbox.read_file(path)
        else:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
            except FileNotFoundError:
                return f"(file not found: {path})"
            except Exception as e:
                return f"(error reading {path}: {str(e)})"

        # Handle partial reads
        if max_lines:
            lines = content.split("\n")
            content = "\n".join(lines[start_line - 1:start_line - 1 + max_lines])

        return content


class WriteFileTool(BaseTool):
    """Tool for writing content to files."""

    def __init__(self, sandbox=None):
        super().__init__(
            name="write_file",
            description="Write content to a file in the sandbox workspace. Creates parent directories if they don't exist.",
            parameters={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Path to the file to write (relative to workspace or absolute path within sandbox)"
                    },
                    "content": {
                        "type": "string",
                        "description": "Content to write to the file"
                    },
                    "append": {
                        "type": "boolean",
                        "description": "If true, append to existing file instead of overwriting"
                    }
                },
                "required": ["path", "content"]
            }
        )
        self._sandbox = sandbox

    def run(self, path: str, content: str, append: bool = False) -> str:
        """Write content to a file."""
        if self._sandbox:
            self._sandbox.write_file(path, content)
        else:
            try:
                mode = "a" if append else "w"
                with open(path, mode, encoding="utf-8") as f:
                    f.write(content)
            except Exception as e:
                return f"(error writing {path}: {str(e)})"

        action = "appended to" if append else "written to"
        return f"(successfully {action} {path})"


class ListDirTool(BaseTool):
    """Tool for listing directory contents."""

    def __init__(self, sandbox=None):
        super().__init__(
            name="list_dir",
            description="List the contents of a directory in the sandbox workspace.",
            parameters={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Path to the directory (relative to workspace, defaults to '.')"
                    },
                    "max_depth": {
                        "type": "number",
                        "description": "Maximum depth for recursive listing (default: 1)"
                    },
                    "show_hidden": {
                        "type": "boolean",
                        "description": "Whether to show hidden files (default: false)"
                    }
                },
                "required": []
            }
        )
        self._sandbox = sandbox

    def run(self, path: str = ".", max_depth: int = 1, show_hidden: bool = False) -> str:
        """List directory contents."""
        if self._sandbox:
            items = self._sandbox.list_dir(path, max_depth)
            return "\n".join(items)
        else:
            import os
            try:
                full_path = os.path.join(os.getcwd(), path)
                if not os.path.exists(full_path):
                    return f"(directory not found: {path})"

                items = []
                for item in sorted(os.listdir(full_path)):
                    if not show_hidden and item.startswith("."):
                        continue
                    item_path = os.path.join(full_path, item)
                    if os.path.isdir(item_path):
                        items.append(f"{item}/")
                    else:
                        items.append(item)

                return "\n".join(items) if items else "(directory is empty)"
            except Exception as e:
                return f"(error listing {path}: {str(e)})"