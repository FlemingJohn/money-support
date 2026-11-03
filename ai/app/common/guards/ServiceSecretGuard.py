import hmac

from fastapi import Header, HTTPException, status

from app.configuration.AppConfiguration import AppConfiguration


class ServiceSecretGuard:
    def __init__(self, configuration: AppConfiguration) -> None:
        self.configuration = configuration

    def __call__(self, x_service_secret: str = Header(default="")) -> None:
        if not self.is_valid(x_service_secret):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="The service secret is missing or wrong")

    def is_valid(self, secret: str) -> bool:
        return hmac.compare_digest(secret.encode(), self.configuration.service_secret.encode())
