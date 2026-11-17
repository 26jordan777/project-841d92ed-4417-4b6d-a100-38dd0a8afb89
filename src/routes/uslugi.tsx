import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { CallBanner } from "@/components/site/CallBanner";
import { SERVICES } from "@/lib/site";
import diagImg from "@/assets/diagnostics.jpg";

export const Route = createFileRoute("/uslugi")({
  head: () => ({
    meta: [
      { title: "Услуги и цены — автосервис «Перспектива Авто», Краснодар" },
      {
        name: "description",
        content:
          "Цены на диагностику, ремонт двигателя, ходовой, тормозов, ТО, автоэлектрику, кондиционер и шиномонтаж в Краснодаре.",
      },
      { property: "og:title", content: "Услуги и цены — «Перспектива Авто»" },
      {
        property: "og:description",
        content: "Диагностика, двигатель, ходовая, тормоза, ТО и шиномонтаж. Индустриальный район Краснодара.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-grid absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-rise">
            <p className="eyebrow">// Услуги и цены</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              Полный цикл <span className="text-primary">обслуживания</span>
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              Указаны стартовые цены за работу. Точную стоимость назовём после осмотра — до начала ремонта.
            </p>
          </div>
          <img
            src={diagImg}
            alt="Компьютерная диагностика автомобиля"
            width={1200}
            height={912}
            className="aspect-[4/3] w-full border border-border object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <article key={s.title} className="flex flex-col border border-border bg-card p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-steel">
                    <s.icon className="h-6 w-6 text-primary" />
                  </span>
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-bold leading-tight">{s.title}</h2>
                  </div>
                </div>
                <span className="shrink-0 bg-primary px-3 py-1 font-mono text-xs font-bold text-primary-foreground">
                  {s.price}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{s.text}</p>
              <ul className="mt-6 grid gap-2 border-t border-border pt-5 sm:grid-cols-2">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" /> {it}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <CallBanner />
    </>
  );
}
