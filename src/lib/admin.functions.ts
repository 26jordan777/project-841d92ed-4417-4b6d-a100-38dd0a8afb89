import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { statusUpdateSchema } from "@/lib/admin";

async function isStaff(supabase: SupabaseClient<Database>, userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) {
    console.error("role check failed", error);
    throw new Error("Не удалось проверить доступ. Обновите страницу.");
  }
  return data === true;
}

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await isStaff(context.supabase, context.userId))) return { allowed: false as const, bookings: [] };
    const { data, error } = await context.supabase
      .from("booking_requests")
      .select("id, created_at, service, booking_date, booking_time, phone, name, comment, status")
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true })
      .limit(1000);
    if (error) {
      console.error("bookings query failed", error);
      throw new Error("Не удалось загрузить заявки. Обновите страницу.");
    }
    return { allowed: true as const, bookings: data ?? [] };
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => statusUpdateSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (!(await isStaff(context.supabase, context.userId))) throw new Error("Нет доступа.");
    const { error } = await context.supabase
      .from("booking_requests")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) {
      if (error.code === "23505") throw new Error("Это время уже занято другой заявкой.");
      console.error("status update failed", error);
      throw new Error("Не удалось изменить статус. Попробуйте ещё раз.");
    }
    return { ok: true as const };
  });
