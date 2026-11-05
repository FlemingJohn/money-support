from pydantic import BaseModel, ConfigDict


class RuleProposalOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    rule_text: str
    explanation: str
