import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock, Handshake, MapPin } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ResponsiveSheet } from "@/components/common/responsive-sheet";
import { EmptyState } from "@/components/common/section-card";
import { Field } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACTIVITY_LABEL, type Activity, type ActivityType } from "@/lib/mock-data";
import { activityStore, prospectStore, useStore } from "@/lib/store";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/aktivitas")({
  validateSearch: (s: Record<string, unknown>): { jadwal?: boolean } =>
    s["jadwal"] === true || s["jadwal"] === "true" ? { jadwal: true } : {},
  head: () => ({
    meta: [
      { title: "Aktivitas — Easy Partner" },
      { name: "description", content: "Kalender presentasi, follow-up, dan trial prospek Anda." },
      { property: "og:title", content: "Aktivitas — Easy Partner" },
      { property: "og:description", content: "Kalender aktivitas mitra Easy Notaris." },
    ],
  }),
  component: AktivitasPage,
});

const TYPE_STYLE: Record<ActivityType, { dot: string; badge: "brand" | "warning" | "cyan" | "muted"; bar: string }> = {
  presentasi: { dot: "bg-warning", badge: "warning", bar: "border-l-warning" },
  follow_up: { dot: "bg-brand", badge: "brand", bar: "border-l-brand" },
  trial: { dot: "bg-cyan", badge: "cyan", bar: "border-l-cyan" },
  meeting: { dot: "bg-ink", badge: "muted", bar: "border-l-ink" },
};
const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function AktivitasPage() {
  const { jadwal } = Route.useSearch();
  const navigate = useNavigate({ from: "/aktivitas" });
  const activities = useStore(activityStore);
  const [month, setMonth] = useState(new Date());
  const [day, setDay] = useState(new Date());
  const setOpen = (o: boolean) => navigate({ search: o ? { jadwal: true } : {}, replace: true });

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }) }),
    [month],
  );
  const strip = useMemo(() => eachDayOfInterval({ start: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 0), end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 20) }), []);
  const on = (d: Date) => activities.filter((a) => isSameDay(new Date(a.start), d)).sort((a, b) => a.start.localeCompare(b.start));
  const dayItems = on(day);
  const upcoming = activities.filter((a) => new Date(a.start) >= new Date()).length;

  return (
    <div>
      <PageHeader
        title="Aktivitas"
        description={`${upcoming} aktivitas mendatang`}
        actions={<Button variant="brand" onClick={() => setOpen(true)} className="hidden lg:inline-flex"><CalendarPlus />Jadwalkan</Button>}
      />

      {/* Mobile: week strip */}
      <div className="lg:hidden">
        <div className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
          {strip.map((d) => {
            const sel = isSameDay(d, day);
            const has = on(d).length > 0;
            return (
              <button key={d.toISOString()} onClick={() => setDay(d)} className={cn("flex h-[68px] w-12 shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-2xl border transition-colors", sel ? "border-primary bg-primary text-primary-foreground" : "bg-card", isToday(d) && !sel && "border-brand")}>
                <span className={cn("text-[10px] font-semibold uppercase", sel ? "opacity-70" : "text-muted-foreground")}>{fmtDate(d, "EEE")}</span>
                <span className="text-base font-bold num">{fmtDate(d, "d")}</span>
                <span className={cn("size-1 rounded-full", has ? (sel ? "bg-cyan" : "bg-brand") : "bg-transparent")} />
              </button>
            );
          })}
        </div>
        <p className="mb-3 mt-5 text-sm font-semibold">{isToday(day) ? "Hari ini" : fmtDate(day, "EEEE, d MMMM")}</p>
        <Agenda items={dayItems} />
        <Button variant="brand" size="xl" className="mt-5 w-full" onClick={() => setOpen(true)}><CalendarPlus />Jadwalkan Aktivitas</Button>
      </div>

      {/* Desktop: calendar + agenda */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <h2 className="text-base font-semibold">{fmtDate(month, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => { setMonth(new Date()); setDay(new Date()); }}>Hari ini</Button>
              <Button size="icon-sm" variant="ghost" onClick={() => setMonth((m) => subMonths(m, 1))} aria-label="Bulan sebelumnya"><ChevronLeft /></Button>
              <Button size="icon-sm" variant="ghost" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Bulan berikutnya"><ChevronRight /></Button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {WEEKDAYS.map((w) => <div key={w} className="py-2.5">{w}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {days.map((d, i) => {
              const items = on(d);
              const sel = isSameDay(d, day);
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setDay(d)}
                  className={cn(
                    "flex min-h-28 flex-col gap-1 border-b border-r p-1.5 text-left transition-colors hover:bg-surface/70",
                    (i + 1) % 7 === 0 && "border-r-0",
                    !isSameMonth(d, month) && "bg-surface/40 text-muted-foreground/60",
                    sel && "bg-brand-soft/60 hover:bg-brand-soft/60",
                  )}
                >
                  <span className={cn("grid size-7 place-items-center rounded-full text-xs font-semibold num", isToday(d) && "bg-brand text-brand-foreground")}>{fmtDate(d, "d")}</span>
                  {items.slice(0, 3).map((a) => (
                    <span key={a.id} className="flex items-center gap-1.5 truncate rounded-md bg-card px-1.5 py-0.5 text-[11px] font-medium shadow-xs ring-1 ring-border">
                      <span className={cn("size-1.5 shrink-0 rounded-full", TYPE_STYLE[a.type].dot)} />
                      <span className="truncate"><span className="num text-muted-foreground">{fmtDate(a.start, "HH.mm")}</span> {a.office.replace(/^(Kantor Notaris|Notaris & PPAT|Notaris)\s/, "")}</span>
                    </span>
                  ))}
                  {items.length > 3 && <span className="px-1.5 text-[10px] font-semibold text-muted-foreground">+{items.length - 3} lagi</span>}
                </button>
              );
            })}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-xs">
            <p className="text-xs font-semibold text-muted-foreground">{isToday(day) ? "Hari ini" : "Agenda"}</p>
            <h3 className="text-lg font-bold">{fmtDate(day, "EEEE, d MMMM")}</h3>
            <div className="mt-4"><Agenda items={dayItems} /></div>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-xs">
            <p className="mb-3 text-sm font-semibold">Keterangan</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(Object.keys(ACTIVITY_LABEL) as ActivityType[]).map((t) => (
                <span key={t} className="flex items-center gap-2"><span className={cn("size-2.5 rounded-full", TYPE_STYLE[t].dot)} />{ACTIVITY_LABEL[t]}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <ResponsiveSheet open={!!jadwal} onOpenChange={setOpen} title="Jadwalkan Aktivitas" description="Presentasi, follow-up, atau trial dengan prospek.">
        <ScheduleForm defaultDate={day} onDone={() => setOpen(false)} />
      </ResponsiveSheet>
    </div>
  );
}

