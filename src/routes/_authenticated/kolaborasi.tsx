import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, Handshake, Inbox, LifeBuoy, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ResponsiveSheet } from "@/components/common/responsive-sheet";
import { EmptyState } from "@/components/common/section-card";
import { UserAvatar } from "@/components/common/user-avatar";
import { HelpRequestCard } from "@/components/dashboard/widgets";
import { Field } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth/use-auth";
import { helpStore, partnerStore, prospectStore, useStore } from "@/lib/store";
import type { HelpRequest, HelpStatus } from "@/lib/mock-data";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/kolaborasi")({
  validateSearch: (s: Record<string, unknown>): { minta?: boolean } =>
    s["minta"] === true || s["minta"] === "true" ? { minta: true } : {},
  head: () => ({
    meta: [
      { title: "Kolaborasi — Easy Partner" },
      { name: "description", content: "Minta dan kelola bantuan presentasi antara Mitra Referral dan Mitra Aktif." },
      { property: "og:title", content: "Kolaborasi — Easy Partner" },
      { property: "og:description", content: "Kolaborasi antar mitra Easy Notaris." },
    ],
  }),
  component: KolaborasiPage,
});

const STATUS_META: Record<HelpStatus, { label: string; variant: "warning" | "cyan" | "muted" | "coral" }> = {
  menunggu: { label: "Menunggu", variant: "warning" },
  berjalan: { label: "Berjalan", variant: "cyan" },
  selesai: { label: "Selesai", variant: "muted" },
  ditolak: { label: "Ditolak", variant: "coral" },
};

function KolaborasiPage() {
  const { user } = useAuth();
  const { minta } = Route.useSearch();
  const navigate = useNavigate({ from: "/kolaborasi" });
  const all = useStore(helpStore);
  const isAktif = user?.role === "aktif";
  const tabs: Array<{ key: HelpStatus; label: string; icon: typeof Inbox }> = [
    { key: "menunggu", label: isAktif ? "Masuk" : "Menunggu", icon: Inbox },
    { key: "berjalan", label: "Berjalan", icon: Clock },
    { key: "selesai", label: "Selesai", icon: CheckCircle2 },
  ];
  const [tab, setTab] = useState<HelpStatus>(isAktif ? "menunggu" : "berjalan");
  const items = all.filter((h) => h.status === tab);
  const setOpen = (o: boolean) => navigate({ search: o ? { minta: true } : {}, replace: true });

  return (
    <div>
      <PageHeader
        title="Kolaborasi"
        description={isAktif ? "Bantu Mitra Referral closing dan dapatkan komisi kolaborasi." : "Minta Mitra Aktif membantu presentasi ke prospek Anda."}
        actions={!isAktif && <Button variant="brand" onClick={() => setOpen(true)} className="hidden lg:inline-flex"><LifeBuoy />Minta Bantuan</Button>}
      />

      <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1 lg:inline-grid lg:w-auto">
        {tabs.map((t) => {
          const count = all.filter((h) => h.status === t.key).length;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-[13px] font-semibold transition-all lg:px-4 lg:text-sm", tab === t.key ? "bg-card shadow-sm" : "text-muted-foreground")}>
              <t.icon className="hidden size-4 sm:block" />{t.label}<span className="text-xs text-muted-foreground num">{count}</span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={<Handshake />} title="Belum ada data" text="Kolaborasi pada status ini akan muncul di sini." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 lg:gap-4">
          {items.map((h) => (isAktif && h.status === "menunggu" ? <HelpRequestCard key={h.id} h={h} /> : <RequestCard key={h.id} h={h} />))}
        </div>
      )}

      {!isAktif && (
        <Button variant="brand" size="xl" className="mt-5 w-full lg:hidden" onClick={() => setOpen(true)}><Plus />Minta Bantuan</Button>
      )}

      <ResponsiveSheet open={!!minta} onOpenChange={setOpen} title="Minta Bantuan" description="Mitra Aktif akan menerima permintaan Anda dan membalas maksimal 1×24 jam.">
        <HelpForm requester={user?.name ?? ""} city={user?.city ?? ""} onDone={() => { setOpen(false); setTab("menunggu"); }} />
      </ResponsiveSheet>
    </div>
  );
}

function RequestCard({ h }: { h: HelpRequest }) {
  const m = STATUS_META[h.status];
  return (
    <article className="rounded-2xl border bg-card p-4 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{h.office}</p>
          <p className="text-xs text-muted-foreground">{h.need}</p>
        </div>
        <Badge variant={m.variant}>{m.label}</Badge>
      </div>
      <p className="mt-3 line-clamp-2 rounded-xl bg-surface p-3 text-xs text-muted-foreground">{h.note}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5"><UserAvatar name={h.from} className="size-6 text-[9px] ring-0" />{h.from}</span>
        <span className="text-muted-foreground">{fmtDate(h.schedule, "d MMM · HH.mm")}</span>
      </div>
    </article>
  );
}

const schema = z.object({
  office: z.string().min(1, "Pilih prospek"),
  partner: z.string().min(1, "Pilih Mitra Aktif"),
  need: z.string().min(1, "Pilih jenis bantuan"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  note: z.string().trim().min(10, "Jelaskan kebutuhan minimal 10 karakter").max(500),
});

function HelpForm({ requester, city, onDone }: { requester: string; city: string; onDone: () => void }) {
  const prospects = useStore(prospectStore);
  const partners = useStore(partnerStore).filter((p) => p.role === "aktif");
  const { register, handleSubmit, control, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { office: "", partner: "", need: "Presentasi produk", date: "", note: "" },
  });
  const e = formState.errors;
  const onSubmit = handleSubmit((v) => {
    helpStore.set((l) => [
      { id: `h-${Date.now()}`, from: requester, fromCity: city, office: v.office, need: v.need, schedule: new Date(v.date).toISOString(), note: v.note, split: "50 : 50", status: "menunggu" },
      ...l,
    ]);
    toast.success("Permintaan bantuan terkirim", { description: `Ke ${v.partner}` });
    onDone();
  });
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field id="office" label="Prospek" error={e.office?.message}>
        <Controller control={control} name="office" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="office"><SelectValue placeholder="Pilih kantor notaris" /></SelectTrigger>
            <SelectContent>{prospects.filter((p) => p.stage !== "closing" && p.stage !== "batal").map((p) => <SelectItem key={p.id} value={p.office}>{p.office}</SelectItem>)}</SelectContent>
          </Select>
        )} />
      </Field>
      <Field id="partner" label="Mitra Aktif" error={e.partner?.message}>
        <Controller control={control} name="partner" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="partner"><SelectValue placeholder="Pilih mitra" /></SelectTrigger>
            <SelectContent>{partners.map((p) => <SelectItem key={p.id} value={p.name}>{p.name} · {p.city}</SelectItem>)}</SelectContent>
          </Select>
        )} />
      </Field>
      <Field id="need" label="Jenis bantuan" error={e.need?.message}>
        <Controller control={control} name="need" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="need"><SelectValue /></SelectTrigger>
            <SelectContent>{["Presentasi produk", "Demo fitur teknis", "Negosiasi paket", "Pendampingan trial"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
          </Select>
        )} />
      </Field>
      <Field id="date" label="Usulan jadwal" error={e.date?.message}><Input id="date" type="datetime-local" {...register("date")} /></Field>
      <Field id="note" label="Catatan untuk Mitra Aktif" error={e.note?.message}><Textarea id="note" placeholder="Ceritakan kebutuhan prospek…" {...register("note")} /></Field>
      <Button type="submit" size="xl" className="w-full">Kirim permintaan</Button>
    </form>
  );
}
