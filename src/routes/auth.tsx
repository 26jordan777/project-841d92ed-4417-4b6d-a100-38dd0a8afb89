import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Служебный вход — «Перспектива Авто»" },
      { name: "description", content: "Вход для сотрудников автосервиса." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Служебный вход — «Перспектива Авто»" },
      { property: "og:description", content: "Вход для сотрудников автосервиса." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const fieldLabel = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Введите почту и пароль.");
      return;
    }
    setPending(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setPending(false);
    if (error) {
      setError(
        error.message.toLowerCase().includes("invalid")
          ? "Неверная почта или пароль."
          : "Не удалось войти. Попробуйте ещё раз.",
      );
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-16 md:py-24">
      <KeyRound className="h-7 w-7 text-primary" />
      <p className="eyebrow mt-6">// Только для сотрудников</p>
      <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Служебный вход</h1>

      <form onSubmit={onSubmit} className="mt-10 space-y-5 border border-border bg-card p-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className={fieldLabel}>Почта</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="h-12 rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={fieldLabel}>Пароль</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="h-12 rounded-none"
          />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" variant="ember" size="xl" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null} Войти
        </Button>
      </form>
      <p className="mt-4 text-xs text-muted-foreground">
        Нет доступа или забыли пароль — обратитесь к руководителю сервиса.
      </p>
    </section>
  );
}
