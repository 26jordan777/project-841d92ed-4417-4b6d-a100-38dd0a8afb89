import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Главная" },
  { to: "/uslugi", label: "Услуги и цены" },
  { to: "/zapis", label: "Запись" },
  { to: "/kontakty", label: "Контакты" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center bg-primary font-mono text-sm font-bold text-primary-foreground">
            ПА
          </span>
          <span className="leading-tight">
            <span className="block font-mono text-sm font-bold tracking-widest">{SITE.short}</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              автосервис
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ember" size="sm" className="hidden sm:inline-flex">
            <a href={SITE.phoneHref}>
              <Phone /> {SITE.phone}
            </a>
          </Button>
          <Button asChild variant="ember" size="icon" className="sm:hidden" aria-label="Позвонить">
            <a href={SITE.phoneHref}>
              <Phone />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border px-5 py-4 font-mono text-sm uppercase tracking-widest"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
