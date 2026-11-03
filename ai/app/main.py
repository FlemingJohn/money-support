from app.ApplicationFactory import ApplicationFactory
from app.ServiceContainer import ServiceContainer
from app.configuration.AppConfiguration import AppConfiguration

app = ApplicationFactory(ServiceContainer.from_configuration(AppConfiguration())).make()
