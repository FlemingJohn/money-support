from app.assistant.factories.HandOffToolFactory import HandOffToolFactory
from app.backend.models.HandOffSettings import HandOffSettings
from app.common.services.TemplateRenderer import TemplateRenderer
from app.configuration.AppConfiguration import AppConfiguration


class ToolCatalog:
    missed_transfer_message = "Sorry, nobody from the team could take your call just now. We've let them know, and they'll call you back on this number."

    def __init__(self, template_renderer: TemplateRenderer, configuration: AppConfiguration, hand_off_tool_factory: HandOffToolFactory) -> None:
        self.template_renderer = template_renderer
        self.configuration = configuration
        self.hand_off_tool_factory = hand_off_tool_factory

    def make_tools(self, hand_off: HandOffSettings) -> list[dict]:
        tools = [self.make_end_call_tool()]
        if hand_off.is_transfer:
            tools.append(self.make_transfer_tool(hand_off))
        elif self.configuration.has_hand_off_tool:
            tools.append(self.hand_off_tool_factory.make(hand_off))
        return tools

    def make_end_call_tool(self) -> dict:
        return {
            "type": "endCall",
            "messages": [{"type": "request-start", "content": "Thanks for calling Wise. Take care."}],
            "rejectionPlan": {"conditions": [self.make_no_closing_question_condition(), self.make_no_goodbye_condition()]},
        }

    def make_no_closing_question_condition(self) -> dict:
        return {"type": "regex", "regex": "(?i)anything else", "target": {"role": "assistant", "position": -1}, "negate": True}

    def make_no_goodbye_condition(self) -> dict:
        goodbye = r"(?i)\b(bye|goodbye|that['’]?s all|that is all|that['’]?s everything|nothing else|all done|i['’]?m done)\b"
        plain_no = r"|^\W*(no|nope|no,? thanks?( you)?)\W*$"
        return {"type": "regex", "regex": goodbye + plain_no, "target": {"role": "user", "position": -1}, "negate": True}

    def make_transfer_tool(self, hand_off: HandOffSettings) -> dict:
        return {
            "type": "transferCall",
            "destinations": [
                {
                    "type": "number",
                    "number": hand_off.transfer_number,
                    "description": "The Wise support team",
                    "message": "",
                    "transferPlan": self.make_transfer_plan(),
                }
            ],
        }

    def make_transfer_plan(self) -> dict:
        return {
            "mode": "warm-transfer-experimental",
            "summaryPlan": self.make_briefing_plan(),
            "fallbackPlan": {"message": self.missed_transfer_message, "endCallEnabled": True},
        }

    def make_briefing_plan(self) -> dict:
        return {
            "messages": [
                {"role": "system", "content": self.template_renderer.render("assistant/TransferBriefing.md")},
                {"role": "user", "content": "Here is the transcript:\n\n{{transcript}}"},
            ]
        }
