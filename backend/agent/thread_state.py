"""Thread state management for Haw Chat Backend."""

from typing import TypedDict, Optional
from datetime import datetime


class ThreadState(TypedDict, total=False):
    """State container for a conversation thread."""

    # Core message state
    messages: list[dict]  # List of message dicts with role, content
    current_message: str  # Current user message

    # Thread metadata
    thread_id: Optional[str]
    created_at: Optional[str]
    updated_at: Optional[str]

    # Content artifacts
    title: Optional[str]  # Thread title
    artifacts: list[str]  # Files/artifacts generated during conversation

    # Task tracking
    todos: list[dict]  # Task list

    # File handling
    uploaded_files: list[dict]  # User uploaded files

    # Sandbox state
    sandbox: Optional[dict]  # Sandbox execution state
    sandbox_path: Optional[str]  # Current sandbox workspace path

    # Memory context
    memory_context: Optional[str]  # Injected memory context

    # Model configuration
    model_name: Optional[str]  # Current model being used

    # Metadata
    metadata: dict  # Additional metadata


def create_initial_state(thread_id: str, message: str = "") -> ThreadState:
    """
    Create an initial thread state.

    Args:
        thread_id: Unique thread identifier
        message: Optional initial message

    Returns:
        Initial ThreadState
    """
    now = datetime.now().isoformat()
    return ThreadState(
        messages=[],
        current_message=message,
        thread_id=thread_id,
        created_at=now,
        updated_at=now,
        title=None,
        artifacts=[],
        todos=[],
        uploaded_files=[],
        sandbox=None,
        sandbox_path=None,
        memory_context=None,
        model_name=None,
        metadata={},
    )


def add_message_to_state(state: ThreadState, role: str, content: str) -> ThreadState:
    """
    Add a message to the thread state.

    Args:
        state: Current thread state
        role: Message role (user, assistant, system)
        content: Message content

    Returns:
        Updated thread state
    """
    state["messages"].append({
        "role": role,
        "content": content,
        "timestamp": datetime.now().isoformat(),
    })
    state["updated_at"] = datetime.now().isoformat()
    return state


def get_messages_for_model(state: ThreadState) -> list[dict]:
    """
    Get messages formatted for model input.

    Args:
        state: Thread state

    Returns:
        List of message dicts suitable for model API
    """
    return state.get("messages", [])