import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgePercent,
  CalendarCheck,
  Clock4,
  FlaskConical,
  Handshake,
  Inbox,
  Presentation,

  Trophy,
  UserCheck,
  Users,
  Wallet,
  WalletCards,
  ShieldCheck,
  UserPlus,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/use-auth";
import { StatCard } from "@/components/common/stat-card";
import { SectionCard, EmptyState } from "@/components/common/section-card";
import { UserAvatar } from "@/components/common/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ClosingTrendChart, CommissionChart } from "@/components/dashboard/charts";
import {
  AnnouncementList,
  CollaborationList,
  FollowUpToday,
  HelpRequestCard,
  PresentationSchedule,
  MainMenu,
  QuickActions,
  RecentActivity,
  SectionTitle,
  StatRail,
  WelcomeHero,
} from "@/components/dashboard/widgets";
import { helpStore, partnerStore, prospectStore, useStore } from "@/lib/store";
import { COMMISSIONS } from "@/lib/mock-data";
import { rupiah, rupiahShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Beranda — Easy Partner" },
      { name: "description", content: "Ringkasan prospek, jadwal, kolaborasi, dan komisi mitra Easy Notaris." },
      { property: "og:title", content: "Beranda — Easy Partner" },
      { property: "og:description", content: "Dashboard mitra Easy Notaris." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "aktif") return <AktifDashboard />;
  return <ReferralDashboard />;
}

function useCounts() {
  const prospects = useStore(prospectStore);
  const total = prospects.length;
  const by = (s: string) => prospects.filter((p) => p.stage === s).length;
  const closing = by("closing") + 2; // + historical
  const pending = COMMISSIONS.filter((c) => c.status === "pending").reduce((a, c) => a + c.amount, 0);
  const tersedia = COMMISSIONS.filter((c) => c.status === "tersedia").reduce((a, c) => a + c.amount, 0);
  const active = prospects.filter((p) => !["closing", "batal"].includes(p.stage)).length;
  return { total, active, presentasi: by("presentasi") + 5, trial: by("trial") + 3, closing, conv: Math.round((closing / (total + 2)) * 100), pending, tersedia };
}

function ReferralDashboard() {
  const { user } = useAuth();
  const c = useCounts();
  if (!user) return null;
  return (
    <div className="space-y-6">
      <WelcomeHero
        user={user}
        metric={{ label: "Komisi tersedia", value: rupiah(c.tersedia), hint: `${rupiahShort(c.pending)} menunggu validasi` }}
        stats={[
          { label: "Prospek aktif", value: String(c.active) },
          { label: "Closing", value: String(c.closing) },
          { label: "Konversi", value: `${c.conv}%` },
        ]}
      >
        <QuickActions />
      </WelcomeHero>
      <MainMenu role={user.role} />

      <div>
        <SectionTitle title="Ringkasan Performa" />
        <StatRail>
        <StatCard label="Total Prospek" value={String(c.total)} icon={Users} delta={12} hint="vs bulan lalu" />
        <StatCard label="Prospek Aktif" value={String(c.active)} icon={UserCheck} tone="cyan" delta={8} hint="sedang berjalan" />
        <StatCard label="Total Presentasi" value={String(c.presentasi)} icon={Presentation} tone="warning" delta={4} hint="bulan ini" />
        <StatCard label="Total Trial" value={String(c.trial)} icon={FlaskConical} tone="muted" delta={-2} hint="bulan ini" />
        <StatCard label="Total Closing" value={String(c.closing)} icon={Trophy} tone="ink" delta={20} hint="bulan ini" />
        <StatCard label="Conversion Rate" value={`${c.conv}%`} icon={BadgePercent} tone="coral" delta={3} hint="prospek → closing" />
        <StatCard label="Komisi Pending" value={rupiahShort(c.pending)} icon={Clock4} tone="warning" hint="menunggu validasi" />
        <StatCard label="Komisi Tersedia" value={rupiahShort(c.tersedia)} icon={Wallet} tone="cyan" hint="siap dicairkan" />
        </StatRail>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <SectionCard title="Follow-up Hari Ini" description="Jangan lewatkan prospek Anda" href="/prospek"><FollowUpToday /></SectionCard>
        <SectionCard title="Jadwal Presentasi" description="Presentasi mendatang" href="/aktivitas"><PresentationSchedule /></SectionCard>
        <SectionCard title="Kolaborasi Berjalan" description="Bersama Mitra Aktif" href="/kolaborasi"><CollaborationList /></SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <SectionCard title="Tren Closing" description="6 bulan terakhir" bodyClassName="pt-2"><ClosingTrendChart /></SectionCard>
        <SectionCard title="Grafik Komisi" description="Total komisi per bulan" bodyClassName="pt-2"><CommissionChart /></SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <SectionCard title="Aktivitas Terbaru"><RecentActivity /></SectionCard>
        <SectionCard title="Pengumuman" href="/pengumuman"><AnnouncementList /></SectionCard>
      </div>
    </div>
  );
}

