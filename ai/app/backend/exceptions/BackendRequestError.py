from app.common.exceptions.ServiceError import ServiceError


class BackendRequestError(ServiceError):
    status_code = 502
