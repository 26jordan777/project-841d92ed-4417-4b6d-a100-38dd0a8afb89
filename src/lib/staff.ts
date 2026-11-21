import { z } from "zod";

/**
 * Constant-time check of the shared staff-section password.
 * Both sides are hashed first so length differences don't leak through timing.
 */
export async function sectionPasswordMatches(input: string, expected: string): Promise<boolean> {
  if (!expected) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(input)),
    crypto.subtle.digest("SHA-256", enc.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export const sectionCodeSchema = z.object({ code: z.string().min(1).max(200) });

export const staffSignupSchema = z.object({
  code: z.string().min(1).max(200),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(8).max(72),
});
