import { z } from "zod";
import { BOOKING_DAYS_AHEAD, BOOKING_SERVICES, WORK_HOURS } from "@/lib/site";

const TZ = "Europe/Moscow"; // Krasnodar uses Moscow time

/** Current date ("YYYY-MM-DD") and hour in Krasnodar. */
export function localNow(now: Date): { date: string; hour: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

function toUtcNoon(date: string): Date {
  return new Date(`${date}T12:00:00Z`);
}

export function addDays(date: string, n: number): string {
  const d = toUtcNoon(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function weekdayOf(date: string): number {
  return toUtcNoon(date).getUTCDay();
}

/** All hourly slots for a date by the opening hours, ignoring the current time. */
export function slotsForDate(date: string): string[] {
  const h = WORK_HOURS[weekdayOf(date)];
  if (!h) return [];
  const out: string[] = [];
  for (let hour = h.open; hour < h.close; hour++) out.push(`${String(hour).padStart(2, "0")}:00`);
  return out;
}

/** Slots a client can still pick: within the booking window and not already past today. */
export function availableSlots(date: string, now: Date): string[] {
  const { date: today, hour } = localNow(now);
  if (date < today || date > addDays(today, BOOKING_DAYS_AHEAD)) return [];
  const slots = slotsForDate(date);
  if (date !== today) return slots;
  return slots.filter((s) => Number(s.slice(0, 2)) > hour);
}

/** Already booked times, keyed by date ("YYYY-MM-DD" -> ["10:00", ...]). */
export type TakenSlots = Record<string, string[]>;

/** Slots still open for a new booking: available by time and not taken by another client. */
export function freeSlots(date: string, now: Date, taken: TakenSlots = {}): string[] {
  const busy = new Set(taken[date] ?? []);
  return availableSlots(date, now).filter((s) => !busy.has(s));
}

export function isSlotFree(date: string, time: string, now: Date, taken: TakenSlots = {}): boolean {
  return freeSlots(date, now, taken).includes(time);
}

/** Booking window as [first, last] dates in Krasnodar time. */
export function bookingWindow(now: Date): { from: string; to: string } {
  const { date: today } = localNow(now);
  return { from: today, to: addDays(today, BOOKING_DAYS_AHEAD) };
}

/** Upcoming dates (from today) that still have free slots. */
export function bookableDays(now: Date, taken: TakenSlots = {}): string[] {
  const { date: today } = localNow(now);
  const days: string[] = [];
  for (let i = 0; i <= BOOKING_DAYS_AHEAD; i++) {
    const d = addDays(today, i);
    if (freeSlots(d, now, taken).length > 0) days.push(d);
  }
  return days;
}

/** Normalises a Russian phone number to +7XXXXXXXXXX, or null when it is not one. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) return `+7${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("9")) return `+7${digits}`;
  return null;
}

export const bookingSchema = z.object({
  service: z.string().refine((v) => BOOKING_SERVICES.includes(v), { message: "Выберите услугу" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Выберите дату" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Выберите время" }),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => normalizePhone(v) !== null, { message: "Введите номер в формате +7 900 123-45-67" }),
  name: z.string().trim().max(60, { message: "Не длиннее 60 символов" }).optional(),
  comment: z.string().trim().max(500, { message: "Не длиннее 500 символов" }).optional(),
  website: z.string().max(200).optional(), // honeypot, must stay empty
});

export type BookingInput = z.infer<typeof bookingSchema>;
