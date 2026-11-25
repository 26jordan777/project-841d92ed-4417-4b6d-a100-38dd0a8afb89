import { Phone, MapPin, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";

export function CallBanner() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Запись на диагностику и ремонт</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Выберите удобное время<br className="hidden sm:block" /> онлайн или по телефону
          </h2>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" /> {SITE.address}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Button asChild variant="ember" size="xl">
            <Link to="/zapis">
              <CalendarCheck /> Записаться онлайн
            </Link>
          </Button>
          <Button asChild variant="steel" size="xl">
            <a href={SITE.phoneHref}>
              <Phone /> {SITE.phone}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
