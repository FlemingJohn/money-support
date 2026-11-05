import { type Call, CallChannel, CallOutcome, CallStatus } from "../../../src/generated/prisma/client";
import { CallStatistics } from "../../../src/overview/services/CallStatistics";
import { UkTime } from "../../../src/overview/services/UkTime";

describe("CallStatistics", () => {
  const ukTime = new UkTime();
  const callStatistics = new CallStatistics(ukTime);

  function endedCall(hour: number, outcome: CallOutcome, topic: string, durationSeconds = 60): Call {
    const endedAt = new Date(Date.UTC(2026, 10, 3, hour, 30));
    return {
      id: `${hour}-${topic}`,
      channel: CallChannel.phone,
      status: CallStatus.ended,
      startedAt: new Date(endedAt.getTime() - durationSeconds * 1000),
      endedAt,
      endedReason: null,
      summary: null,
      topic,
      outcome,
      maskedCustomerNumber: null,
      customerNumber: null,
      matchedFaqId: null,
      promptVersionId: null,
      createdAt: endedAt,
      updatedAt: endedAt,
    };
  }

  const calls = [
    endedCall(9, CallOutcome.resolved, "Proof of payment", 120),
    endedCall(11, CallOutcome.handedOff, "Fees", 30),
    endedCall(11, CallOutcome.handedOff, "Fees", 30),
    endedCall(11, CallOutcome.handedOff, "Card declined", 60),
  ];

  it("totals outcomes and the average length", () => {
    expect(callStatistics.totals(calls)).toEqual({ callCount: 4, resolvedCount: 1, handedOffCount: 3, averageDurationSeconds: 60 });
  });

  it("fills every hour between the first and last call", () => {
    expect(callStatistics.countByHour(calls)).toEqual([
      { label: "09", resolved: 1, handedOff: 0 },
      { label: "10", resolved: 0, handedOff: 0 },
      { label: "11", resolved: 0, handedOff: 3 },
    ]);
  });

  it("fills every day in the period in UK time", () => {
    const firstDay = ukTime.startOfDay(new Date(Date.UTC(2026, 10, 2, 12)));
    const dayStarts = [firstDay, ukTime.addDays(firstDay, 1), ukTime.addDays(firstDay, 2)];
    expect(callStatistics.countByDay(calls, dayStarts)).toEqual([
      { label: "2 Nov", resolved: 0, handedOff: 0 },
      { label: "3 Nov", resolved: 1, handedOff: 3 },
      { label: "4 Nov", resolved: 0, handedOff: 0 },
    ]);
  });

  it("ranks hand-off topics by count", () => {
    expect(callStatistics.countHandOffReasons(calls)).toEqual([
      { label: "Fees", count: 2 },
      { label: "Card declined", count: 1 },
    ]);
  });

  it("returns nothing for a day without calls", () => {
    expect(callStatistics.countByHour([])).toEqual([]);
    expect(callStatistics.totals([]).averageDurationSeconds).toBeNull();
  });
});
