from app.backend.models.Faq import Faq
from app.common.services.TemplateRenderer import TemplateRenderer


class AnalysisPlanFactory:
    timeout_seconds = 20

    def __init__(self, template_renderer: TemplateRenderer) -> None:
        self.template_renderer = template_renderer

    def make(self, faqs: list[Faq]) -> dict:
        return {
            "summaryPlan": self.make_summary_plan(),
            "structuredDataPlan": self.make_structured_data_plan(faqs),
        }

    def make_summary_plan(self) -> dict:
        return {
            "enabled": True,
            "timeoutSeconds": self.timeout_seconds,
            "messages": self.make_messages(self.template_renderer.render("analysis/Summary.md")),
        }

    def make_structured_data_plan(self, faqs: list[Faq]) -> dict:
        instructions = self.template_renderer.render("analysis/StructuredData.md", faqs=sorted(faqs, key=lambda faq: faq.number))
        return {
            "enabled": True,
            "timeoutSeconds": self.timeout_seconds,
            "schema": self.make_structured_data_schema(),
            "messages": self.make_messages(instructions),
        }

    def make_messages(self, instructions: str) -> list[dict]:
        return [
            {"role": "system", "content": instructions},
            {"role": "user", "content": self.template_renderer.render("analysis/CallTranscript.md")},
        ]

    def make_structured_data_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "topic": {"type": "string"},
                "matchedFaqNumber": {"type": "integer"},
                "isHandedOff": {"type": "boolean"},
                "fields": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "label": {"type": "string"},
                            "value": {"type": "string"},
                            "confidence": {"type": "number"},
                        },
                        "required": ["label", "value", "confidence"],
                    },
                },
            },
            "required": ["topic", "matchedFaqNumber", "isHandedOff", "fields"],
        }
