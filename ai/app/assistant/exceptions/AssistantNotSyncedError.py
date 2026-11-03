from app.common.exceptions.ServiceError import ServiceError


class AssistantNotSyncedError(ServiceError):
    status_code = 409
