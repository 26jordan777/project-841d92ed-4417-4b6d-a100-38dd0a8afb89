import { createServerFn } from "@tanstack/react-start";
import { availableSlots, bookingSchema, bookingWindow, normalizePhone, type TakenSlots } from "@/lib/booking";

const SLOT_TAKEN = "Это время уже заняли — выберите другое.";

async function loadTaken(from: string, to: string): Promise<TakenSlots> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("booking_requests")
    .select("booking_date, booking_time")
    .gte("booking_date", from)
    .lte("booking_date", to)
    .neq("status", "cancelled");
  if (error) {
    console.error("taken slots query failed", error);
    throw new Error("Не удалось загрузить свободное время. Обновите страницу.");
  }
  const taken: TakenSlots = {};
  for (const row of data ?? []) (taken[row.booking_date] ??= []).push(row.booking_time);
  return taken;
}

/** Public: returns only which date/time slots are busy — no names or phones. */
export const getTakenSlots = createServerFn({ method: "GET" }).handler(async () => {
  const { from, to } = bookingWindow(new Date());
  return loadTaken(from, to);
});

export const createBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    // Bots fill the hidden field; pretend success without storing anything.
    if (data.website) return { ok: true as const };

    if (!availableSlots(data.date, new Date()).includes(data.time)) {
      throw new Error("Это время уже недоступно — выберите другое.");
    }

    const taken = await loadTaken(data.date, data.date);
    if (taken[data.date]?.includes(data.time)) throw new Error(SLOT_TAKEN);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("booking_requests").insert({
      service: data.service,
      booking_date: data.date,
      booking_time: data.time,
      phone: normalizePhone(data.phone) ?? data.phone,
      name: data.name || null,
      comment: data.comment || null,
    });
    if (error) {
      // Unique index on (date, time) catches two clients submitting at the same moment.
      if (error.code === "23505") throw new Error(SLOT_TAKEN);
      console.error("booking insert failed", error);
      throw new Error("Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.");
    }
    return { ok: true as const };
  });
