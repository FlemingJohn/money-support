class CompliancePlanFactory:
    def make(self) -> dict:
        return {
            "securityFilterPlan": {
                "enabled": True,
                "filters": [{"type": "prompt-injection"}],
                "mode": "sanitize",
            }
        }