function Agenda({ items }: { items: Activity[] }) {
  if (!items.length) return <EmptyState icon={<CalendarPlus />} title="Tidak ada aktivitas" text="Hari ini masih kosong." />;
  return (
    <ul className="space-y-2.5">
      {items.map((a) => (
        <li key={a.id} className={cn("rounded-xl border border-l-4 bg-card p-3.5", TYPE_STYLE[a.type].bar)}>
          <div className="flex items-center justify-between gap-2">
            <Badge variant={TYPE_STYLE[a.type].badge}>{ACTIVITY_LABEL[a.type]}</Badge>
            <span className="flex items-center gap-1 text-xs font-semibold num"><Clock className="size-3.5" />{fmtDate(a.start, "HH.mm")} · {a.durationMin} mnt</span>
          </div>
          <p className="mt-2 text-sm font-semibold">{a.title}</p>
          <p className="truncate text-xs text-muted-foreground">{a.office}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{a.mode}</span>
            {a.withPartner && <span className="flex items-center gap-1 font-semibold text-brand"><Handshake className="size-3" />{a.withPartner}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

const schema = z.object({
  type: z.enum(["presentasi", "follow_up", "trial", "meeting"]),
  office: z.string().min(1, "Pilih prospek"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  time: z.string().min(1, "Jam wajib diisi"),
  mode: z.string().trim().min(2, "Lokasi / media wajib diisi").max(80),
});

function ScheduleForm({ defaultDate, onDone }: { defaultDate: Date; onDone: () => void }) {
  const prospects = useStore(prospectStore);
  const { register, handleSubmit, control, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { type: "presentasi", office: "", date: fmtDate(defaultDate, "yyyy-MM-dd"), time: "10:00", mode: "Online · Zoom" },
  });
  const e = formState.errors;
  const onSubmit = handleSubmit((v) => {
    const start = new Date(`${v.date}T${v.time}`);
    activityStore.set((l) => [
      ...l,
      { id: `a-${Date.now()}`, type: v.type, title: `${ACTIVITY_LABEL[v.type]} Easy Notaris`, office: v.office, start: start.toISOString(), durationMin: 60, mode: v.mode },
    ]);
    toast.success("Aktivitas dijadwalkan", { description: `${fmtDate(start, "EEEE, d MMM · HH.mm")}` });
    onDone();
  });
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field id="type" label="Jenis aktivitas">
        <Controller control={control} name="type" render={({ field }) => (
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ACTIVITY_LABEL) as ActivityType[]).map((t) => (
              <button type="button" key={t} onClick={() => field.onChange(t)} className={cn("h-11 rounded-xl border text-sm font-semibold transition-colors", field.value === t ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
                {ACTIVITY_LABEL[t]}
              </button>
            ))}
          </div>
        )} />
      </Field>
      <Field id="office" label="Prospek" error={e.office?.message}>
        <Controller control={control} name="office" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="office"><SelectValue placeholder="Pilih kantor notaris" /></SelectTrigger>
            <SelectContent>{prospects.map((p) => <SelectItem key={p.id} value={p.office}>{p.office}</SelectItem>)}</SelectContent>
          </Select>
        )} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id="date" label="Tanggal" error={e.date?.message}><Input id="date" type="date" {...register("date")} /></Field>
        <Field id="time" label="Jam" error={e.time?.message}><Input id="time" type="time" {...register("time")} /></Field>
      </div>
      <Field id="mode" label="Lokasi / media" error={e.mode?.message}><Input id="mode" {...register("mode")} /></Field>
      <Button type="submit" size="xl" className="w-full">Simpan jadwal</Button>
    </form>
  );
}
