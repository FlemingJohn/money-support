import { UkTime } from "../../../src/overview/services/UkTime";

describe("UkTime", () => {
  const ukTime = new UkTime();

  it("starts a winter day at midnight UTC", () => {
    expect(ukTime.startOfDay(new Date("2026-11-05T15:20:00Z")).toISOString()).toBe("2026-11-05T00:00:00.000Z");
  });

  it("starts a summer day at eleven the night before in UTC", () => {
    expect(ukTime.startOfDay(new Date("2026-07-01T00:30:00Z")).toISOString()).toBe("2026-06-30T23:00:00.000Z");
  });

  it("starts the day the clocks go forward at midnight GMT", () => {
    expect(ukTime.startOfDay(new Date("2026-03-29T10:00:00Z")).toISOString()).toBe("2026-03-29T00:00:00.000Z");
  });

  it("moves across the change of clocks by whole days", () => {
    const dayBeforeChange = ukTime.startOfDay(new Date("2026-03-28T12:00:00Z"));
    expect(ukTime.addDays(dayBeforeChange, 2).toISOString()).toBe("2026-03-29T23:00:00.000Z");
  });

  it("reads the hour on the UK clock", () => {
    expect(ukTime.getHour(new Date("2026-07-01T08:15:00Z"))).toBe(9);
  });
});
