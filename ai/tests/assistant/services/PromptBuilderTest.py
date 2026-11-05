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
        assert "The call ends by itself as soon as you say it" in prompt
        assert "transferCall" not in prompt

    def test_uses_the_transfer_tool_when_transferring(self) -> None:
        prompt = self.make_builder().build(self.sample_data.make_faqs(), self.sample_data.make_settings("transfer"))
        assert f'"{self.sample_data.hand_off_sentence}"' in prompt
        assert "then use the transferCall tool in the same reply" in prompt

    def test_only_transfers_in_team_hours_on_weekdays(self) -> None:
        prompt = self.make_builder().build(self.sample_data.make_faqs(), self.sample_data.make_settings("transfer"))
        assert prompt.rstrip().endswith('The time in the UK now is {{"now" | date: "%A %H:%M", "Europe/London"}}.')
        assert "Outside those hours, do not transfer." in prompt

    def test_transfers_any_time_when_the_team_is_always_open(self) -> None:
        settings = self.sample_data.make_settings("transfer")
        always_open = settings.model_copy(update={"hand_off": settings.hand_off.model_copy(update={"team_hours": "always"})})
        prompt = self.make_builder().build(self.sample_data.make_faqs(), always_open)
        assert "Europe/London" not in prompt

    def test_fills_in_the_assistant_name(self) -> None:
        prompt = self.make_builder().build(self.sample_data.make_faqs(), self.sample_data.make_settings())
        assert prompt.startswith("# Role\n\nYou are Money Support Agent,")
