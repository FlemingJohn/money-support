from app.common.exceptions.ServiceError import ServiceError


class RunTimeoutError(ServiceError):
    status_code = 504
