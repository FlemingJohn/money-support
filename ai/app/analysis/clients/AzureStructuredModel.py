from langchain_openai import AzureChatOpenAI
from pydantic import BaseModel

from app.analysis.clients.StructuredModel import StructuredModel
from app.configuration.AppConfiguration import AppConfiguration


class AzureStructuredModel(StructuredModel):
    attempts = 3

    def __init__(self, configuration: AppConfiguration) -> None:
        self.chat_model = AzureChatOpenAI(
            azure_endpoint=configuration.azure_openai_endpoint,
            api_key=configuration.azure_openai_api_key,
            azure_deployment=configuration.azure_openai_deployment,
            api_version=configuration.azure_openai_api_version,
            temperature=0,
            timeout=20,
            max_retries=0,
        )

    async def ask[Output: BaseModel](self, instructions: str, text: str, output_type: type[Output]) -> Output:
        runnable = self.chat_model.with_structured_output(output_type, method="json_schema", strict=True).with_retry(stop_after_attempt=self.attempts)
        return await runnable.ainvoke([("system", instructions), ("user", text)])
