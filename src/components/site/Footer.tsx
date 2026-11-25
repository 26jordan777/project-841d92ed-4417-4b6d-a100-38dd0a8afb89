import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="hazard-stripe h-2 w-full opacity-80" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-mono text-lg font-bold tracking-widest">{SITE.name.toUpperCase()}</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Ремонт АКПП, DSG, вариаторов, PowerShift и раздаточных коробок в Краснодаре.
          </p>
        </div>
        <div>
          <p className="eyebrow">Адрес</p>
          <p className="mt-3 text-sm">{SITE.address}</p>
          <a href={SITE.phoneHref} className="mt-2 block font-mono text-sm text-primary">
            {SITE.phone}
          </a>
        </div>
        <div>
          <p className="eyebrow">Режим работы</p>
          <ul className="mt-3 space-y-1 text-sm">
            {SITE.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4 border-b border-border/60 pb-1">
                <span className="text-muted-foreground">{h.days}</span>
                <span className="font-mono">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span>© {new Date().getFullYear()} {SITE.name}</span>
            <span className="whitespace-nowrap">
              <span className="font-script text-xl text-primary-glow">by</span>{" "}
              <span className="text-ember-gradient font-display text-sm font-bold tracking-[0.25em]">SARZHEVSKIY</span>
            </span>
          </span>
          <div className="flex gap-6">
            <Link to="/uslugi" className="hover:text-foreground">Услуги</Link>
            <Link to="/kontakty" className="hover:text-foreground">Контакты</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