function KpiTargets() {
  const items = [
    { label: "Closing bulan ini", value: 6, target: 8, tone: "bg-gradient-brand" },
    { label: "Presentasi", value: 14, target: 16 },
    { label: "Prospek baru", value: 22, target: 30 },
    { label: "Komisi (juta)", value: 7.2, target: 10 },
  ];
  return (
    <div className="space-y-4">
      {items.map((k) => {
        const pct = Math.min(100, Math.round((k.value / k.target) * 100));
        return (
          <div key={k.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{k.label}</span>
              <span className="text-xs text-muted-foreground num"><span className="font-bold text-foreground">{k.value}</span> / {k.target}</span>
            </div>
            <Progress value={pct} className="mt-2 h-2" />
          </div>
        );
      })}
    </div>
  );
}

function AktifDashboard() {
  const { user } = useAuth();
  const help = useStore(helpStore);
  const incoming = help.filter((h) => h.status === "menunggu");
  const running = help.filter((h) => h.status === "berjalan");
  const komKol = COMMISSIONS.filter((c) => c.type === "kolaborasi").reduce((a, c) => a + c.amount, 0);
  if (!user) return null;

  return (
    <div className="space-y-6">
      <WelcomeHero
        user={user}
        metric={{ label: "Target KPI November", value: "6 / 8 closing", hint: "2 closing lagi untuk bonus Gold+" }}
        stats={[
          { label: "Permintaan", value: String(incoming.length) },
          { label: "Kolaborasi", value: String(running.length) },
          { label: "Komisi tersedia", value: rupiahShort(4_320_000) },
        ]}
      >
        <QuickActions />
      </WelcomeHero>
      <MainMenu role={user.role} />

      <div>
        <SectionTitle title="Ringkasan Performa" />
        <StatRail>
        <StatCard label="Permintaan Masuk" value={String(incoming.length)} icon={Inbox} tone="coral" hint="menunggu respons" />
        <StatCard label="Bantuan Berjalan" value={String(running.length)} icon={Handshake} tone="brand" hint="kolaborasi aktif" />
        <StatCard label="Presentasi Terjadwal" value="5" icon={CalendarCheck} tone="warning" hint="7 hari ke depan" />
        <StatCard label="Closing Mandiri" value="4" icon={Trophy} tone="ink" delta={33} hint="bulan ini" />
        <StatCard label="Closing Kolaborasi" value="2" icon={Users} tone="cyan" delta={0} hint="bulan ini" />
        <StatCard label="Komisi Kolaborasi" value={rupiahShort(komKol)} icon={WalletCards} tone="cyan" delta={18} hint="total" />
        <StatCard label="Conversion Rate" value="44%" icon={BadgePercent} tone="coral" delta={5} hint="prospek → closing" />
        <StatCard label="Komisi Tersedia" value={rupiahShort(4_320_000)} icon={Wallet} tone="brand" hint="siap dicairkan" />
        </StatRail>
      </div>

      <section>
        <SectionTitle title="Permintaan Bantuan Masuk" href="/kolaborasi" />
        {incoming.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 lg:gap-4">
            {incoming.map((h) => <HelpRequestCard key={h.id} h={h} />)}
          </div>
        ) : (
          <EmptyState icon={<Inbox />} title="Tidak ada permintaan baru" text="Permintaan bantuan dari Mitra Referral akan muncul di sini." />
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <SectionCard title="Target KPI" description="Periode November"><KpiTargets /></SectionCard>
        <SectionCard title="Bantuan Berjalan" href="/kolaborasi"><CollaborationList /></SectionCard>
        <SectionCard title="Presentasi Terjadwal" href="/aktivitas"><PresentationSchedule /></SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <SectionCard
          title="Performa Bulanan"
          description="Closing mandiri vs kolaborasi"
          action={
            <div className="flex gap-3 text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-brand" />Mandiri</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-cyan" />Kolaborasi</span>
            </div>
          }
          bodyClassName="pt-2"
        >
          <ClosingTrendChart stacked />
        </SectionCard>
        <SectionCard title="Grafik Komisi" description="Total komisi per bulan" bodyClassName="pt-2"><CommissionChart /></SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <SectionCard title="Aktivitas Terbaru"><RecentActivity /></SectionCard>
        <SectionCard title="Pengumuman" href="/pengumuman"><AnnouncementList /></SectionCard>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const partners = useStore(partnerStore);
  const waiting = partners.filter((p) => p.status === "menunggu");
  const top = [...partners].sort((a, b) => b.closing - a.closing).slice(0, 5);
  if (!user) return null;

  const approve = (id: string, name: string) => {
    partnerStore.set((l) => l.map((p) => (p.id === id ? { ...p, status: "aktif" } : p)));
    toast.success(`${name} disetujui sebagai Mitra Referral`);
  };

  return (
    <div className="space-y-6">
      <WelcomeHero
        user={user}
        metric={{ label: "Total mitra terdaftar", value: (partners.length + 1184).toLocaleString("id-ID"), hint: "+6% dibanding bulan lalu" }}
        stats={[
          { label: "Verifikasi", value: String(waiting.length) },
          { label: "Mitra Aktif", value: "312" },
          { label: "Closing bulan ini", value: "148" },
        ]}
      >
        <div className="hidden gap-2 lg:flex">
          <Button asChild variant="glass" className="h-10 rounded-xl"><Link to="/mitra"><ShieldCheck />Kelola Mitra</Link></Button>
          <Button asChild variant="glass" className="h-10 rounded-xl"><Link to="/komisi"><Wallet />Validasi Komisi</Link></Button>
        </div>
      </WelcomeHero>
      <MainMenu role={user.role} />

      <div>
        <SectionTitle title="Ringkasan Program" />
        <StatRail>
        <StatCard label="Total Mitra" value={String(partners.length + 1184)} icon={Users} delta={6} hint="bulan ini" />
        <StatCard label="Mitra Aktif" value="312" icon={Trophy} tone="ink" delta={4} hint="level Aktif" />
        <StatCard label="Menunggu Verifikasi" value={String(waiting.length)} icon={UserPlus} tone="coral" hint="perlu ditinjau" />
        <StatCard label="Closing Bulan Ini" value="148" icon={BadgePercent} tone="cyan" delta={11} hint="semua mitra" />
        </StatRail>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:gap-6">
        <SectionCard title="Closing Seluruh Mitra" description="Mandiri vs kolaborasi" bodyClassName="pt-2"><ClosingTrendChart stacked /></SectionCard>
        <SectionCard title="Menunggu Verifikasi" href="/mitra">
          {waiting.length ? (
            <ul className="space-y-2">
              {waiting.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <UserAvatar name={p.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.city} · {p.email}</p>
                  </div>
                  <Button size="sm" variant="soft" className="h-9" onClick={() => approve(p.id, p.name)}><Check />Setujui</Button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={<Check />} title="Semua pendaftar sudah ditinjau" />
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <SectionCard title="Mitra Teratas" description="Berdasarkan closing">
          <ol className="space-y-2">
            {top.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl px-1 py-1.5">
                <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold", i === 0 ? "bg-gradient-warm text-ink" : "bg-muted text-muted-foreground")}>{i + 1}</span>
                <UserAvatar name={p.name} className="size-8" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.city}</p>
                </div>
                <Badge variant={p.role === "aktif" ? "ink" : "brand"}>{p.role === "aktif" ? "Aktif" : "Referral"}</Badge>
                <span className="w-14 text-right text-sm font-bold num">{p.closing}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
        <SectionCard title="Komisi Dibayarkan" description="6 bulan terakhir" bodyClassName="pt-2"><CommissionChart /></SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <SectionCard title="Target KPI Program" description="Seluruh jaringan"><KpiTargets /></SectionCard>
        <SectionCard title="Pengumuman" href="/pengumuman"><AnnouncementList /></SectionCard>
      </div>
    </div>
  );
}
