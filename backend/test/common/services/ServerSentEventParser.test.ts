import { ServerSentEventParser } from "../../../src/common/services/ServerSentEventParser";

describe("ServerSentEventParser", () => {
  it("reads whole events and keeps a half event until the rest arrives", () => {
    const parser = new ServerSentEventParser();
    expect(parser.feed('data: {"type":"started","total":26}\n\ndata: {"type":"res')).toEqual([{ type: "started", total: 26 }]);
    expect(parser.feed('ult","done":1}\n\n')).toEqual([{ type: "result", done: 1 }]);
  });

  it("ignores blocks without data", () => {
    expect(new ServerSentEventParser().feed(": keep alive\n\n")).toEqual([]);
  });
});
