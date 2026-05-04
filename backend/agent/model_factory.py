"""Model factory for multi-provider AI model support."""

import os
from abc import ABC, abstractmethod
from typing import Optional, Any
from dataclasses import dataclass

from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI


@dataclass
class ModelConfig:
    """Configuration for an AI model."""

    name: str
    provider: str  # openai, anthropic, deepseek, etc.
    api_key_env: str  # Environment variable name for API key
    base_url: Optional[str] = None
    supports_thinking: bool = False
    supports_vision: bool = False
    default: bool = False


class BaseModelWrapper(ABC):
    """Abstract base class for model wrappers."""

    @abstractmethod
    def invoke(self, messages: list[dict]) -> str:
        """Synchronous invoke."""
        pass

    @abstractmethod
    async def ainvoke(self, messages: list[dict]) -> str:
        """Asynchronous invoke."""
        pass

    @abstractmethod
    def stream(self, messages: list[dict]):
        """Streaming invoke."""
        pass

    @abstractmethod
    async def astream(self, messages: list[dict]):
        """Async streaming invoke."""
        pass


class OpenAIModel(BaseModelWrapper):
    """OpenAI model wrapper."""

    def __init__(self, config: ModelConfig):
        api_key = os.getenv(config.api_key_env, "")
        self._client = ChatOpenAI(
            model=config.name,
            api_key=api_key,
            base_url=config.base_url,
            streaming=True,
        )

    def invoke(self, messages: list[dict]) -> str:
        response = self._client.invoke(messages)
        return response.content

    async def ainvoke(self, messages: list[dict]) -> str:
        response = await self._client.ainvoke(messages)
        return response.content

    def stream(self, messages: list[dict]):
        return self._client.stream(messages)

    async def astream(self, messages: list[dict]):
        async for chunk in self._client.astream(messages):
            yield chunk.content


class AnthropicModel(BaseModelWrapper):
    """Anthropic Claude model wrapper."""

    def __init__(self, config: ModelConfig):
        api_key = os.getenv(config.api_key_env, "")
        self._client = ChatAnthropic(
            model_name=config.name,
            anthropic_api_key=api_key,
            base_url=config.base_url,
        )

    def invoke(self, messages: list[dict]) -> str:
        response = self._client.invoke(messages)
        return response.content

    async def ainvoke(self, messages: list[dict]) -> str:
        response = await self._client.ainvoke(messages)
        return response.content

    def stream(self, messages: list[dict]):
        return self._client.stream(messages)

    async def astream(self, messages: list[dict]):
        async for chunk in self._client.astream(messages):
            yield chunk.content


class ModelFactory:
    """Factory for creating model instances."""

    _providers = {
        "openai": OpenAIModel,
        "anthropic": AnthropicModel,
        "deepseek": OpenAIModel,  # Uses OpenAI-compatible API
        "qwen": OpenAIModel,  # Uses OpenAI-compatible API
        "glm": OpenAIModel,  # Uses OpenAI-compatible API
    }

    def __init__(self, configs: list[ModelConfig]):
        """
        Initialize model factory.

        Args:
            configs: List of model configurations
        """
        self._models: dict[str, ModelConfig] = {}
        self._instances: dict[str, BaseModelWrapper] = {}

        for config in configs:
            self._models[config.name] = config

    def get_model(self, name: Optional[str] = None) -> BaseModelWrapper:
        """
        Get a model instance by name.

        Args:
            name: Model name. If None, returns default model.

        Returns:
            Model wrapper instance
        """
        if name is None:
            # Get default model
            for config in self._models.values():
                if config.default:
                    name = config.name
                    break
            if name is None and self._models:
                name = next(iter(self._models.keys()))

        if name not in self._instances:
            config = self._models.get(name)
            if config is None:
                raise ValueError(f"Model not found: {name}")
            self._instances[name] = self._create_model(config)

        return self._instances[name]

    def _create_model(self, config: ModelConfig) -> BaseModelWrapper:
        """Create a model instance from config."""
        provider_class = self._providers.get(config.provider)
        if provider_class is None:
            raise ValueError(f"Unknown provider: {config.provider}")

        return provider_class(config)

    def list_models(self) -> list[ModelConfig]:
        """List all configured models."""
        return list(self._models.values())

    def get_model_info(self, name: str) -> Optional[ModelConfig]:
        """Get model configuration info."""
        return self._models.get(name)