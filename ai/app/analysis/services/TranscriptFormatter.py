from app.analysis.models.MaskedLine import MaskedLine


class TranscriptFormatter:
    def format(self, lines: list[MaskedLine]) -> str:
        return "\n".join(f"[{line.position}] {line.speaker.capitalize()}: {line.redacted_text}" for line in lines)
