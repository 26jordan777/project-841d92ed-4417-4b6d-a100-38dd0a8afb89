import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/kontakty")({
  head: () => ({
    meta: [
      { title: "Контакты — автосервис «Перспектива Авто», тер. Перспективная, 315" },
      {
        name: "description",
        content: "Адрес, телефон и режим работы автосервиса в Индустриальном районе Краснодара, тер. Перспективная, 315.",
      },
      { property: "og:title", content: "Контакты — «Перспектива Авто», Краснодар" },
      {
        property: "og:description",
        content: "Краснодар, Индустриальный, территория Перспективная, 315. Телефон и схема проезда.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <p className="eyebrow">// Контакты</p>
      <h1 className="mt-4 text-4xl font-extrabold md:text-6xl">Ждём вас в сервисе</h1>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-px border border-border bg-border">
          <div className="bg-card p-6">
            <MapPin className="h-6 w-6 text-primary" />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Адрес</p>
            <p className="mt-1 text-lg font-semibold">{SITE.address}</p>
            <Button asChild variant="steel" size="sm" className="mt-4">
              <a href={SITE.mapLink} target="_blank" rel="noreferrer">
                <Navigation /> Проложить маршрут
              </a>
            </Button>
          </div>
          <div className="bg-card p-6">
            <Phone className="h-6 w-6 text-primary" />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Телефон</p>
            <a href={SITE.phoneHref} className="mt-1 block font-mono text-2xl font-bold hover:text-primary">
              {SITE.phone}
            </a>
          </div>
          <div className="bg-card p-6">
            <Clock className="h-6 w-6 text-primary" />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Режим работы</p>
            <ul className="mt-2 space-y-2">
              {SITE.hours.map((h) => (
                <li key={h.days} className="flex justify-between border-b border-border pb-2 text-sm">
                  <span className="text-muted-foreground">{h.days}</span>
                  <span className="font-mono">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative min-h-[420px] border border-border bg-card">
          <iframe
            title="Карта: автосервис на территории Перспективная, 315"
            src={SITE.mapEmbed}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
