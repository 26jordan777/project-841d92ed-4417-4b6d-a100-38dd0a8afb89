import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Loader2, LogOut, MessageSquare, Phone, RefreshCw, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { localNow } from "@/lib/booking";
import { isUpcoming, STATUS_LABELS, type BookingStatus } from "@/lib/admin";
import { listBookings, updateBookingStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Заявки на запись — служебный раздел" },
      { name: "description", content: "Список онлайн-заявок автосервиса для сотрудников." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Заявки на запись — служебный раздел" },
      { property: "og:description", content: "Список онлайн-заявок автосервиса для сотрудников." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Tab = "upcoming" | "new" | "all";

const STATUS_STYLE: Record<BookingStatus, string> = {
  new: "border-primary bg-primary/15 text-primary",
  confirmed: "border-chart-2 bg-chart-2/15 text-chart-2",
  done: "border-steel bg-muted text-muted-foreground",
  cancelled: "border-destructive/60 bg-destructive/10 text-destructive",
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function formatCreated(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  });
}

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchBookings = useServerFn(listBookings);
  const setStatus = useServerFn(updateBookingStatus);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [today, setToday] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => setToday(localNow(new Date()).date), []);

  const query = useQuery({ queryKey: ["admin-bookings"], queryFn: () => fetchBookings(), refetchInterval: 60_000 });

  const mutation = useMutation({
    mutationFn: (v: { id: string; status: BookingStatus }) => setStatus({ data: v }),
    onMutate: () => setActionError(""),
    onError: (e) => setActionError(e instanceof Error ? e.message : "Не удалось изменить статус."),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  const bookings = query.data?.bookings ?? [];
  const counts = useMemo(
    () => ({
      upcoming: bookings.filter((b) => isUpcoming(b, today)).length,
      new: bookings.filter((b) => b.status === "new").length,
      all: bookings.length,
    }),
    [bookings, today],
  );
  const visible = useMemo(() => {
    if (tab === "upcoming") return bookings.filter((b) => isUpcoming(b, today));
    if (tab === "new") return bookings.filter((b) => b.status === "new");
    return [...bookings].reverse();
  }, [bookings, tab, today]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "upcoming", label: "Предстоящие" },
    { id: "new", label: "Новые" },
    { id: "all", label: "Все" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">// Служебный раздел</p>
          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">Заявки на запись</h1>
          <p className="mt-2 truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="steel" size="sm" onClick={() => query.refetch()} disabled={query.isFetching}>
            <RefreshCw className={cn(query.isFetching && "animate-spin")} /> Обновить
          </Button>
          <Button variant="steel" size="sm" onClick={signOut}>
            <LogOut /> Выйти
          </Button>
        </div>
      </div>

      {query.isPending ? (
        <div className="mt-16 flex justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : query.isError ? (
        <p className="mt-10 border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {query.error instanceof Error ? query.error.message : "Не удалось загрузить заявки."}
        </p>
      ) : !query.data.allowed ? (
        <p className="mt-10 border border-border bg-card p-6 text-sm text-muted-foreground">
          У этого аккаунта нет доступа к заявкам. Обратитесь к руководителю сервиса.
        </p>
      ) : (
        <>
          <div className="mt-10 flex gap-px overflow-x-auto border border-border bg-border">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors",
                  tab === t.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
                <span className="opacity-70">{counts[t.id]}</span>
              </button>
            ))}
          </div>

          {actionError && (
            <p role="alert" className="mt-4 border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {actionError}
            </p>
          )}

          {visible.length === 0 ? (
            <p className="mt-6 border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Здесь пока пусто.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((b) => {
                const status = (b.status in STATUS_LABELS ? b.status : "new") as BookingStatus;
                const busy = mutation.isPending && mutation.variables?.id === b.id;
                return (
                  <li key={b.id} className="flex flex-col border border-border bg-card">
                    <div className="flex items-start justify-between gap-3 border-b border-border p-4">
                      <div>
                        <p className="font-mono text-2xl font-bold">{b.booking_time}</p>
                        <p className="text-sm capitalize text-muted-foreground">{formatDate(b.booking_date)}</p>
                      </div>
                      <span className={cn("border px-2 py-1 font-mono text-[10px] uppercase tracking-widest", STATUS_STYLE[status])}>
                        {STATUS_LABELS[status]}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2 p-4 text-sm">
                      <p className="font-semibold">{b.service}</p>
                      <a href={`tel:${b.phone}`} className="flex items-center gap-2 font-mono text-primary hover:underline">
                        <Phone className="h-4 w-4" /> {b.phone}
                      </a>
                      {b.name && (
                        <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {b.name}</p>
                      )}
                      {b.comment && (
                        <p className="flex gap-2 text-muted-foreground">
                          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" /> <span className="break-words">{b.comment}</span>
                        </p>
                      )}
                      <p className="pt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Заявка от {formatCreated(b.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 border-t border-border p-3">
                      {status !== "confirmed" && status !== "done" && (
                        <Button size="sm" variant="ember" disabled={busy} onClick={() => mutation.mutate({ id: b.id, status: "confirmed" })}>
                          Подтвердить
                        </Button>
                      )}
                      {status === "confirmed" && (
                        <Button size="sm" variant="ember" disabled={busy} onClick={() => mutation.mutate({ id: b.id, status: "done" })}>
                          Выполнена
                        </Button>
                      )}
                      {status !== "cancelled" && status !== "done" && (
                        <Button size="sm" variant="steel" disabled={busy} onClick={() => mutation.mutate({ id: b.id, status: "cancelled" })}>
                          Отменить
                        </Button>
                      )}
                      {(status === "cancelled" || status === "done") && (
                        <Button size="sm" variant="steel" disabled={busy} onClick={() => mutation.mutate({ id: b.id, status: "new" })}>
                          Вернуть в новые
                        </Button>
                      )}
                      {busy && <Loader2 className="h-4 w-4 animate-spin self-center text-muted-foreground" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
