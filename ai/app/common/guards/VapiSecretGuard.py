import hmac

from fastapi import Header, HTTPException, status

from app.configuration.AppConfiguration import AppConfiguration


class VapiSecretGuard:
    def __init__(self, configuration: AppConfiguration) -> None:
        self.configuration = configuration

    def __call__(self, x_vapi_secret: str = Header(default="")) -> None:
        if not self.is_valid(x_vapi_secret):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="The Vapi secret is missing or wrong")

    def is_valid(self, secret: str) -> bool:
        expected = self.configuration.vapi_webhook_secret
        return len(expected) > 0 and hmac.compare_digest(secret.encode(), expected.encode())
