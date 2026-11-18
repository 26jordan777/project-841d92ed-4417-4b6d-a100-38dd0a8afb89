import { describe, expect, it } from "vitest";
import { availableSlots, bookableDays, freeSlots, isSlotFree, normalizePhone, slotsForDate } from "@/lib/booking";

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

describe("slot availability", () => {
  const taken = { "2026-11-18": ["09:00", "14:00"] };

  it("does not offer a time another client already booked", () => {
    const s = freeSlots("2026-11-18", tuesdayMorning, taken);
    expect(s).not.toContain("09:00");
    expect(s).not.toContain("14:00");
    expect(s).toContain("10:00");
    expect(isSlotFree("2026-11-18", "14:00", tuesdayMorning, taken)).toBe(false);
    expect(isSlotFree("2026-11-18", "15:00", tuesdayMorning, taken)).toBe(true);
  });

  it("hides a day once every slot on it is booked", () => {
    const full = { "2026-11-18": slotsForDate("2026-11-18") };
    expect(bookableDays(tuesdayMorning, full)).not.toContain("2026-11-18");
    expect(bookableDays(tuesdayMorning, {})).toContain("2026-11-18");
  });
});
