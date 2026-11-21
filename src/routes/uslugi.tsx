import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { CallBanner } from "@/components/site/CallBanner";
import { SERVICES } from "@/lib/site";
import diagImg from "@/assets/diagnostics.jpg";

export const Route = createFileRoute("/uslugi")({
  head: () => ({
    meta: [
      { title: "Услуги и цены на ремонт АКПП — «Лаборатория АКПП», Краснодар" },
      {
        name: "description",
        content:
          "Цены на диагностику, прошивку, rebuild и ремонт АКПП, DSG, вариаторов CVT, PowerShift, мехатроников и гидротрансформаторов в Краснодаре.",
      },
      { property: "og:title", content: "Услуги и цены — «Лаборатория АКПП»" },
      {
        property: "og:description",
        content: "Ремонт АКПП, DSG, CVT, PowerShift и раздаточных коробок. Краснодар, ул. Щорса, 50/1.",
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
              Ремонт <span className="text-primary">АКПП</span> любой сложности
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              Диагностика, обслуживание и восстановление АКПП, DSG, CVT, PowerShift и раздаточных коробок. Указаны стартовые цены за работу — точную стоимость назовём после диагностики, до начала ремонта.
            </p>
          </div>
          <img
            src={diagImg}
            alt="Компьютерная диагностика коробки передач"
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
              <p className="mt-4 text-sm text-muted-foreground">{s.description}</p>
              {s.items && (
              <ul className="mt-6 grid gap-2 border-t border-border pt-5 sm:grid-cols-2">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" /> {it}
                  </li>
                ))}
              </ul>
              )}
              <Link
                to="/zapis"
                search={{ service: s.title }}
                className="mt-auto inline-flex items-center gap-2 self-start pt-6 font-mono text-xs uppercase tracking-widest text-primary hover:underline"
              >
                Записаться на эту услугу <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CallBanner />
    </>
  );
}
