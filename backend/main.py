"""
Haw Chat Backend - FastAPI Server with Streaming AI Responses

This module provides the main API endpoints for the Haw Chat AI agent.
It uses Server-Sent Events (SSE) for streaming responses to the frontend.
"""

import os
import json
import asyncio
from datetime import datetime
from typing import AsyncGenerator, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Haw Chat API",
    description="Backend API for Haw Chat AI Agent with streaming support",
    version="0.1.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    """Request model for chat messages."""
    content: str
    chat_history: Optional[list[dict]] = None


class ChatResponse(BaseModel):
    """Response model for non-streaming chat."""
    content: str
    timestamp: str


# Mock AI response generator for demonstration
# In production, replace with actual AI integration (Claude, OpenAI, etc.)
async def generate_ai_response(message: str, chat_history: list[dict]) -> AsyncGenerator[str, None]:
    """
    Generate streaming AI responses.

    This is a mock implementation - in production, replace with:
    - Anthropic Claude API
    - OpenAI ChatGPT API
    - Or any other LLM provider

    The function yields SSE-formatted chunks.
    """
    # Simulate typing delay
    await asyncio.sleep(0.5)

    # Generate response based on user message
    user_lower = message.lower()

    if "hello" in user_lower or "hi" in user_lower:
        responses = [
            "Hello! I'm LEO, your AI assistant.",
            "How can I help you today?"
        ]
    elif "help" in user_lower:
        responses = [
            "I can help you with various tasks including:",
            "• Answering questions",
            "• Writing and editing content",
            "• Analyzing data",
            "• Brainstorming ideas",
            "• And much more! Just let me know what you need."
        ]
    elif "name" in user_lower:
        responses = [
            "I'm LEO, an AI assistant created for Haw Chat.",
            "I'm here to help you with any questions or tasks you have!"
        ]
    elif len(message) < 20:
        responses = [
            "I see your message!",
            "Feel free to tell me more about what you'd like to discuss."
        ]
    else:
        responses = [
            "Thank you for your message!",
            "I understand you're asking about: " + message[:50] + "...",
            "As an AI assistant, I can help you think through this topic.",
            "Would you like me to provide more information or help you explore this further?"
        ]

    # Stream each part of the response
    for i, response in enumerate(responses):
        # SSE format: data: {json}\n\n
        chunk = {
            "type": "content",
            "content": response,
            "done": False
        }
        yield f"data: {json.dumps(chunk)}\n\n"
        await asyncio.sleep(0.3)  # Simulate streaming delay

    # Send completion signal
    final_chunk = {
        "type": "done",
        "content": "",
        "timestamp": datetime.now().isoformat()
    }
    yield f"data: {json.dumps(final_chunk)}\n\n"


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Haw Chat API is running", "version": "0.1.0"}


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "running",
            "ai_model": "mock"  # Will show "ready" when real model is connected
        }
    }


@app.post("/chat")
async def chat(message: ChatMessage):
    """
    Non-streaming chat endpoint.

    Use this for simple request/response without streaming.
    """
    response_content = ""

    # Generate response
    async for chunk in generate_ai_response(message.content, message.chat_history or []):
        # Parse chunk and accumulate content
        if chunk.startswith("data: "):
            data = json.loads(chunk[6:])
            if data.get("type") == "content":
                response_content += data["content"] + " "
            elif data.get("type") == "done":
                break

    return ChatResponse(
        content=response_content.strip(),
        timestamp=datetime.now().isoformat()
    )


@app.post("/chat/stream")
async def chat_stream(message: ChatMessage):
    """
    Streaming chat endpoint using Server-Sent Events (SSE).

    Returns a streaming response that the frontend can consume.
    """
    async def stream_response():
        try:
            async for chunk in generate_ai_response(message.content, message.chat_history or []):
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
            "X-Accel-Buffering": "no",  # Disable buffering for nginx
        }
    )


@app.get("/history")
async def get_history():
    """Get chat history (placeholder for future implementation)."""
    return {
        "history": [],
        "message": "Chat history feature coming soon"
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")

    print(f"Starting Haw Chat Backend on {host}:{port}")
    print(f"API Documentation: http://localhost:{port}/docs")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )