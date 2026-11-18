import { z } from "zod";

export const BOOKING_STATUSES = ["new", "confirmed", "done", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  done: "Выполнена",
  cancelled: "Отменена",
};

export const statusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(BOOKING_STATUSES),
});

/** A booking still ahead: today or later and neither finished nor cancelled. */
export function isUpcoming(b: { booking_date: string; status: string }, today: string): boolean {
  return b.booking_date >= today && b.status !== "cancelled" && b.status !== "done";
}
