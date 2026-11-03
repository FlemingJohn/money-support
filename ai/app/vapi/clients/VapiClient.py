import httpx

from app.vapi.exceptions.VapiRequestError import VapiRequestError


class VapiClient:
    def __init__(self, http_client: httpx.AsyncClient) -> None:
        self.http_client = http_client

    async def get(self, path: str, parameters: dict | None = None) -> object:
        return await self.send("GET", path, params=parameters)

    async def post(self, path: str, body: dict, headers: dict | None = None) -> object:
        return await self.send("POST", path, json=body, headers=headers)

    async def patch(self, path: str, body: dict) -> object:
        return await self.send("PATCH", path, json=body)

    async def send(self, method: str, path: str, **options: object) -> object:
        try:
            response = await self.http_client.request(method, path, **options)
        except httpx.HTTPError as error:
            raise VapiRequestError(f"Vapi could not be reached: {error}") from error
        if response.is_error:
            raise VapiRequestError(f"Vapi answered {response.status_code} for {method} {path}: {response.text}")
        return response.json() if response.content else {}
