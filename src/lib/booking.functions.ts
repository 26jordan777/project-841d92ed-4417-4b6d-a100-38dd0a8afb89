import { createServerFn } from "@tanstack/react-start";
import { availableSlots, bookingSchema, normalizePhone } from "@/lib/booking";

export const createBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    // Bots fill the hidden field; pretend success without storing anything.
    if (data.website) return { ok: true as const };

    if (!availableSlots(data.date, new Date()).includes(data.time)) {
      throw new Error("Это время уже недоступно — выберите другое.");
    }

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
      console.error("booking insert failed", error);
      throw new Error("Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.");
    }
    return { ok: true as const };
  });
