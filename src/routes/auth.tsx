import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, KeyRound, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { registerStaff, verifySectionPassword } from "@/lib/staff.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Служебный вход — «Лаборатория АКПП»" },
      { name: "description", content: "Вход для сотрудников автосервиса." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Служебный вход — «Лаборатория АКПП»" },
      { property: "og:description", content: "Вход для сотрудников автосервиса." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const fieldLabel = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

type Mode = "login" | "code" | "register";

function errMsg(e: unknown, fallback: string) {
  return e instanceof Error && /[а-яё]/i.test(e.message) ? e.message : fallback;
}

function AuthPage() {
  const navigate = useNavigate();
  const verifyCode = useServerFn(verifySectionPassword);
  const signUp = useServerFn(registerStaff);
  const [mode, setMode] = useState<Mode>("login");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setPassword("");
    setPassword2("");
    if (next === "login") setCode("");
  }

  async function onLogin(e: FormEvent) {
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

  async function onCode(e: FormEvent) {
    e.preventDefault();
    if (!code) {
      setError("Введите пароль раздела.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const { ok } = await verifyCode({ data: { code } });
      if (ok) switchMode("register");
      else setError("Неверный пароль раздела.");
    } catch (err) {
      setError(errMsg(err, "Не удалось проверить пароль. Попробуйте ещё раз."));
    } finally {
      setPending(false);
    }
  }

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Введите правильную почту.");
    if (password.length < 8) return setError("Пароль — не короче 8 символов.");
    if (password !== password2) return setError("Пароли не совпадают.");
    setPending(true);
    setError("");
    try {
      await signUp({ data: { code, email: email.trim(), password } });
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        switchMode("login");
        setError("Аккаунт создан. Войдите с новой почтой и паролем.");
        return;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      const msg = errMsg(err, "Не удалось зарегистрироваться. Попробуйте ещё раз.");
      if (msg.includes("пароль раздела")) switchMode("code");
      setError(msg);
    } finally {
      setPending(false);
    }
  }

  const heading = mode === "login" ? "Служебный вход" : "Регистрация сотрудника";

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-16 md:py-24">
      {mode === "login" ? <KeyRound className="h-7 w-7 text-primary" /> : <ShieldCheck className="h-7 w-7 text-primary" />}
      <p className="eyebrow mt-6">// Только для сотрудников</p>
      <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{heading}</h1>

      {mode === "login" && (
        <>
          <form onSubmit={onLogin} className="mt-10 space-y-5 border border-border bg-card p-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className={fieldLabel}>Почта</Label>
              <Input id="email" type="email" autoComplete="username" value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }} className="h-12 rounded-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className={fieldLabel}>Пароль</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }} className="h-12 rounded-none" />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="ember" size="xl" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null} Войти
            </Button>
          </form>
          <Button type="button" variant="steel" className="mt-4 w-full" onClick={() => switchMode("code")}>
            <UserPlus /> Регистрация сотрудника
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Нет доступа или забыли пароль — обратитесь к руководителю сервиса.
          </p>
        </>
      )}

      {mode === "code" && (
        <form onSubmit={onCode} className="mt-10 space-y-5 border border-border bg-card p-6" noValidate>
          <p className="text-sm text-muted-foreground">
            Регистрация открывается только по паролю служебного раздела. Его знает руководитель сервиса.
          </p>
          <div className="space-y-2">
            <Label htmlFor="code" className={fieldLabel}>Пароль раздела</Label>
            <Input id="code" type="password" autoComplete="off" autoFocus value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }} className="h-12 rounded-none" />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="ember" size="xl" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : null} Продолжить
          </Button>
          <Button type="button" variant="steel" className="w-full" onClick={() => switchMode("login")}>
            <ArrowLeft /> Назад ко входу
          </Button>
        </form>
      )}

      {mode === "register" && (
        <form onSubmit={onRegister} className="mt-10 space-y-5 border border-border bg-card p-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="reg-email" className={fieldLabel}>Почта</Label>
            <Input id="reg-email" type="email" autoComplete="email" autoFocus value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }} className="h-12 rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password" className={fieldLabel}>Пароль (от 8 символов)</Label>
            <Input id="reg-password" type="password" autoComplete="new-password" value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }} className="h-12 rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password2" className={fieldLabel}>Повторите пароль</Label>
            <Input id="reg-password2" type="password" autoComplete="new-password" value={password2}
              onChange={(e) => { setPassword2(e.target.value); setError(""); }} className="h-12 rounded-none" />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="ember" size="xl" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : null} Зарегистрироваться
          </Button>
          <Button type="button" variant="steel" className="w-full" onClick={() => switchMode("login")}>
            <ArrowLeft /> Назад ко входу
          </Button>
        </form>
      )}
    </section>
  );
}
