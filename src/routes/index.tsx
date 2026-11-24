import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Crown, Handshake, LineChart, Share2, ShieldCheck, Sparkles, Trophy, Users, Wallet } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Easy Partner — Platform Mitra Resmi Easy Notaris" },
      { name: "description", content: "Kelola prospek, kolaborasi, dan komisi sebagai Mitra Referral atau Mitra Aktif Easy Notaris." },
      { property: "og:title", content: "Easy Partner — Platform Mitra Resmi Easy Notaris" },
      { property: "og:description", content: "Gabung jadi mitra Easy Notaris dan raih komisi dari setiap kantor notaris yang Anda rekomendasikan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 pt-safe backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
          <Logo />
          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <Button asChild size="lg" variant="default"><Link to="/dashboard">Buka Dashboard<ArrowRight /></Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="lg" className="hidden sm:inline-flex"><Link to="/login">Masuk</Link></Button>
                <Button asChild size="lg"><Link to="/register">Daftar Mitra</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-grid [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-mesh opacity-60 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 text-center lg:pb-24 lg:pt-24">
          <Badge variant="outline" className="mx-auto gap-1.5 bg-card px-3 py-1 text-xs shadow-xs">
            <Sparkles className="size-3.5 text-coral" /> Program Mitra Resmi Easy Notaris
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-[40px] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Rekomendasikan. Kolaborasi.{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">Raih komisi.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Easy Partner membantu staf dan profesional kenotariatan mengelola prospek, presentasi, dan komisi dalam satu aplikasi yang cepat.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" variant="brand"><Link to="/register">Mulai sebagai Mitra Referral<ArrowRight /></Link></Button>
            <Button asChild size="xl" variant="outline"><Link to="/login">Masuk ke akun</Link></Button>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-14 max-w-4xl text-left lg:mt-20">
            <div className="rounded-[28px] border bg-card/70 p-2 shadow-xl backdrop-blur">
              <div className="overflow-hidden rounded-[22px] border bg-background">
                <div className="flex items-center gap-1.5 border-b bg-card px-4 py-3">
                  <span className="size-2.5 rounded-full bg-coral" /><span className="size-2.5 rounded-full bg-warning" /><span className="size-2.5 rounded-full bg-cyan" />
                  <span className="ml-3 text-xs text-muted-foreground">partner.easynotaris.id/dashboard</span>
                </div>
                <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-4 sm:p-4">
                  {[
                    { l: "Total Prospek", v: "48", i: Users, t: "bg-brand-soft text-brand" },
                    { l: "Closing", v: "12", i: Trophy, t: "bg-ink text-ink-foreground" },
                    { l: "Conversion", v: "38%", i: LineChart, t: "bg-coral-soft text-destructive" },
                    { l: "Komisi Tersedia", v: "Rp4,3 jt", i: Wallet, t: "bg-cyan-soft text-success" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border bg-card p-3">
                      <div className="flex items-center justify-between"><span className="text-[11px] text-muted-foreground">{s.l}</span><span className={`grid size-6 place-items-center rounded-md ${s.t}`}><s.i className="size-3.5" /></span></div>
                      <p className="mt-2 text-lg font-bold num">{s.v}</p>
                    </div>
                  ))}
                  <div className="col-span-2 rounded-xl border bg-card p-3 sm:col-span-3">
                    <p className="text-xs font-semibold">Tren Closing</p>
                    <div className="mt-3 flex h-24 items-end gap-2">
                      {[30, 45, 35, 60, 75, 92].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-md bg-gradient-brand" style={{ height: `${h}%`, opacity: 0.45 + i * 0.1 }} />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-xl bg-gradient-warm p-3 text-ink sm:col-span-1">
                    <p className="text-[11px] font-semibold opacity-80">Pengumuman</p>
                    <p className="mt-1 text-sm font-bold leading-snug">Bonus closing Desember naik 20%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 lg:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Users, title: "Pipeline prospek", text: "Pantau setiap kantor notaris dari prospek baru hingga closing dengan tabel dan kanban." },
            { icon: Handshake, title: "Kolaborasi mitra", text: "Minta Mitra Aktif berpengalaman mendampingi presentasi, komisi dibagi transparan." },
            { icon: Wallet, title: "Komisi transparan", text: "Lihat komisi pending, tersedia, dan dicairkan. Pencairan dua kali sebulan." },
            { icon: CalendarDays, title: "Jadwal terpusat", text: "Follow-up, presentasi, dan trial tersusun rapi di kalender." },
            { icon: Share2, title: "Referral sekali klik", text: "Bagikan tautan dan template pesan WhatsApp yang siap pakai." },
            { icon: ShieldCheck, title: "Resmi & aman", text: "Dikelola langsung oleh tim Easy Notaris dengan verifikasi mitra." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-xs">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><f.icon className="size-5" /></span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ink p-8 text-ink-foreground lg:p-12">
          <div className="absolute inset-0 bg-mesh" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dua level kemitraan, satu tujuan.</h2>
              <p className="mt-3 text-sidebar-foreground/75">Mulai sebagai Mitra Referral, lalu naik level menjadi Mitra Aktif setelah mencapai target.</p>
              <Button asChild size="xl" variant="brand" className="mt-6"><Link to="/register">Daftar sekarang<ArrowRight /></Link></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-card/10 bg-card/5 p-5 backdrop-blur">
                <Users className="size-5 text-cyan" />
                <p className="mt-3 font-semibold">Mitra Referral</p>
                <p className="mt-1 text-sm text-sidebar-foreground/70">Rekomendasikan kantor notaris dan dapatkan komisi dari setiap closing.</p>
              </div>
              <div className="rounded-2xl border border-card/10 bg-card/5 p-5 backdrop-blur">
                <Crown className="size-5 text-coral" />
                <p className="mt-3 font-semibold">Mitra Aktif</p>
                <p className="mt-1 text-sm text-sidebar-foreground/70">Presentasi mandiri, bantu mitra lain, dan raih komisi kolaborasi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t pb-safe">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
          <Logo sub={false} />
          <p>© {new Date().getFullYear()} Easy Notaris. Seluruh hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
