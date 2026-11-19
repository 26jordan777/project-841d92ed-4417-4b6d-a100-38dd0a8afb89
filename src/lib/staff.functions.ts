import { createServerFn } from "@tanstack/react-start";
import { sectionCodeSchema, sectionPasswordMatches, staffSignupSchema } from "@/lib/staff";

const WRONG_CODE = "Неверный пароль раздела.";

async function checkCode(code: string): Promise<boolean> {
  const ok = await sectionPasswordMatches(code, process.env["STAFF_SIGNUP_PASSWORD"] ?? "");
  // Slow down guessing.
  if (!ok) await new Promise((r) => setTimeout(r, 800));
  return ok;
}

/** Step 1: unlocks the staff sign-up form. Reveals nothing beyond yes/no. */
export const verifySectionPassword = createServerFn({ method: "POST" })
  .validator((input: unknown) => sectionCodeSchema.parse(input))
  .handler(async ({ data }) => ({ ok: await checkCode(data.code) }));

/** Step 2: creates a confirmed staff account. The section password is re-checked here. */
export const registerStaff = createServerFn({ method: "POST" })
  .validator((input: unknown) => staffSignupSchema.parse(input))
  .handler(async ({ data }) => {
    if (!(await checkCode(data.code))) throw new Error(WRONG_CODE);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) {
      const msg = `${error.code ?? ""} ${error.message}`.toLowerCase();
      if (msg.includes("exists") || msg.includes("already")) {
        throw new Error("Аккаунт с такой почтой уже есть — просто войдите.");
      }
      if (msg.includes("weak") || msg.includes("password")) {
        throw new Error("Пароль слишком простой — придумайте посложнее.");
      }
      console.error("staff signup failed", error);
      throw new Error("Не удалось зарегистрироваться. Попробуйте ещё раз.");
    }
    return { ok: true as const };
  });
