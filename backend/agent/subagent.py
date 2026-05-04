"""Sub-agent system for Haw Chat Backend."""

import asyncio
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from concurrent.futures import ThreadPoolExecutor

from agent.thread_state import ThreadState, create_initial_state


class SubAgentType(Enum):
    """Types of sub-agents."""
    GENERAL_PURPOSE = "general-purpose"
    BASH = "bash"
    RESEARCH = "research"
    CODE = "code"


@dataclass
class SubAgentTask:
    """Task assigned to a sub-agent."""
    task_id: str
    agent_type: SubAgentType
    prompt: str
    context: dict
    created_at: str


@dataclass
class SubAgentResult:
    """Result from a sub-agent execution."""
    task_id: str
    success: bool
    output: str
    error: Optional[str] = None
    artifacts: list[str] = None
    duration_seconds: float = 0


class SubAgent(ABC):
    """Abstract base class for sub-agents."""

    def __init__(self, agent_type: SubAgentType, timeout_seconds: int = 900):
        """
        Initialize sub-agent.

        Args:
            agent_type: Type of sub-agent
            timeout_seconds: Maximum execution time
        """
        self.agent_type = agent_type
        self.timeout_seconds = timeout_seconds

    @abstractmethod
    async def execute(self, task: SubAgentTask) -> SubAgentResult:
        """
        Execute a sub-agent task.

        Args:
            task: Task to execute

        Returns:
            SubAgentResult with execution results
        """
        pass


class GeneralPurposeSubAgent(SubAgent):
    """General purpose sub-agent for arbitrary tasks."""

    def __init__(self, model_wrapper=None, timeout_seconds: int = 900):
        super().__init__(SubAgentType.GENERAL_PURPOSE, timeout_seconds)
        self._model = model_wrapper

    async def execute(self, task: SubAgentTask) -> SubAgentResult:
        """Execute general purpose task."""
        start_time = datetime.now()

        try:
            # Build context prompt
            context_str = "\n".join(
                f"{k}: {v}" for k, v in task.context.items()
            ) if task.context else ""

            full_prompt = f"""Context:
{context_str}

Task:
{task.prompt}

Provide a detailed response to this task."""

            # Execute with model if available
            if self._model:
                response = await self._model.ainvoke([
                    {"role": "user", "content": full_prompt}
                ])
                output = response
            else:
                output = f"(No model configured) Task: {task.prompt}"

            duration = (datetime.now() - start_time).total_seconds()

            return SubAgentResult(
                task_id=task.task_id,
                success=True,
                output=output,
                duration_seconds=duration,
            )

        except Exception as e:
            duration = (datetime.now() - start_time).total_seconds()
            return SubAgentResult(
                task_id=task.task_id,
                success=False,
                output="",
                error=str(e),
                duration_seconds=duration,
            )


class SubAgentPool:
    """Pool for managing sub-agent execution."""

    def __init__(self, max_concurrent: int = 3, timeout_seconds: int = 900):
        """
        Initialize sub-agent pool.

        Args:
            max_concurrent: Maximum concurrent sub-agent tasks
            timeout_seconds: Default timeout for tasks
        """
        self._max_concurrent = max_concurrent
        self._timeout_seconds = timeout_seconds
        self._semaphore = asyncio.Semaphore(max_concurrent)
        self._executor = ThreadPoolExecutor(max_workers=max_concurrent)
        self._active_tasks: dict[str, SubAgentTask] = {}
        self._results: dict[str, SubAgentResult] = {}

        # Register available sub-agent types
        self._agent_factories: dict[SubAgentType, type] = {
            SubAgentType.GENERAL_PURPOSE: GeneralPurposeSubAgent,
        }

    def create_agent(self, agent_type: SubAgentType, **kwargs) -> SubAgent:
        """Create a sub-agent instance."""
        factory = self._agent_factories.get(agent_type)
        if factory is None:
            raise ValueError(f"Unknown sub-agent type: {agent_type}")

        return factory(timeout_seconds=self._timeout_seconds, **kwargs)

    async def execute_task(
        self,
        task: SubAgentTask,
        agent_type: SubAgentType = SubAgentType.GENERAL_PURPOSE,
        **agent_kwargs
    ) -> SubAgentResult:
        """
        Execute a sub-agent task with concurrency control.

        Args:
            task: Task to execute
            agent_type: Type of agent to use
            **agent_kwargs: Additional agent configuration

        Returns:
            SubAgentResult from execution
        """
        async with self._semaphore:
            agent = self.create_agent(agent_type, **agent_kwargs)

            try:
                result = await asyncio.wait_for(
                    agent.execute(task),
                    timeout=self._timeout_seconds
                )
                self._results[task.task_id] = result
                return result

            except asyncio.TimeoutError:
                return SubAgentResult(
                    task_id=task.task_id,
                    success=False,
                    output="",
                    error=f"Task timed out after {self._timeout_seconds} seconds",
                    duration_seconds=self._timeout_seconds,
                )

    async def execute_parallel(
        self,
        tasks: list[SubAgentTask],
        agent_type: SubAgentType = SubAgentType.GENERAL_PURPOSE,
    ) -> list[SubAgentResult]:
        """
        Execute multiple tasks in parallel.

        Args:
            tasks: List of tasks to execute
            agent_type: Type of agent to use

        Returns:
            List of results in same order as tasks
        """
        results = await asyncio.gather(
            *[self.execute_task(task, agent_type) for task in tasks],
            return_exceptions=True
        )

        # Convert exceptions to error results
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append(SubAgentResult(
                    task_id=tasks[i].task_id,
                    success=False,
                    output="",
                    error=str(result),
                ))
            else:
                processed_results.append(result)

        return processed_results

    @property
    def active_count(self) -> int:
        """Get number of active tasks."""
        return len(self._active_tasks)

    @property
    def max_concurrent(self) -> int:
        """Get maximum concurrent tasks."""
        return self._max_concurrent