import { Link, linkOptions } from "@tanstack/react-router";
import { isSameDay } from "date-fns";
import {
  CalendarDays,
  CalendarPlus,
  FolderOpen,
  LayoutGrid,
  Megaphone,
  ShieldCheck,
  Users,
  Check,
  Clock,
  Handshake,
  LifeBuoy,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  UserPlus,
  Wallet,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { EmptyState } from "@/components/common/section-card";
import { ACTIVITY_LABEL, ANNOUNCEMENTS, RECENT_ACTIVITY, type HelpRequest } from "@/lib/mock-data";
import { activityStore, helpStore, prospectStore, useStore } from "@/lib/store";
import { fmtDate, fromNow, greeting } from "@/lib/format";
import { ROLE_LABEL, type User } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

export interface HeroMetric {
  label: string;
  value: string;
  hint?: string;
}

export function WelcomeHero({
  user,
  metric,
  stats,
  children,
}: {
  user: User;
  metric: HeroMetric;
  stats: { label: string; value: string }[];
  children?: React.ReactNode;
}) {
  const now = new Date();
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-gradient-ink p-5 text-ink-foreground shadow-lg lg:p-6">
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border border-card/10" />
      <div className="pointer-events-none absolute -right-6 -top-6 size-44 rounded-full border border-card/10" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-ink-foreground/60">{fmtDate(now, "EEEE, d MMMM yyyy")}</p>
            <h1 className="mt-1 truncate text-lg font-semibold tracking-tight lg:text-[22px]">
              {greeting(now)}, {user.name.split(" ")[0]}
            </h1>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row">
            <Badge variant="brand" className="bg-card/10 text-ink-foreground">{ROLE_LABEL[user.role]}</Badge>
            <Badge variant="coral" className="bg-coral/20 text-coral-soft">
              <Trophy className="size-3" /> {user.category}
            </Badge>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium text-ink-foreground/60">{metric.label}</p>
            <p className="mt-1 text-[32px] font-semibold leading-none tracking-tight num lg:text-[40px]">{metric.value}</p>
            {metric.hint && <p className="mt-2 text-xs font-medium text-cyan">{metric.hint}</p>}
          </div>
          {children}
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-card/10 rounded-2xl border border-card/10 bg-card/5 py-3 backdrop-blur">
          {stats.map((s) => (
            <div key={s.label} className="min-w-0 px-3 text-center lg:px-4 lg:text-left">
              <p className="text-base font-semibold tracking-tight num lg:text-lg">{s.value}</p>
              <p className="truncate text-[11px] text-ink-foreground/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const QA = [
  { label: "Tambah Prospek", icon: UserPlus, link: linkOptions({ to: "/prospek", search: { tambah: true } }) },
  { label: "Bagikan Referral", icon: Share2, link: linkOptions({ to: "/referral" }) },
  { label: "Minta Bantuan", icon: LifeBuoy, link: linkOptions({ to: "/kolaborasi", search: { minta: true } }) },
  { label: "Jadwalkan Presentasi", icon: CalendarPlus, link: linkOptions({ to: "/aktivitas", search: { jadwal: true } }) },
];

/** Desktop-only quick actions inside the hero card. */
export function QuickActions() {
  return (
    <div className="hidden shrink-0 grid-cols-2 gap-2 lg:grid">
      {QA.map((q) => (
        <Button key={q.label} asChild variant="glass" size="default" className="h-10 justify-start rounded-xl">
          <Link {...q.link}><q.icon />{q.label}</Link>
        </Button>
      ))}
    </div>
  );
}

const MENU_TONE = {
  brand: "bg-brand-soft text-brand",
  cyan: "bg-cyan-soft text-success",
  coral: "bg-coral-soft text-destructive",
  warning: "bg-warning-soft text-warning",
  ink: "bg-ink text-ink-foreground",
  muted: "bg-muted text-foreground",
  solid: "bg-gradient-brand text-brand-foreground shadow-glow",
} as const;

const PARTNER_MENU = [
  { label: "Tambah Prospek", icon: UserPlus, tone: "solid", link: linkOptions({ to: "/prospek", search: { tambah: true } }) },
  { label: "Prospek", icon: Users, tone: "brand", link: linkOptions({ to: "/prospek" }) },
  { label: "Aktivitas", icon: CalendarDays, tone: "warning", link: linkOptions({ to: "/aktivitas" }) },
  { label: "Kolaborasi", icon: Handshake, tone: "cyan", link: linkOptions({ to: "/kolaborasi" }) },
  { label: "Komisi", icon: Wallet, tone: "ink", link: linkOptions({ to: "/komisi" }) },
  { label: "Referral", icon: Share2, tone: "coral", link: linkOptions({ to: "/referral" }) },
  { label: "Materi", icon: FolderOpen, tone: "brand", link: linkOptions({ to: "/materi" }) },
  { label: "Lainnya", icon: LayoutGrid, tone: "muted", link: linkOptions({ to: "/menu" }) },
] as const;

const ADMIN_MENU = [
  { label: "Kelola Mitra", icon: ShieldCheck, tone: "solid", link: linkOptions({ to: "/mitra" }) },
  { label: "Validasi Komisi", icon: Wallet, tone: "ink", link: linkOptions({ to: "/komisi" }) },
  { label: "Prospek", icon: Users, tone: "brand", link: linkOptions({ to: "/prospek" }) },
  { label: "Aktivitas", icon: CalendarDays, tone: "warning", link: linkOptions({ to: "/aktivitas" }) },
  { label: "Kolaborasi", icon: Handshake, tone: "cyan", link: linkOptions({ to: "/kolaborasi" }) },
  { label: "Pengumuman", icon: Megaphone, tone: "coral", link: linkOptions({ to: "/pengumuman" }) },
  { label: "Materi", icon: FolderOpen, tone: "brand", link: linkOptions({ to: "/materi" }) },
  { label: "Lainnya", icon: LayoutGrid, tone: "muted", link: linkOptions({ to: "/menu" }) },
] as const;

/** App-style main menu: one card with an icon grid on mobile, individual tiles on desktop. */
export function MainMenu({ role }: { role: User["role"] }) {
  const items = role === "admin" ? ADMIN_MENU : PARTNER_MENU;
  return (
    <nav
      aria-label="Menu utama"
      className="grid grid-cols-4 gap-x-1 gap-y-4 rounded-[22px] border border-border/70 bg-card px-2 py-4 shadow-xs lg:grid-cols-8 lg:gap-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
    >
      {items.map((m) => (
        <Link
          key={m.label}
          {...m.link}
          className="group flex flex-col items-center gap-2 text-center transition-transform active:scale-95 lg:rounded-2xl lg:border lg:border-border/70 lg:bg-card lg:px-2 lg:py-4 lg:shadow-xs lg:transition-all lg:hover:-translate-y-0.5 lg:hover:shadow-md"
        >
          <span className={cn("grid size-12 place-items-center rounded-2xl [&_svg]:size-[22px]", MENU_TONE[m.tone])}>
            <m.icon strokeWidth={1.9} />
          </span>
          <span className="line-clamp-2 text-[11.5px] font-medium leading-tight lg:text-[12.5px]">{m.label}</span>
        </Link>
      ))}
    </nav>
  );
}

/** Stat cards: swipeable row on mobile, grid on desktop. */
export function StatRail({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 *:w-[46%] *:shrink-0 *:snap-start sm:*:w-[30%] lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 lg:*:w-auto">
      {children}
    </div>
  );
}

export function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between px-0.5">
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      {href && <Link to={href} className="text-xs font-semibold text-brand hover:underline">Lihat semua</Link>}
    </div>
  );
}

export function FollowUpToday() {
  const prospects = useStore(prospectStore);
  const today = prospects
    .filter((p) => isSameDay(new Date(p.nextAction), new Date()) && p.stage !== "closing" && p.stage !== "batal")
    .sort((a, b) => a.nextAction.localeCompare(b.nextAction));
  if (!today.length) return <EmptyState icon={<Check />} title="Semua follow-up selesai" text="Tidak ada jadwal follow-up hari ini." />;
  return (
    <ul className="-mx-1 space-y-1">
      {today.map((p) => (
        <li key={p.id} className="flex items-center gap-3 rounded-xl px-1 py-2 transition-colors hover:bg-muted/60">
          <div className="grid w-12 shrink-0 text-center">
            <span className="text-sm font-bold num">{fmtDate(p.nextAction, "HH.mm")}</span>
            <span className="text-[10px] text-muted-foreground">WIB</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{p.office}</p>
            <p className="truncate text-xs text-muted-foreground">{p.contact}</p>
          </div>
          <Button asChild size="icon-lg" variant="soft" className="size-11 shrink-0 rounded-full lg:size-9" aria-label="Hubungi via WhatsApp">
            <a href={`https://wa.me/62${p.phone.slice(1)}`} target="_blank" rel="noreferrer"><MessageCircle /></a>
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function PresentationSchedule({ limit = 4 }: { limit?: number }) {
  const items = useStore(activityStore).filter((a) => a.type === "presentasi" && new Date(a.start) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, limit);
  return (
    <ul className="space-y-3">
      {items.map((a) => (
        <li key={a.id} className="flex gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface text-center leading-none">
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">{fmtDate(a.start, "MMM")}</span>
            <span className="text-base font-bold num">{fmtDate(a.start, "d")}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{a.office}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <Clock className="size-3" /> {fmtDate(a.start, "HH.mm")} · <MapPin className="size-3" /> {a.mode}
            </p>
            {a.withPartner && (
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand"><Handshake className="size-3" /> bersama {a.withPartner}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CollaborationList({ status = "berjalan" as HelpRequest["status"] }) {
  const items = useStore(helpStore).filter((h) => h.status === status);
  if (!items.length) return <EmptyState icon={<Handshake />} title="Belum ada kolaborasi" text="Minta bantuan Mitra Aktif untuk presentasi." />;
  return (
    <ul className="space-y-2.5">
      {items.map((h) => (
        <li key={h.id} className="rounded-xl border bg-surface/50 p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-semibold">{h.office}</p>
            <Badge variant="cyan">Berjalan</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{h.need} · {fmtDate(h.schedule, "d MMM, HH.mm")}</p>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5"><UserAvatar name={h.from} className="size-5 text-[8px] ring-0" />{h.from}</span>
            <span className="font-semibold text-muted-foreground">Bagi hasil {h.split}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

const KIND_TONE = {
  prospek: "bg-brand-soft text-brand",
  trial: "bg-cyan-soft text-success",
  kolaborasi: "bg-warning-soft text-warning",
  komisi: "bg-cyan-soft text-success",
  closing: "bg-ink text-ink-foreground",
} as const;
const KIND_ICON = { prospek: UserPlus, trial: Sparkles, kolaborasi: Handshake, komisi: Wallet, closing: Trophy } as const;

export function RecentActivity() {
  return (
    <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-border">
      {RECENT_ACTIVITY.map((r) => {
        const Icon = KIND_ICON[r.kind];
        return (
          <li key={r.id} className="relative flex gap-3">
            <span className={cn("relative grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-card [&_svg]:size-3.5", KIND_TONE[r.kind])}>
              <Icon />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm"><span className="font-semibold">{r.text}</span></p>
              <p className="truncate text-xs text-muted-foreground">{r.target} · {fromNow(r.time)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function AnnouncementList({ limit = 3 }: { limit?: number }) {
  return (
    <ul className="space-y-3">
      {ANNOUNCEMENTS.slice(0, limit).map((a, i) => (
        <li key={a.id} className={cn("rounded-xl p-3.5", i === 0 ? "bg-gradient-warm text-ink" : "bg-surface")}>
          <div className="flex items-center justify-between gap-2">
            <Badge variant={i === 0 ? "ink" : "muted"}>{a.tag}</Badge>
            <span className={cn("text-[11px]", i === 0 ? "text-ink/70" : "text-muted-foreground")}>{fromNow(a.date)}</span>
          </div>
          <p className="mt-2 text-sm font-bold">{a.title}</p>
          <p className={cn("mt-1 line-clamp-2 text-xs", i === 0 ? "text-ink/80" : "text-muted-foreground")}>{a.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function HelpRequestCard({ h }: { h: HelpRequest }) {
  const act = (status: HelpRequest["status"]) => {
    helpStore.set((list) => list.map((x) => (x.id === h.id ? { ...x, status } : x)));
    if (status === "berjalan") toast.success(`Permintaan dari ${h.from} diterima`, { description: "Jadwal ditambahkan ke Aktivitas." });
    else toast(`Permintaan dari ${h.from} ditolak`);
  };
  return (
    <article className="flex flex-col rounded-2xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <UserAvatar name={h.from} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{h.from}</p>
          <p className="text-xs text-muted-foreground">Mitra Referral · {h.fromCity}</p>
        </div>
        <Badge variant="warning">Baru</Badge>
      </div>
      <div className="mt-3 rounded-xl bg-surface p-3">
        <p className="text-sm font-semibold">{h.need}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{h.office}</p>
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">“{h.note}”</p>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="size-3.5" />{fmtDate(h.schedule, "EEE, d MMM · HH.mm")}</span>
        <span className="font-semibold text-foreground">Bagi hasil {h.split}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" className="h-11 rounded-xl lg:h-10" onClick={() => act("ditolak")}><X />Tolak</Button>
        <Button variant="brand" className="h-11 rounded-xl lg:h-10" onClick={() => act("berjalan")}><Check />Terima</Button>
      </div>
    </article>
  );
}

export function CallLink({ phone }: { phone: string }) {
  return (
    <a href={`tel:${phone}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
      <Phone className="size-3" /> {phone}
    </a>
  );
}

export { ACTIVITY_LABEL };
