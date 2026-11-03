from app.common.models.CamelModel import CamelModel


class SimulationReport(CamelModel):
    run_id: str
    status: str
    total: int
    passed: int
    failed: int
    running: int
    queued: int
    canceled: int

    @classmethod
    def from_run(cls, run: dict) -> "SimulationReport":
        counts = run.get("itemCounts") or {}
        return cls(
            run_id=run["id"],
            status=run.get("status", "queued"),
            **{name: int(counts.get(name, 0)) for name in ["total", "passed", "failed", "running", "queued", "canceled"]},
        )
