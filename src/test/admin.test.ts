import { describe, expect, it } from "vitest";
import { isUpcoming, statusUpdateSchema } from "@/lib/admin";

describe("admin bookings", () => {
  const id = "3f1c2d4e-5a6b-4c7d-8e9f-0a1b2c3d4e5f";

  it("accepts only known statuses", () => {
    expect(statusUpdateSchema.safeParse({ id, status: "confirmed" }).success).toBe(true);
    expect(statusUpdateSchema.safeParse({ id, status: "deleted" }).success).toBe(false);
  });

  it("treats cancelled, finished and past bookings as not upcoming", () => {
    expect(isUpcoming({ booking_date: "2026-11-20", status: "new" }, "2026-11-18")).toBe(true);
    expect(isUpcoming({ booking_date: "2026-11-20", status: "cancelled" }, "2026-11-18")).toBe(false);
    expect(isUpcoming({ booking_date: "2026-11-20", status: "done" }, "2026-11-18")).toBe(false);
    expect(isUpcoming({ booking_date: "2026-11-17", status: "confirmed" }, "2026-11-18")).toBe(false);
  });
});
