from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class AppConfiguration(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_secret: str
    backend_url: str = "http://localhost:4000"
    vapi_api_key: str
    vapi_base_url: str = "https://api.vapi.ai"
    vapi_webhook_url: str = ""
    vapi_webhook_secret: str = ""
    assistant_tag: str = "money-support"
    assistant_model: str = "gpt-4o"
    judge_model: str = "gpt-4.1"
    run_timeout_seconds: float = 240
    poll_interval_seconds: float = 3
    project_folder: Path = Path(__file__).resolve().parents[2]

    @property
    def prompts_folder(self) -> Path:
        return self.project_folder / "prompts"

    @property
    def evaluation_cases_folder(self) -> Path:
        return self.project_folder / "evaluation" / "cases"

    @property
    def simulation_scenarios_folder(self) -> Path:
        return self.project_folder / "simulation" / "scenarios"

    @property
    def has_webhook(self) -> bool:
        return len(self.vapi_webhook_url) > 0
