import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BOOKING_SERVICES, SITE } from "@/lib/site";
import { availableSlots, bookableDays, bookingSchema } from "@/lib/booking";
import { createBooking } from "@/lib/booking.functions";

const searchSchema = z.object({ service: z.string().optional().catch(undefined) });

export const Route = createFileRoute("/zapis")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Онлайн-запись — автосервис «Перспектива Авто», Краснодар" },
      {
        name: "description",
        content: "Запишитесь в автосервис онлайн: выберите услугу, дату и время. Мы перезвоним для подтверждения.",
      },
      { property: "og:title", content: "Онлайн-запись в «Перспектива Авто»" },
      {
        property: "og:description",
        content: "Выберите услугу и удобное время — подтвердим запись по телефону. Краснодар, тер. Перспективная, 315.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingPage,
});

type Errors = Partial<Record<"service" | "date" | "time" | "phone" | "name" | "comment" | "form", string | undefined>>;

function formatDay(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return {
    weekday: d.toLocaleDateString("ru-RU", { weekday: "short", timeZone: "UTC" }),
    day: d.toLocaleDateString("ru-RU", { day: "numeric", timeZone: "UTC" }),
    month: d.toLocaleDateString("ru-RU", { month: "short", timeZone: "UTC" }).replace(".", ""),
    full: d.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }),
  };
}

const fieldLabel = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

function BookingPage() {
  const search = Route.useSearch();
  const submit = useServerFn(createBooking);

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const [service, setService] = useState(
    search.service && BOOKING_SERVICES.includes(search.service) ? search.service : "",
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const days = useMemo(() => (now ? bookableDays(now) : []), [now]);
  const slots = useMemo(() => (now && date ? availableSlots(date, now) : []), [now, date]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = bookingSchema.safeParse({ service, date, time, phone, name, comment, website });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await submit({ data: parsed.data });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Не удалось отправить заявку." });
      setNow(new Date());
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-16 md:py-24">
        <div className="animate-rise border border-border bg-card p-8 md:p-10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <h1 className="mt-6 text-3xl font-extrabold md:text-4xl">Заявка принята</h1>
          <p className="mt-4 text-muted-foreground">
            Мы перезвоним по номеру <span className="font-mono text-foreground">{phone}</span>, чтобы подтвердить запись.
          </p>
          <dl className="mt-8 grid gap-px border border-border bg-border text-sm">
            <div className="flex justify-between gap-4 bg-background p-4">
              <dt className="text-muted-foreground">Услуга</dt>
              <dd className="text-right font-semibold">{service}</dd>
            </div>
            <div className="flex justify-between gap-4 bg-background p-4">
              <dt className="text-muted-foreground">Когда</dt>
              <dd className="text-right font-semibold">
                {formatDay(date).full}, {time}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="steel" size="xl">
              <Link to="/">На главную</Link>
            </Button>
            <Button
              variant="ghost"
              size="xl"
              className="font-mono uppercase tracking-wider"
              onClick={() => {
                setDone(false);
                setDate("");
                setTime("");
                setComment("");
                setNow(new Date());
              }}
            >
              Новая запись
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="bg-grid absolute inset-x-0 top-0 h-72 opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-16 md:py-24">
        <p className="eyebrow">// Онлайн-запись</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
          Запишитесь <span className="text-primary">на ремонт</span>
        </h1>
        <p className="mt-5 max-w-lg text-muted-foreground">
          Выберите услугу и удобное время. Мы перезвоним, чтобы подтвердить запись.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-12 grid gap-px border border-border bg-border">
          {/* 1. Service */}
          <fieldset className="min-w-0 bg-card p-6 md:p-8">
            <legend className="sr-only">Услуга</legend>
            <p className={fieldLabel}>01 · Услуга</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {BOOKING_SERVICES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={service === s}
                  onClick={() => {
                    setService(s);
                    setErrors((e) => ({ ...e, service: undefined }));
                  }}
                  className={cn(
                    "border px-4 py-3 text-left text-sm transition-colors",
                    service === s
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background hover:border-steel",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.service && <p className="mt-3 text-sm text-destructive">{errors.service}</p>}
          </fieldset>

          {/* 2. Date & time */}
          <fieldset className="min-w-0 bg-card p-6 md:p-8">
            <legend className="sr-only">Дата и время</legend>
            <p className={fieldLabel}>02 · Дата</p>
            <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-2 md:-mx-8 md:px-8">
              {!now &&
                Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-[76px] w-16 shrink-0 animate-pulse border border-border bg-background" />
                ))}
              {days.map((d) => {
                const f = formatDay(d);
                const active = date === d;
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={active}
                    aria-label={f.full}
                    onClick={() => {
                      setDate(d);
                      setTime("");
                      setErrors((e) => ({ ...e, date: undefined }));
                    }}
                    className={cn(
                      "flex w-16 shrink-0 flex-col items-center border py-3 transition-colors",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-steel",
                    )}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-80">{f.weekday}</span>
                    <span className="font-mono text-xl font-bold">{f.day}</span>
                    <span className="text-[11px] opacity-80">{f.month}</span>
                  </button>
                );
              })}
            </div>
            {errors.date && <p className="mt-3 text-sm text-destructive">{errors.date}</p>}

            <p className={cn(fieldLabel, "mt-8")}>03 · Время</p>
            {!date ? (
              <p className="mt-4 text-sm text-muted-foreground">Сначала выберите дату.</p>
            ) : (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={time === t}
                    onClick={() => {
                      setTime(t);
                      setErrors((e) => ({ ...e, time: undefined }));
                    }}
                    className={cn(
                      "border py-2.5 font-mono text-sm transition-colors",
                      time === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-steel",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            {errors.time && <p className="mt-3 text-sm text-destructive">{errors.time}</p>}
          </fieldset>

          {/* 3. Contacts */}
          <fieldset className="min-w-0 grid gap-5 bg-card p-6 md:p-8">
            <legend className="sr-only">Контакты</legend>
            <p className={fieldLabel}>04 · Контакты</p>
            <div className="grid gap-2">
              <Label htmlFor="phone">Телефон для подтверждения *</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 900 123-45-67"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((er) => ({ ...er, phone: undefined }));
                }}
                aria-invalid={!!errors.phone}
                className="h-12 rounded-none bg-background font-mono text-base"
                maxLength={30}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Как к вам обращаться</Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-none bg-background text-base"
                maxLength={60}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment">Марка авто или что случилось</Label>
              <Textarea
                id="comment"
                placeholder="Например: Kia Rio, стучит подвеска спереди"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-24 rounded-none bg-background text-base"
                maxLength={500}
              />
              {errors.comment && <p className="text-sm text-destructive">{errors.comment}</p>}
            </div>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />
          </fieldset>

          <div className="bg-card p-6 md:p-8">
            {errors.form && (
              <p role="alert" className="mb-4 border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {errors.form}
              </p>
            )}
            <Button type="submit" variant="ember" size="xl" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              {pending ? "Отправляем…" : "Записаться"}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Удобнее по телефону?{" "}
              <a href={SITE.phoneHref} className="inline-flex items-center gap-1 font-mono text-primary hover:underline">
                <Phone className="h-3.5 w-3.5" /> {SITE.phone}
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
