from app.analysis.catalogs.MaskKindCatalog import MaskKindCatalog
from app.analysis.models.LineMaskingResponse import LineMaskingResponse
from app.analysis.outputs.MaskedPiece import MaskedPiece
from app.analysis.services.OwnNumberMatcher import OwnNumberMatcher


class PieceMasker:
    phone_kind = "phone"

    def __init__(self, mask_kind_catalog: MaskKindCatalog, own_number_matcher: OwnNumberMatcher) -> None:
        self.mask_kind_catalog = mask_kind_catalog
        self.own_number_matcher = own_number_matcher

    def mask(self, text: str, pieces: list[MaskedPiece], allowed_kinds: list[str], caller_number: str = "") -> LineMaskingResponse:
        removed_kinds: list[str] = []
        for piece in sorted(pieces, key=lambda item: len(item.text), reverse=True):
            if not self.should_mask(text, piece, allowed_kinds, caller_number):
                continue
            label = self.mask_kind_catalog.get_label(piece.kind)
            text = text.replace(piece.text, f"[{label} removed]")
            removed_kinds.append(label)
        return LineMaskingResponse(redacted_text=text, removed_kinds=removed_kinds, is_checked=True)

    def should_mask(self, text: str, piece: MaskedPiece, allowed_kinds: list[str], caller_number: str) -> bool:
        if piece.kind not in allowed_kinds or not piece.text.strip() or piece.text not in text:
            return False
        return not (piece.kind == self.phone_kind and self.own_number_matcher.is_own_number(piece.text, caller_number))
