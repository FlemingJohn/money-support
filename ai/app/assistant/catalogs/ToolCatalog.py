from app.backend.models.HandOffSettings import HandOffSettings


class ToolCatalog:
    def make_tools(self, hand_off: HandOffSettings) -> list[dict]:
        tools = [self.make_end_call_tool()]
        if hand_off.is_transfer:
            tools.append(self.make_transfer_tool(hand_off))
        return tools

    def make_end_call_tool(self) -> dict:
        return {"type": "endCall", "messages": [{"type": "request-start", "content": "Thanks for calling Wise. Goodbye."}]}

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
