from app.assistant.factories.HandOffToolFactory import HandOffToolFactory
from app.handoff.catalogs.HandOffReasonCatalog import HandOffReasonCatalog
from tests.support.SampleData import SampleData


class HandOffToolFactoryTest:
    sample_data = SampleData()

    def make_tool(self) -> dict:
        configuration = self.sample_data.make_configuration(ai_public_url="https://ai.example.org", vapi_webhook_secret="hook-secret")
        return HandOffToolFactory(configuration, HandOffReasonCatalog()).make(self.sample_data.make_settings().hand_off)

    def test_sends_the_tool_call_to_the_ai_service_with_the_vapi_secret(self) -> None:
        server = self.make_tool()["server"]
        assert server["url"] == "https://ai.example.org/tools/hand-off"
        assert server["headers"] == {"x-vapi-secret": "hook-secret"}

    def test_lets_the_model_choose_only_known_reasons(self) -> None:
        reason = self.make_tool()["function"]["parameters"]["properties"]["reason"]
        assert "askedForPerson" in reason["enum"]
        assert "possibleScam" in reason["enum"]

    def test_says_the_hand_off_sentence_and_ends_the_call_even_if_the_tool_fails(self) -> None:
        messages = self.make_tool()["messages"]
        assert [message["type"] for message in messages] == ["request-complete", "request-failed"]
        assert all(message["content"] == self.sample_data.hand_off_sentence and message["endCallAfterSpokenEnabled"] for message in messages)
