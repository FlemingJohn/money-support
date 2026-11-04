from app.analysis.catalogs.MaskKindCatalog import MaskKindCatalog
from app.analysis.clients.StructuredModel import StructuredModel
from app.analysis.models.LineMaskingResponse import LineMaskingResponse
from app.analysis.outputs.MaskingOutput import MaskingOutput
from app.analysis.services.PieceMasker import PieceMasker
from app.common.services.TemplateRenderer import TemplateRenderer


class LineMasker:
    waiting_text = "[waiting for privacy check]"

    def __init__(self, model: StructuredModel, template_renderer: TemplateRenderer, piece_masker: PieceMasker, mask_kind_catalog: MaskKindCatalog) -> None:
        self.model = model
        self.template_renderer = template_renderer
        self.piece_masker = piece_masker
        self.mask_kind_catalog = mask_kind_catalog

    async def mask(self, text: str, mask_labels: list[str]) -> LineMaskingResponse:
        allowed_kinds = self.mask_kind_catalog.get_kinds_for(mask_labels)
        if not text.strip() or not allowed_kinds:
            return LineMaskingResponse(redacted_text=text, removed_kinds=[], is_checked=True)
        try:
            output = await self.model.ask(self.make_instructions(allowed_kinds), text, MaskingOutput)
        except Exception:
            return LineMaskingResponse(redacted_text=self.waiting_text, removed_kinds=[], is_checked=False)
        return self.piece_masker.mask(text, output.pieces, allowed_kinds)

    def make_instructions(self, allowed_kinds: list[str]) -> str:
        return self.template_renderer.render("analysis/Masking.md", kinds=allowed_kinds)
