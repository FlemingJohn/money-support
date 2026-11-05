import json


class ServerSentEvents:
    media_type = "text/event-stream"
    headers = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}

    def format(self, event: dict) -> str:
        return f"data: {json.dumps(event)}\n\n"
