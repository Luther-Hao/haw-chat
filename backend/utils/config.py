"""Configuration management for Haw Chat Backend."""

import os
from pathlib import Path
from typing import Any, Optional

import yaml


class Config:
    """Configuration class that loads and provides access to config values."""

    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize configuration.

        Args:
            config_path: Path to config.yaml file. If None, uses default path.
        """
        if config_path is None:
            # Default to config.yaml in the backend directory
            config_path = Path(__file__).parent.parent / "config.yaml"

        self._config_path = Path(config_path)
        self._config = self._load_config()

    def _load_config(self) -> dict:
        """Load configuration from YAML file."""
        if not self._config_path.exists():
            return self._get_default_config()

        with open(self._config_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f) or {}

    def _get_default_config(self) -> dict:
        """Return default configuration."""
        return {
            "app": {
                "name": "Haw Chat Agent",
                "version": "1.0.0",
            },
            "models": [],
            "tools": [],
            "sandbox": {
                "type": "local",
                "base_path": "./workspace",
            },
            "subagents": {
                "enabled": True,
                "max_concurrent": 3,
                "timeout_seconds": 900,
            },
            "middleware": [],
        }

    def get(self, key: str, default: Any = None) -> Any:
        """
        Get a configuration value using dot notation.

        Args:
            key: Configuration key in dot notation (e.g., "app.name")
            default: Default value if key not found

        Returns:
            Configuration value or default
        """
        keys = key.split(".")
        value = self._config

        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
            if value is None:
                return default

        return value

    def get_model_configs(self) -> list[dict]:
        """Get list of model configurations."""
        return self._config.get("models", [])

    def get_default_model(self) -> Optional[dict]:
        """Get the default model configuration."""
        for model in self.get_model_configs():
            if model.get("default", False):
                return model
        # Return first model if no default specified
        models = self.get_model_configs()
        return models[0] if models else None

    def get_enabled_tools(self) -> list[dict]:
        """Get list of enabled tool configurations."""
        return [t for t in self._config.get("tools", []) if t.get("enabled", False)]

    def get_sandbox_config(self) -> dict:
        """Get sandbox configuration."""
        return self._config.get("sandbox", {})

    def get_subagent_config(self) -> dict:
        """Get subagent configuration."""
        return self._config.get("subagents", {})

    def get_enabled_middleware(self) -> list[dict]:
        """Get list of enabled middleware configurations."""
        return [m for m in self._config.get("middleware", []) if m.get("enabled", False)]

    def get_system_prompt(self) -> str:
        """Get the system prompt."""
        return self._config.get(
            "system_prompt",
            "You are LEO, an AI assistant for Haw Chat."
        )

    @property
    def raw(self) -> dict:
        """Get the raw configuration dictionary."""
        return self._config


# Global config instance
_config: Optional[Config] = None


def load_config(config_path: Optional[str] = None) -> Config:
    """
    Load configuration from file.

    Args:
        config_path: Optional path to config file

    Returns:
        Config instance
    """
    global _config
    _config = Config(config_path)
    return _config


def get_config() -> Config:
    """
    Get the global configuration instance.

    Returns:
        Config instance (loads default if not loaded)
    """
    global _config
    if _config is None:
        _config = load_config()
    return _config
