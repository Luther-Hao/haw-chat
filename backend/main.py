"""
Haw Chat Backend - FastAPI Server with Lead Agent Architecture

This module provides the main API endpoints for the Haw Chat AI agent.
It implements the Lead Agent + Sub-agent architecture with streaming support.
"""

import os
import json
import asyncio
import uuid
from datetime import datetime
from typing import Optional, AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Haw Chat Agent API",
    description="Backend API for Haw Chat AI Agent with Lead Agent + Sub-agent architecture",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Pydantic Models
# =============================================================================

class ChatMessage(BaseModel):
    """Request model for chat messages."""
    content: str
    chat_history: Optional[list[dict]] = None


class ChatResponse(BaseModel):
    """Response model for non-streaming chat."""
    content: str
    timestamp: str
    thread_id: Optional[str] = None


class ThreadResponse(BaseModel):
    """Response model for thread operations."""
    thread_id: str
    created_at: str
    title: Optional[str] = None


class ThreadListResponse(BaseModel):
    """Response model for listing threads."""
    threads: list[dict]


class ModelInfo(BaseModel):
    """Model information."""
    name: str
    provider: str
    supports_thinking: bool
    supports_vision: bool
    default: bool


# =============================================================================
# Request Models
# =============================================================================

class StreamRequest(BaseModel):
    """Request model for streaming chat."""
    message: str


class CreateThreadRequest(BaseModel):
    """Request model for creating a thread."""
    message: Optional[str] = None


# =============================================================================
# Agent Initialization (lazy loaded)
# =============================================================================

_agent = None
_model_factory = None


def get_agent():
    """Get or initialize the global agent instance."""
    global _agent, _model_factory

    if _agent is None:
        from utils.config import load_config, get_config
        from agent.model_factory import ModelFactory, ModelConfig
        from agent.lead_agent import LeadAgent
        from middleware.base import MiddlewareChain
        from middleware.thread_data import ThreadDataMiddleware
        from middleware.sandbox import SandboxMiddleware
        from middleware.title import TitleMiddleware
        from agent.tools.bash import BashTool
        from agent.tools.file_tools import ReadFileTool, WriteFileTool, ListDirTool
        from sandbox.local import LocalSandbox

        # Load configuration
        config = get_config()

        # Initialize model factory
        model_configs = []
        for model in config.get_model_configs():
            model_configs.append(ModelConfig(
                name=model["name"],
                provider=model["provider"],
                api_key_env=model.get("api_key_env", ""),
                base_url=model.get("base_url"),
                supports_thinking=model.get("supports_thinking", False),
                supports_vision=model.get("supports_vision", False),
                default=model.get("default", False),
            ))

        _model_factory = ModelFactory(model_configs)

        # Initialize sandbox
        sandbox_config = config.get_sandbox_config()
        sandbox = LocalSandbox(base_path=sandbox_config.get("base_path", "./workspace"))

        # Initialize middleware
        middleware = [
            ThreadDataMiddleware(workspace_root="./workspace/threads"),
            SandboxMiddleware(sandbox=sandbox),
            TitleMiddleware(),
        ]
        middleware_chain = MiddlewareChain(middleware)

        # Initialize tools
        tools = [
            BashTool(sandbox=sandbox),
            ReadFileTool(sandbox=sandbox),
            WriteFileTool(sandbox=sandbox),
            ListDirTool(sandbox=sandbox),
        ]

        # Initialize lead agent
        _agent = LeadAgent(
            model_factory=_model_factory,
            system_prompt=config.get_system_prompt(),
            tools=tools,
            middleware_chain=middleware_chain,
        )

    return _agent


# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "Haw Chat Agent API is running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    agent = get_agent()

    # Check model availability
    models = agent.model_factory.list_models()
    model_status = "configured" if models else "not_configured"

    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "running",
            "agent": "ready",
            "models": model_status,
            "threads": agent.thread_count,
        },
        "available_models": [
            {
                "name": m.name,
                "provider": m.provider,
            }
            for m in models
        ]
    }


@app.post("/chat")
async def chat(message: ChatMessage):
    """
    Non-streaming chat endpoint.

    Use this for simple request/response without streaming.
    """
    agent = get_agent()

    # Create a temporary thread for non-streaming
    thread_id = str(uuid.uuid4())

    # Collect response
    full_response = ""
    async for chunk in agent.chat(thread_id, message.content, stream=False):
        if chunk.get("type") == "content":
            full_response = chunk["content"]
        elif chunk.get("type") == "done":
            break

    return ChatResponse(
        content=full_response,
        timestamp=datetime.now().isoformat(),
        thread_id=thread_id,
    )


