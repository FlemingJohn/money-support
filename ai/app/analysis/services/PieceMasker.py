from app.analysis.catalogs.MaskKindCatalog import MaskKindCatalog
from app.analysis.models.LineMaskingResponse import LineMaskingResponse
from app.analysis.outputs.MaskedPiece import MaskedPiece


class PieceMasker:
    def __init__(self, mask_kind_catalog: MaskKindCatalog) -> None:
        self.mask_kind_catalog = mask_kind_catalog

    def mask(self, text: str, pieces: list[MaskedPiece], allowed_kinds: list[str]) -> LineMaskingResponse:
        removed_kinds: list[str] = []
        for piece in sorted(pieces, key=lambda item: len(item.text), reverse=True):
            if piece.kind not in allowed_kinds or not piece.text.strip() or piece.text not in text:
                continue
            label = self.mask_kind_catalog.get_label(piece.kind)
            text = text.replace(piece.text, f"[{label} removed]")
            removed_kinds.append(label)
        return LineMaskingResponse(redacted_text=text, removed_kinds=removed_kinds, is_checked=True)
