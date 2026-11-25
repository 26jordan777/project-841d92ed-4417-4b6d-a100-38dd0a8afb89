import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Clock, BadgeRussianRuble, Cpu, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallBanner } from "@/components/site/CallBanner";
import { FEATURED_SERVICES, SERVICES, SITE } from "@/lib/site";
import heroImg from "@/assets/hero-garage.jpg";
import engineImg from "@/assets/engine-work.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Лаборатория АКПП — ремонт автоматических коробок в Краснодаре" },
      {
        name: "description",
        content:
          "Ремонт АКПП, DSG, вариаторов CVT, PowerShift и раздаточных коробок в Краснодаре, ул. Щорса, 50/1. Диагностика от 2 500 ₽.",
      },
      { property: "og:title", content: "Лаборатория АКПП — ремонт коробок передач в Краснодаре" },
      {
        property: "og:description",
        content: "Диагностика, прошивка, rebuild и ремонт АКПП, DSG, CVT. Краснодар, мкр. Центральный, ул. Щорса, 50/1.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STATS = [
  { value: String(SERVICES.length), label: "видов работ" },
  { value: "4 этапа", label: "диагностики коробки" },
  { value: "от 2 500 ₽", label: "диагностика" },
  { value: "AT · DSG · CVT", label: "и PowerShift" },
];

const ADVANTAGES = [
  { icon: BadgeRussianRuble, title: "Цена до начала работ", text: "Согласуем смету заранее. Никаких доплат без вашего согласия." },
  { icon: Cpu, title: "Современное оборудование", text: "Компьютерная диагностика, замер давления и прошивка блоков управления." },
  { icon: Clock, title: "Без долгих очередей", text: "Записываем на конкретное время, чтобы вы не ждали." },
  { icon: Building2, title: "Работаем с юрлицами", text: "Договор, безналичная оплата с НДС или без, полный пакет документов." },
];

const STEPS = [
  { n: "01", title: "Запись", text: "Оставляете заявку онлайн или звоните — подтверждаем время." },
  { n: "02", title: "Диагностика", text: "Проверяем масло, давление, электронику и коробку на ходу — называем стоимость." },
  { n: "03", title: "Ремонт", text: "Выполняем работы после согласования." },
  { n: "04", title: "Выдача", text: "Проверяем работу коробки и показываем заменённые детали." },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Автомобиль на подъёмнике в сервисе по ремонту АКПП"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_center]"
        />
        <div className="bg-hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 md:justify-center md:pb-24">
          <div className="max-w-2xl animate-rise">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-2 w-2 animate-pulse-ember rounded-full bg-primary" />
              {SITE.city} · {SITE.district}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-7xl">
              Ремонт АКПП
              <br />
              <span className="text-primary">без сюрпризов</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
              Диагностика, прошивка и ремонт АКПП, DSG, вариаторов, PowerShift и раздаточных коробок. Честная смета до начала работ.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="ember" size="xl">
                <Link to="/zapis">
                  <CalendarCheck /> Записаться онлайн
                </Link>
              </Button>
              <Button asChild variant="steel" size="xl">
                <Link to="/uslugi">
                  Услуги и цены <ArrowRight />
                </Link>
              </Button>
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {SITE.addressShort}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card px-5 py-8">
              <p className="font-mono text-2xl font-bold text-primary md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">// Услуги</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">Ремонт коробок передач</h2>
          </div>
          <Link
            to="/uslugi"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-primary hover:underline"
          >
            Все услуги и цены <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_SERVICES.map((s) => (
            <article key={s.title} className="group bg-background p-6 transition-colors hover:bg-card">
              <s.icon className="h-8 w-8 text-primary transition-transform group-hover:-translate-y-1" />
              <h3 className="mt-6 text-lg font-bold leading-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              <p className="mt-6 font-mono text-sm text-primary">{s.price}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div className="relative">
            <img
              src={engineImg}
              alt="Мастер за ремонтом агрегата"
              loading="lazy"
              width={1200}
              height={912}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="hazard-stripe absolute -bottom-3 -right-3 -z-0 h-16 w-32" />
          </div>
          <div>
            <p className="eyebrow">// Почему мы</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">Работаем так, как хотели бы для себя</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {ADVANTAGES.map((a) => (
                <div key={a.title}>
                  <a.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-bold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <p className="eyebrow">// Как проходит ремонт</p>
        <h2 className="mt-3 text-3xl font-bold md:text-5xl">Четыре шага</h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="border-t-2 border-primary pt-5">
              <span className="font-mono text-4xl font-extrabold text-steel">{s.n}</span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <CallBanner />
    </>
  );
}
