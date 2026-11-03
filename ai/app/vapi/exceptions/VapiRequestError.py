from app.common.exceptions.ServiceError import ServiceError


class VapiRequestError(ServiceError):
    status_code = 502
