from app.assistant.services.PromptBuilder import PromptBuilder
from app.common.services.TemplateRenderer import TemplateRenderer
from tests.support.SampleData import SampleData


class PromptBuilderTest:
    sample_data = SampleData()

    def make_builder(self) -> PromptBuilder:
        return PromptBuilder(TemplateRenderer(self.sample_data.make_configuration().prompts_folder))

    def test_lists_the_faqs_in_number_order(self) -> None:
        prompt = self.make_builder().build(self.sample_data.make_faqs(), self.sample_data.make_settings())
        assert prompt.index("1. How do I check my transfer's status?") < prompt.index("2. When will my money arrive?")
        assert "Log in and open the transfer." in prompt

    def test_uses_the_exact_hand_off_sentence_when_ending_the_call(self) -> None:
        prompt = self.make_builder().build(self.sample_data.make_faqs(), self.sample_data.make_settings())
        assert f'"{self.sample_data.hand_off_sentence}"' in prompt
        assert "transferCall" not in prompt

    def test_uses_the_transfer_tool_when_transferring(self) -> None:
        prompt = self.make_builder().build(self.sample_data.make_faqs(), self.sample_data.make_settings("transfer"))
        assert "transferCall" in prompt
        assert self.sample_data.hand_off_sentence not in prompt

    def test_fills_in_the_assistant_name(self) -> None:
        prompt = self.make_builder().build(self.sample_data.make_faqs(), self.sample_data.make_settings())
        assert prompt.startswith("# Role\n\nYou are Money Support Agent,")