@app.post("/chat/stream")
async def chat_stream(message: ChatMessage):
    """
    Streaming chat endpoint using Server-Sent Events (SSE).

    Returns a streaming response that the frontend can consume.
    """
    agent = get_agent()

    # Create a temporary thread
    thread_id = str(uuid.uuid4())

    async def stream_response():
        try:
            async for chunk in agent.chat_stream(thread_id, message.content):
                yield chunk

        except Exception as e:
            # Send error in SSE format
            error_chunk = {
                "type": "error",
                "content": str(e),
                "timestamp": datetime.now().isoformat()
            }
            yield f"data: {json.dumps(error_chunk)}\n\n"

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


# =============================================================================
# Thread Management Endpoints
# =============================================================================

@app.post("/api/threads", response_model=ThreadResponse)
async def create_thread(request: Optional[CreateThreadRequest] = None):
    """Create a new conversation thread."""
    agent = get_agent()
    thread_id = str(uuid.uuid4())
    now = datetime.now().isoformat()

    # Create thread in agent
    state = agent.get_or_create_thread(thread_id)
    state["created_at"] = now
    state["updated_at"] = now

    # Process initial message if provided
    if request and request.message:
        async for chunk in agent.chat(thread_id, request.message, stream=False):
            pass  # Process but don't return response

    return ThreadResponse(
        thread_id=thread_id,
        created_at=now,
        title=state.get("title"),
    )


@app.get("/api/threads")
async def list_threads():
    """List all conversation threads."""
    agent = get_agent()
    threads = agent.list_threads()
    return ThreadListResponse(threads=threads)


@app.get("/api/threads/{thread_id}")
async def get_thread(thread_id: str):
    """Get thread state and messages."""
    agent = get_agent()
    state = agent.get_thread_state(thread_id)

    if state is None:
        raise HTTPException(status_code=404, detail="Thread not found")

    return {
        "thread_id": thread_id,
        "title": state.get("title"),
        "messages": state.get("messages", []),
        "created_at": state.get("created_at"),
        "updated_at": state.get("updated_at"),
        "artifacts": state.get("artifacts", []),
    }


@app.delete("/api/threads/{thread_id}")
async def delete_thread(thread_id: str):
    """Delete a conversation thread."""
    agent = get_agent()
    success = agent.delete_thread(thread_id)

    if not success:
        raise HTTPException(status_code=404, detail="Thread not found")

    return {"status": "deleted", "thread_id": thread_id}


@app.post("/api/threads/{thread_id}/stream")
async def stream_thread_message(thread_id: str, request: StreamRequest):
    """
    Stream a message to an existing thread.

    This is the main streaming endpoint for real-time conversation.
    """
    agent = get_agent()

    # Verify thread exists
    state = agent.get_thread_state(thread_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Thread not found")

    async def stream_response():
        try:
            async for chunk in agent.chat_stream(thread_id, request.message):
                yield chunk

        except Exception as e:
            error_chunk = {
                "type": "error",
                "content": str(e),
                "timestamp": datetime.now().isoformat()
            }
            yield f"data: {json.dumps(error_chunk)}\n\n"

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


# =============================================================================
# Model and Tool Information Endpoints
# =============================================================================

@app.get("/api/models")
async def list_models():
    """List all available models."""
    agent = get_agent()
    models = agent.model_factory.list_models()

    return {
        "models": [
            {
                "name": m.name,
                "provider": m.provider,
                "supports_thinking": m.supports_thinking,
                "supports_vision": m.supports_vision,
                "default": m.default,
            }
            for m in models
        ]
    }


@app.get("/api/tools")
async def list_tools():
    """List all available tools."""
    agent = get_agent()
    tools = agent.list_tools()

    return {"tools": tools}


# =============================================================================
# Legacy Endpoints (for backward compatibility)
# =============================================================================

@app.get("/history")
async def get_history():
    """Get chat history (placeholder for backward compatibility."""
    return {
        "history": [],
        "message": "Use /api/threads for thread management"
    }


# =============================================================================
# Main Entry Point
# =============================================================================

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")

    print(f"Starting Haw Chat Agent Backend on {host}:{port}")
    print(f"API Documentation: http://localhost:{port}/docs")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
