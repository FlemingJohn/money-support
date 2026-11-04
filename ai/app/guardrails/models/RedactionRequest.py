from pydantic import Field

from app.common.models.CamelModel import CamelModel
from app.guardrails.catalogs.EntityLabelCatalog import EntityLabelCatalog


class RedactionRequest(CamelModel):
    texts: list[str] = Field(max_length=2000)
    entity_types: list[str] = Field(default_factory=lambda: EntityLabelCatalog().all_labels)
