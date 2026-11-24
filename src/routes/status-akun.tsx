import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Check, Circle, Clock, Crown, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { UserAvatar } from "@/components/common/user-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth/use-auth";
import { ROLE_LABEL, STATUS_LABEL } from "@/lib/auth/types";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/status-akun")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Status Akun — Easy Partner" },
      { name: "description", content: "Lihat status verifikasi dan level kemitraan Anda di Easy Partner." },
      { property: "og:title", content: "Status Akun — Easy Partner" },
      { property: "og:description", content: "Status verifikasi dan level mitra Easy Notaris." },
    ],
  }),
  component: StatusPage,
});

function StatusPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-dvh bg-background pt-safe pb-safe">
      <header className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
        <Link to="/"><Logo /></Link>
        {user && (
          <Button asChild variant="ghost" size="sm"><Link to="/dashboard"><ArrowLeft />Dashboard</Link></Button>
        )}
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-12 pt-4 animate-rise">
        {!user ? (
          <div className="rounded-3xl border bg-card p-8 text-center shadow-sm">
            <ShieldAlert className="mx-auto size-10 text-muted-foreground" />
            <h1 className="mt-4 text-xl font-bold">Masuk untuk melihat status akun</h1>
            <p className="mt-2 text-sm text-muted-foreground">Status verifikasi dan level kemitraan hanya bisa dilihat oleh pemilik akun.</p>
            <Button asChild size="xl" className="mt-6"><Link to="/login">Masuk</Link></Button>
          </div>
        ) : (
          <StatusContent />
        )}
      </main>
    </div>
  );
}

function StatusContent() {
  const { user } = useAuth();
  if (!user) return null;
  const active = user.status === "active";
  const steps = [
    { label: "Pendaftaran akun", done: true, date: fmtDate(user.joinedAt) },
    { label: "Verifikasi email & WhatsApp", done: user.status !== "unverified" },
    { label: "Peninjauan data oleh tim Easy Notaris", done: active },
    { label: "Akun aktif sebagai " + ROLE_LABEL[user.role], done: active },
  ];
  const closing = user.role === "referral" ? 4 : 15;
  const target = 5;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-ink p-6 text-ink-foreground shadow-lg sm:p-8">
        <div className="absolute inset-0 bg-mesh opacity-80" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <UserAvatar name={user.name} className="size-16 text-lg ring-4 ring-card/10" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold tracking-tight">{user.name}</h1>
            <p className="mt-1 text-sm text-sidebar-foreground/75">{user.email} · {user.city}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={active ? "cyan" : "warning"} className="px-2.5 py-1">
                {active ? <BadgeCheck className="size-3.5" /> : <Clock className="size-3.5" />} {STATUS_LABEL[user.status]}
              </Badge>
              <Badge variant="brand" className="px-2.5 py-1">{ROLE_LABEL[user.role]}</Badge>
              <Badge variant="outline" className="border-card/20 px-2.5 py-1 text-ink-foreground">{user.category}</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-xs">
        <h2 className="font-semibold">Progres verifikasi</h2>
        <ol className="mt-5 space-y-0">
          {steps.map((s, i) => (
            <li key={s.label} className="relative flex gap-4 pb-6 last:pb-0">
              {i < steps.length - 1 && <span className={cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5", s.done ? "bg-brand" : "bg-border")} />}
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", s.done ? "bg-brand text-brand-foreground" : "border-2 bg-card text-muted-foreground")}>
                {s.done ? <Check className="size-4" /> : <Circle className="size-2.5" />}
              </span>
              <div className="pt-1">
                <p className={cn("text-sm font-semibold", !s.done && "text-muted-foreground")}>{s.label}</p>
                {s.date && <p className="text-xs text-muted-foreground">{s.date}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {user.role === "referral" && (
        <section className="rounded-3xl border bg-card p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-warning-soft text-warning"><Crown className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">Naik level ke Mitra Aktif</h2>
              <p className="mt-1 text-sm text-muted-foreground">Capai {target} closing dan selesaikan pelatihan produk untuk membuka komisi kolaborasi dan permintaan bantuan.</p>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                <span>{closing} dari {target} closing</span>
                <span className="text-brand">{Math.round((closing / target) * 100)}%</span>
              </div>
              <Progress value={(closing / target) * 100} className="mt-2 h-2" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
