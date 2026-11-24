import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, TrendingUp, Users, Wallet } from "lucide-react";
import { Logo } from "@/components/common/logo";

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden overflow-hidden bg-gradient-ink p-12 text-ink-foreground lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(70%_60%_at_30%_40%,black,transparent)]" />
        <div className="relative">
          <Link to="/"><Logo tone="light" /></Link>
        </div>
        <div className="relative mt-auto max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-muted">Platform Mitra Resmi</p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight">
            Kembangkan jaringan notaris, <span className="text-coral">raih komisi</span> lebih cepat.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-sidebar-foreground/75">
            Kelola prospek, jadwal presentasi, kolaborasi antar mitra, dan pencairan komisi Easy Notaris — semuanya dalam satu tempat.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { icon: Users, v: "1.200+", l: "Mitra aktif" },
              { icon: TrendingUp, v: "38%", l: "Rata-rata konversi" },
              { icon: Wallet, v: "Rp4,2 M", l: "Komisi dibayarkan" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-card/10 bg-card/5 p-4 backdrop-blur">
                <s.icon className="size-4 text-cyan" />
                <p className="mt-3 text-xl font-bold num">{s.v}</p>
                <p className="text-xs text-sidebar-muted">{s.l}</p>
              </div>
            ))}
          </div>

          <ul className="mt-8 space-y-2.5 text-sm text-sidebar-foreground/80">
            {["Pencairan komisi dua kali sebulan", "Kolaborasi dengan Mitra Aktif berpengalaman", "Materi promosi selalu terbaru"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-cyan" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative mt-12 text-xs text-sidebar-muted">© {new Date().getFullYear()} Easy Notaris. Seluruh hak dilindungi.</p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col bg-background pt-safe pb-safe">
        <div className="flex h-16 items-center px-5 lg:hidden">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="flex flex-1 items-start justify-center px-5 pb-10 pt-4 sm:items-center lg:px-12">
          <div className="w-full max-w-[420px] animate-rise">
            <h1 className="text-[26px] font-bold leading-tight tracking-tight">{title}</h1>
            {description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>}
            <div className="mt-7">{children}</div>
            {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
