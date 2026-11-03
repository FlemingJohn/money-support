import json

import httpx


class FakeHttpServer:
    def __init__(self, responses: dict[tuple[str, str], object]) -> None:
        self.responses = responses
        self.requests: list[httpx.Request] = []

    def make_client(self, base_url: str) -> httpx.AsyncClient:
        return httpx.AsyncClient(base_url=base_url, transport=httpx.MockTransport(self.handle))

    def handle(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        body = self.responses.get((request.method, request.url.path))
        if body is None:
            return httpx.Response(404, json={"message": "not found"})
        return httpx.Response(200, json=body)

    def get_sent_bodies(self, method: str, path: str) -> list[dict]:
        return [json.loads(request.content) for request in self.requests if (request.method, request.url.path) == (method, path)]
