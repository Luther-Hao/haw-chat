"""Lead Agent - Main orchestrator for Haw Chat Backend."""

import asyncio
import json
from datetime import datetime
from typing import Optional, AsyncGenerator, Any, Callable

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_core.outputs import ChatGenerationChunk

from agent.thread_state import ThreadState, create_initial_state, add_message_to_state
from agent.model_factory import ModelFactory, ModelConfig
from agent.tools.base import BaseTool
from middleware.base import BaseMiddleware, MiddlewareChain


class LeadAgent:
    """
    Lead Agent - The main orchestrator for AI conversations.

    Responsible for:
    - Managing conversation state (ThreadState)
    - Coordinating middleware chain
    - Handling tool calls and execution
    - Streaming responses to clients
    - Managing sub-agent delegation
    """

    def __init__(
        self,
        model_factory: ModelFactory,
        system_prompt: str,
        tools: Optional[list[BaseTool]] = None,
        middleware_chain: Optional[MiddlewareChain] = None,
    ):
        """
        Initialize Lead Agent.

        Args:
            model_factory: Factory for creating model instances
            system_prompt: System prompt for the agent
            tools: List of available tools
            middleware_chain: Chain of middleware to execute
        """
        self._model_factory = model_factory
        self._system_prompt = system_prompt
        self._tools = tools or []
        self._middleware_chain = middleware_chain

        # Thread storage
        self._threads: dict[str, ThreadState] = {}

    def get_or_create_thread(self, thread_id: str) -> ThreadState:
        """
        Get an existing thread or create a new one.

        Args:
            thread_id: Thread identifier

        Returns:
            ThreadState for the thread
        """
        if thread_id not in self._threads:
            self._threads[thread_id] = create_initial_state(thread_id)

        return self._threads[thread_id]

    def delete_thread(self, thread_id: str) -> bool:
        """
        Delete a thread.

        Args:
            thread_id: Thread identifier

        Returns:
            True if deleted, False if not found
        """
        if thread_id in self._threads:
            del self._threads[thread_id]
            return True
        return False

    def list_threads(self) -> list[dict]:
        """
        List all threads.

        Returns:
            List of thread metadata dicts
        """
        return [
            {
                "thread_id": tid,
                "title": state.get("title"),
                "message_count": len(state.get("messages", [])),
                "created_at": state.get("created_at"),
                "updated_at": state.get("updated_at"),
            }
            for tid, state in self._threads.items()
        ]

    async def chat(
        self,
        thread_id: str,
        message: str,
        stream: bool = True,
    ) -> AsyncGenerator[dict, None]:
        """
        Process a chat message and return response.

        Args:
            thread_id: Thread identifier
            message: User message
            stream: Whether to stream the response

        Yields:
            Response chunks as dicts
        """
        # Get or create thread
        state = self.get_or_create_thread(thread_id)

        # Add user message to state
        state = add_message_to_state(state, "user", message)
        state["current_message"] = message

        # Run middleware before model
        if self._middleware_chain:
            state, proceed = await self._middleware_chain.run_before(state)
            if not proceed:
                yield {"type": "error", "content": "Middleware blocked processing"}
                return

        # Get model
        model = self._model_factory.get_model(state.get("model_name"))

        # Build messages for model
        messages = self._build_messages(state)

        if stream:
            # Stream response
            full_response = ""
            async for chunk in model.astream(messages):
                full_response += chunk
                yield {
                    "type": "content",
                    "content": chunk,
                    "done": False
                }

            # Add assistant response to state
            state = add_message_to_state(state, "assistant", full_response)

        else:
            # Non-streaming response
            response = await model.ainvoke(messages)
            state = add_message_to_state(state, "assistant", response)
            yield {
                "type": "content",
                "content": response,
                "done": True
            }

        # Run middleware after model
        if self._middleware_chain:
            await self._middleware_chain.run_after(state)

        yield {
            "type": "done",
            "content": "",
            "timestamp": datetime.now().isoformat()
        }

    async def chat_stream(
        self,
        thread_id: str,
        message: str,
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat response as SSE-formatted strings.

        Args:
            thread_id: Thread identifier
            message: User message

        Yields:
            SSE-formatted response chunks
        """
        async for chunk in self.chat(thread_id, message, stream=True):
            yield f"data: {json.dumps(chunk)}\n\n"

        yield "data: [DONE]\n\n"

    def _build_messages(self, state: ThreadState) -> list[dict]:
        """
        Build message list for model input.

        Args:
            state: Current thread state

        Returns:
            List of message dicts
        """
        messages = []

        # System prompt with memory context
        system_content = self._system_prompt
        if state.get("memory_context"):
            system_content = f"{system_content}\n\nContext from memory:\n{state['memory_context']}"

        messages.append({"role": "system", "content": system_content})

        # Conversation history
        for msg in state.get("messages", []):
            if msg.get("role") in ("user", "assistant"):
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })

        return messages

    def get_thread_state(self, thread_id: str) -> Optional[ThreadState]:
        """
        Get the current state of a thread.

        Args:
            thread_id: Thread identifier

        Returns:
            ThreadState or None if not found
        """
        return self._threads.get(thread_id)

    def update_thread_title(self, thread_id: str, title: str) -> bool:
        """
        Update thread title.

        Args:
            thread_id: Thread identifier
            title: New title

        Returns:
            True if updated, False if thread not found
        """
        if thread_id in self._threads:
            self._threads[thread_id]["title"] = title
            return True
        return False

    def add_tool(self, tool: BaseTool) -> None:
        """
        Add a tool to the agent.

        Args:
            tool: Tool instance to add
        """
        self._tools.append(tool)

    def remove_tool(self, name: str) -> bool:
        """
        Remove a tool by name.

        Args:
            name: Tool name

        Returns:
            True if removed, False if not found
        """
        for i, tool in enumerate(self._tools):
            if tool.name == name:
                self._tools.pop(i)
                return True
        return False

    def list_tools(self) -> list[dict]:
        """
        List all available tools.

        Returns:
            List of tool info dicts
        """
        return [tool.to_dict() for tool in self._tools]

    @property
    def model_factory(self) -> ModelFactory:
        """Get the model factory."""
        return self._model_factory

    @property
    def thread_count(self) -> int:
        """Get number of active threads."""
        return len(self._threads)