class NoisePlanFactory:
    def make_denoising_plan(self) -> dict:
        return {"smartDenoisingPlan": {"enabled": True}}
