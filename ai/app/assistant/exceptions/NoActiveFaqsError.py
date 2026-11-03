from app.common.exceptions.ServiceError import ServiceError


class NoActiveFaqsError(ServiceError):
    status_code = 409
