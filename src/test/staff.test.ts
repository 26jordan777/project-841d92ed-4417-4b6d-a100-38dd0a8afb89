import { describe, expect, it } from "vitest";
import { sectionPasswordMatches, staffSignupSchema } from "@/lib/staff";

describe("staff sign-up gate", () => {
  it("opens only with the exact section password", async () => {
    expect(await sectionPasswordMatches("Secret-1", "Secret-1")).toBe(true);
    expect(await sectionPasswordMatches("secret-1", "Secret-1")).toBe(false);
    expect(await sectionPasswordMatches("", "Secret-1")).toBe(false);
  });

  it("stays closed when no section password is configured", async () => {
    expect(await sectionPasswordMatches("", "")).toBe(false);
  });

  it("requires an account password of at least 8 characters", () => {
    const base = { code: "x", email: "staff@example.com" };
    expect(staffSignupSchema.safeParse({ ...base, password: "1234567" }).success).toBe(false);
    expect(staffSignupSchema.safeParse({ ...base, password: "12345678" }).success).toBe(true);
  });
});
