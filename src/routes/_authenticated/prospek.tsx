import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Columns3, LayoutList, MessageCircle, Phone, Plus, Search, CalendarClock, MapPin, Handshake } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ResponsiveSheet } from "@/components/common/responsive-sheet";
import { EmptyState } from "@/components/common/section-card";
import { ProspectForm } from "@/components/prospek/prospect-form";
import { StageBadge } from "@/components/prospek/stage-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STAGES, type Prospect, type Stage } from "@/lib/mock-data";
import { prospectStore, useStore } from "@/lib/store";
import { fmtDate, rupiah, rupiahShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/prospek")({
  validateSearch: (s: Record<string, unknown>): { tambah?: boolean } =>
    s["tambah"] === true || s["tambah"] === "true" ? { tambah: true } : {},
  head: () => ({
    meta: [
      { title: "Prospek — Easy Partner" },
      { name: "description", content: "Kelola pipeline prospek kantor notaris dari baru hingga closing." },
      { property: "og:title", content: "Prospek — Easy Partner" },
      { property: "og:description", content: "Pipeline prospek mitra Easy Notaris." },
    ],
  }),
  component: ProspekPage,
});

function ProspekPage() {
  const { tambah } = Route.useSearch();
  const navigate = useNavigate({ from: "/prospek" });
  const prospects = useStore(prospectStore);
  const [view, setView] = useState<"tabel" | "kanban">("tabel");
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<Stage | "semua">("semua");
  const [selected, setSelected] = useState<Prospect | null>(null);
  const addOpen = !!tambah;
  const setAddOpen = (o: boolean) => navigate({ search: o ? { tambah: true } : {}, replace: true });

  const filtered = useMemo(
    () =>
      prospects.filter(
        (p) =>
          (stage === "semua" || p.stage === stage) &&
          `${p.office} ${p.contact} ${p.city}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [prospects, q, stage],
  );

  const moveStage = (p: Prospect, s: Stage) => {
    prospectStore.set((l) => l.map((x) => (x.id === p.id ? { ...x, stage: s, updatedAt: new Date().toISOString() } : x)));
    setSelected({ ...p, stage: s });
    toast.success(`Status diperbarui: ${STAGES.find((x) => x.key === s)?.label}`);
  };

  return (
    <div>
      <PageHeader
        title="Prospek"
        description={`${prospects.length} kantor notaris dalam pipeline Anda`}
        actions={
          <>
            <div className="hidden rounded-lg border bg-card p-0.5 lg:flex">
              {([["tabel", LayoutList, "Tabel"], ["kanban", Columns3, "Kanban"]] as const).map(([k, Icon, l]) => (
                <button key={k} onClick={() => setView(k)} className={cn("flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors", view === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  <Icon className="size-3.5" />{l}
                </button>
              ))}
            </div>
            <Button variant="brand" onClick={() => setAddOpen(true)} className="hidden lg:inline-flex"><Plus />Tambah Prospek</Button>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kantor, notaris, kota…" className="pl-10" />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {([{ key: "semua", label: "Semua" }, ...STAGES] as const).map((s) => {
            const count = s.key === "semua" ? prospects.length : prospects.filter((p) => p.stage === s.key).length;
            return (
              <button
                key={s.key}
                onClick={() => setStage(s.key)}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors",
                  stage === s.key ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}<span className={cn("num", stage === s.key ? "opacity-70" : "opacity-60")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2.5 pb-16 lg:hidden">
        {filtered.length === 0 && <EmptyState icon={<Search />} title="Prospek tidak ditemukan" text="Coba kata kunci atau filter lain." />}
        {filtered.map((p) => (
          <button key={p.id} onClick={() => setSelected(p)} className="w-full rounded-2xl border bg-card p-4 text-left shadow-xs active:scale-[0.99] transition-transform">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold">{p.office}</p>
                <p className="truncate text-xs text-muted-foreground">{p.contact}</p>
              </div>
              <StageBadge stage={p.stage} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="size-3.5" />{p.city}</span>
              <span className="flex items-center gap-1"><CalendarClock className="size-3.5" />{fmtDate(p.nextAction, "d MMM, HH.mm")}</span>
              <span className="font-semibold text-foreground num">{rupiahShort(p.estimate)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        {view === "tabel" ? (
          <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-surface/60 hover:bg-surface/60">
                  <TableHead className="pl-5">Kantor Notaris</TableHead>
                  <TableHead>Kota</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead className="text-right">Nilai</TableHead>
                  <TableHead className="pr-5 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelected(p)}>
                    <TableCell className="py-3.5 pl-5">
                      <p className="font-semibold">{p.office}</p>
                      <p className="text-xs text-muted-foreground">{p.contact}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.city}</TableCell>
                    <TableCell><StageBadge stage={p.stage} /></TableCell>
                    <TableCell className="text-muted-foreground">{p.source}</TableCell>
                    <TableCell className="text-muted-foreground num">{fmtDate(p.nextAction, "d MMM, HH.mm")}</TableCell>
                    <TableCell className="text-right font-semibold num">{rupiah(p.estimate)}</TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button asChild size="icon-sm" variant="ghost" onClick={(e) => e.stopPropagation()} aria-label="WhatsApp">
                        <a href={`https://wa.me/62${p.phone.slice(1)}`} target="_blank" rel="noreferrer"><MessageCircle /></a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filtered.length === 0 && <div className="p-6"><EmptyState icon={<Search />} title="Prospek tidak ditemukan" /></div>}
          </div>
        ) : (
          <div className="no-scrollbar -mx-8 flex gap-4 overflow-x-auto px-8 pb-2">
            {STAGES.map((s) => {
              const col = filtered.filter((p) => p.stage === s.key);
              return (
                <div key={s.key} className="flex w-72 shrink-0 flex-col rounded-2xl bg-surface p-2.5">
                  <div className="flex items-center justify-between px-1.5 pb-2.5 pt-1">
                    <span className="flex items-center gap-2 text-sm font-semibold"><StageBadge stage={s.key} /></span>
                    <span className="text-xs font-semibold text-muted-foreground num">{col.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.map((p) => (
                      <button key={p.id} onClick={() => setSelected(p)} className="w-full rounded-xl border bg-card p-3 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <p className="truncate text-sm font-semibold">{p.office}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.city} · {p.source}</p>
                        <div className="mt-2.5 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground num">{fmtDate(p.nextAction, "d MMM")}</span>
                          {p.collaborator && <span className="flex items-center gap-1 font-semibold text-brand"><Handshake className="size-3" />Kolab</span>}
                          <span className="font-bold num">{rupiahShort(p.estimate)}</span>
                        </div>
                      </button>
                    ))}
                    {col.length === 0 && <p className="px-2 py-6 text-center text-xs text-muted-foreground">Kosong</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Button
        variant="brand"
        size="icon-lg"
        onClick={() => setAddOpen(true)}
        aria-label="Tambah prospek"
        className="fixed bottom-above-nav right-4 z-30 size-14 rounded-2xl shadow-glow lg:hidden [&_svg]:size-6"
      >
        <Plus />
      </Button>

      <ResponsiveSheet open={addOpen} onOpenChange={setAddOpen} title="Tambah Prospek" description="Catat kantor notaris yang tertarik dengan Easy Notaris.">
        <ProspectForm onDone={() => setAddOpen(false)} />
      </ResponsiveSheet>

      <ResponsiveSheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)} title={selected?.office ?? ""} description={selected?.contact}>
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Kota", selected.city],
                ["Sumber", selected.source],
                ["Nilai paket", rupiah(selected.estimate)],
                ["Follow-up", fmtDate(selected.nextAction, "d MMM yyyy, HH.mm")],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-surface p-3">
                  <p className="text-[11px] text-muted-foreground">{k}</p>
                  <p className="mt-0.5 font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Ubah status</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button key={s.key} onClick={() => moveStage(selected, s.key)} className={cn("h-10 rounded-full border px-4 text-xs font-semibold transition-colors", selected.stage === s.key ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="xl"><a href={`tel:${selected.phone}`}><Phone />Telepon</a></Button>
              <Button asChild variant="brand" size="xl"><a href={`https://wa.me/62${selected.phone.slice(1)}`} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></Button>
            </div>
          </div>
        )}
      </ResponsiveSheet>
    </div>
  );
}
