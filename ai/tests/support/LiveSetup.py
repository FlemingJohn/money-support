import os

from deepeval.models import AzureOpenAIModel

from app.analysis.clients.AzureStructuredModel import AzureStructuredModel
from app.configuration.AppConfiguration import AppConfiguration
from tests.support.SampleData import SampleData


class LiveSetup:
    def make_configuration(self) -> AppConfiguration:
        return SampleData().make_configuration(
            azure_openai_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
            azure_openai_api_key=os.environ["AZURE_OPENAI_API_KEY"],
            azure_openai_deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4o"),
            azure_openai_api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2025-01-01-preview"),
        )

    def make_model(self) -> AzureStructuredModel:
        return AzureStructuredModel(self.make_configuration())

    def make_judge(self) -> AzureOpenAIModel:
        configuration = self.make_configuration()
        return AzureOpenAIModel(
            model=configuration.azure_openai_deployment,
            deployment_name=configuration.azure_openai_deployment,
            api_key=configuration.azure_openai_api_key,
            base_url=configuration.azure_openai_endpoint,
            api_version=configuration.azure_openai_api_version,
            temperature=0,
        )
