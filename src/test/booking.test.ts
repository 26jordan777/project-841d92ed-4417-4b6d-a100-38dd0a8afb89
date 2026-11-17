import { describe, expect, it } from "vitest";
import { availableSlots, bookableDays, normalizePhone, slotsForDate } from "@/lib/booking";

// 2026-11-17 is a Tuesday. 10:30 Krasnodar time = 07:30 UTC.
const tuesdayMorning = new Date("2026-11-17T07:30:00Z");

describe("online booking rules", () => {
  it("has no slots on Sunday (day off)", () => {
    expect(slotsForDate("2026-11-22")).toEqual([]);
  });

  it("offers 9:00–19:00 slots on weekdays (closes at 20:00)", () => {
    const s = slotsForDate("2026-11-18");
    expect(s[0]).toBe("09:00");
    expect(s.at(-1)).toBe("19:00");
    expect(s).toHaveLength(11);
  });

  it("offers 10:00–17:00 slots on Saturday (closes at 18:00)", () => {
    const s = slotsForDate("2026-11-21");
    expect(s[0]).toBe("10:00");
    expect(s.at(-1)).toBe("17:00");
  });

  it("hides slots that already passed today", () => {
    const s = availableSlots("2026-11-17", tuesdayMorning);
    expect(s).not.toContain("10:00");
    expect(s[0]).toBe("11:00");
  });

  it("rejects past dates and dates more than 14 days ahead", () => {
    expect(availableSlots("2026-11-16", tuesdayMorning)).toEqual([]);
    expect(availableSlots("2026-12-02", tuesdayMorning)).toEqual([]);
    expect(availableSlots("2026-12-01", tuesdayMorning).length).toBeGreaterThan(0);
  });

  it("never lists Sundays as bookable days", () => {
    expect(bookableDays(tuesdayMorning)).not.toContain("2026-11-22");
  });

  it("normalises Russian phone numbers", () => {
    expect(normalizePhone("8 (900) 123-45-67")).toBe("+79001234567");
    expect(normalizePhone("+7 900 123 45 67")).toBe("+79001234567");
    expect(normalizePhone("9001234567")).toBe("+79001234567");
    expect(normalizePhone("12345")).toBeNull();
  });
});
