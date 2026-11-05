from app.common.exceptions.ServiceError import ServiceError


class NoFeedbackError(ServiceError):
    status_code = 409
