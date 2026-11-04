from app.backend.models.HandOffSettings import HandOffSettings


class ToolCatalog:
    def make_tools(self, hand_off: HandOffSettings) -> list[dict]:
        tools = [self.make_end_call_tool()]
        if hand_off.is_transfer:
            tools.append(self.make_transfer_tool(hand_off))
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
                }
            ],
        }
