import asyncio
import time
from collections.abc import Awaitable, Callable

from app.common.exceptions.RunTimeoutError import RunTimeoutError
from app.configuration.AppConfiguration import AppConfiguration


class RunPoller:
    def __init__(self, configuration: AppConfiguration) -> None:
        self.configuration = configuration

    async def wait_until_ended(self, read_run: Callable[[], Awaitable[dict]]) -> dict:
        deadline = time.monotonic() + self.configuration.run_timeout_seconds
        while time.monotonic() < deadline:
            run = await read_run()
            if run.get("status") == "ended":
                return run
            await asyncio.sleep(self.configuration.poll_interval_seconds)
        raise RunTimeoutError("The Vapi run did not end in time")
