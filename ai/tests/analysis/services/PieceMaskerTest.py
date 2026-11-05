from app.analysis.catalogs.MaskKindCatalog import MaskKindCatalog
from app.analysis.outputs.MaskedPiece import MaskedPiece
from app.analysis.services.OwnNumberMatcher import OwnNumberMatcher
from app.analysis.services.PieceMasker import PieceMasker


class PieceMaskerTest:
    piece_masker = PieceMasker(MaskKindCatalog(), OwnNumberMatcher())

    def test_masks_exactly_the_pieces_found(self) -> None:
        result = self.piece_masker.mask("I am Tom, card 3 4 5 0", [MaskedPiece(text="Tom", kind="name"), MaskedPiece(text="3 4 5 0", kind="card")], ["name", "card"])
        assert result.redacted_text == "I am [name removed], card [card number removed]"
        assert sorted(result.removed_kinds) == ["card number", "name"]

    def test_ignores_pieces_the_model_invented(self) -> None:
        result = self.piece_masker.mask("When will it arrive?", [MaskedPiece(text="Priya", kind="name")], ["name"])
        assert result.redacted_text == "When will it arrive?"
        assert result.removed_kinds == []

    def test_only_masks_the_chosen_kinds(self) -> None:
        result = self.piece_masker.mask("I am Tom, card 3 4 5 0", [MaskedPiece(text="Tom", kind="name"), MaskedPiece(text="3 4 5 0", kind="card")], ["card"])
        assert result.redacted_text == "I am Tom, card [card number removed]"

    def test_keeps_the_callers_own_phone_number(self) -> None:
        result = self.piece_masker.mask("Call me on 98765 41363", [MaskedPiece(text="98765 41363", kind="phone")], ["phone"], "+919876541363")
        assert result.redacted_text == "Call me on 98765 41363"
        assert result.removed_kinds == []

    def test_masks_someone_elses_phone_number(self) -> None:
        result = self.piece_masker.mask("Call my wife on 91234 56789", [MaskedPiece(text="91234 56789", kind="phone")], ["phone"], "+919876541363")
        assert result.redacted_text == "Call my wife on [phone number removed]"
