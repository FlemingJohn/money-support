from app.analysis.catalogs.MaskKindCatalog import MaskKindCatalog
from app.analysis.clients.StructuredModel import StructuredModel
from app.analysis.services.CallAnalysisGraph import CallAnalysisGraph
from app.analysis.services.CallAnalysisService import CallAnalysisService
from app.analysis.services.CheckNode import CheckNode
from app.analysis.services.FieldsNode import FieldsNode
from app.analysis.services.HandOffDetector import HandOffDetector
from app.analysis.services.LineMasker import LineMasker
from app.analysis.services.LineMaskingNode import LineMaskingNode
from app.analysis.services.OwnNumberMatcher import OwnNumberMatcher
from app.analysis.services.PieceMasker import PieceMasker
from app.analysis.services.ReviewSuggester import ReviewSuggester
from app.analysis.services.SummaryNode import SummaryNode
from app.analysis.services.TopicNode import TopicNode
from app.analysis.services.TranscriptFormatter import TranscriptFormatter
from app.common.services.TemplateRenderer import TemplateRenderer
from app.configuration.AppConfiguration import AppConfiguration


class AnalysisSetup:
    def __init__(self, configuration: AppConfiguration, model: StructuredModel) -> None:
        self.template_renderer = TemplateRenderer(configuration.prompts_folder)
        self.model = model

    def make_line_masker(self) -> LineMasker:
        return LineMasker(self.model, self.template_renderer, PieceMasker(MaskKindCatalog(), OwnNumberMatcher()), MaskKindCatalog())

    def make_service(self) -> CallAnalysisService:
        formatter = TranscriptFormatter()
        graph = CallAnalysisGraph(
            LineMaskingNode(self.make_line_masker()),
            SummaryNode(self.model, self.template_renderer, formatter),
            TopicNode(self.model, self.template_renderer, formatter),
            FieldsNode(self.model, self.template_renderer, formatter),
            CheckNode(self.model, self.template_renderer, formatter),
        )
        return CallAnalysisService(graph, HandOffDetector(), ReviewSuggester())
