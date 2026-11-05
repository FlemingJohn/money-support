import asyncio

from app.backend.clients.BackendClient import BackendClient
from app.handoff.catalogs.HandOffReasonCatalog import HandOffReasonCatalog
from app.handoff.models.VapiToolCallRequest import VapiToolCallRequest
from app.handoff.services.HandOffGraph import HandOffGraph
from app.handoff.services.HandOffToolService import HandOffToolService
from app.handoff.services.ReasonNode import ReasonNode
from app.handoff.services.RingTeamNode import RingTeamNode
from tests.support.FakeHttpServer import FakeHttpServer


class HandOffToolServiceTest:
    ring_path = ("POST", "/internal/hand-offs/ring")

    def make_service(self, backend: FakeHttpServer) -> HandOffToolService:
        backend_client = BackendClient(backend.make_client("http://backend.test"))
        return HandOffToolService(HandOffGraph(ReasonNode(HandOffReasonCatalog()), RingTeamNode(backend_client)))

    def make_request(self, arguments: object, has_call: bool = True) -> VapiToolCallRequest:
        message = {"type": "tool-calls", "toolCallList": [{"id": "tool-1", "function": {"name": "handOffToHuman", "arguments": arguments}}]}
        if has_call:
            message["call"] = {"id": "call-1"}
        return VapiToolCallRequest.model_validate({"message": message})

    def test_rings_the_team_with_the_reason_in_plain_words(self) -> None:
        backend = FakeHttpServer({self.ring_path: {"isRung": True}})
        response = asyncio.run(self.make_service(backend).handle(self.make_request('{"reason": "askedForPerson", "callerNeed": "money to Spain not arrived"}')))
        assert backend.get_sent_bodies(*self.ring_path) == [{"callId": "call-1", "reason": "asked to speak to a person", "callerNeed": "money to Spain not arrived"}]
        assert response.results[0].tool_call_id == "tool-1"
        assert "ringing" in response.results[0].result

    def test_reads_arguments_sent_as_an_object(self) -> None:
        backend = FakeHttpServer({self.ring_path: {"isRung": True}})
        asyncio.run(self.make_service(backend).handle(self.make_request({"reason": "possibleScam", "callerNeed": "thinks they were scammed"})))
        assert backend.get_sent_bodies(*self.ring_path)[0]["reason"] == "reported a possible scam"

    def test_treats_an_unknown_reason_as_out_of_scope(self) -> None:
        backend = FakeHttpServer({self.ring_path: {"isRung": True}})
        asyncio.run(self.make_service(backend).handle(self.make_request({"reason": "somethingElse", "callerNeed": "change phone number"})))
        assert backend.get_sent_bodies(*self.ring_path)[0]["reason"] == "has a question the agent cannot answer"

    def test_never_rings_for_an_eval_or_simulation_without_a_live_call(self) -> None:
        backend = FakeHttpServer({self.ring_path: {"isRung": True}})
        response = asyncio.run(self.make_service(backend).handle(self.make_request({"reason": "askedForPerson"}, has_call=False)))
        assert backend.requests == []
        assert "not a live call" in response.results[0].result

    def test_still_answers_vapi_when_the_backend_cannot_ring(self) -> None:
        response = asyncio.run(self.make_service(FakeHttpServer({})).handle(self.make_request({"reason": "askedForPerson"})))
        assert "could not be rung" in response.results[0].result
