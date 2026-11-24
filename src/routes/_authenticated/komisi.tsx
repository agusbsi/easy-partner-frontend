import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownToLine, Banknote, CheckCircle2, Clock4, Landmark, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ResponsiveSheet } from "@/components/common/responsive-sheet";
import { SectionCard } from "@/components/common/section-card";
import { StatCard } from "@/components/common/stat-card";
import { CommissionChart } from "@/components/dashboard/charts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COMMISSIONS, type CommissionStatus } from "@/lib/mock-data";
import { fmtDate, rupiah, rupiahShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/komisi")({
  head: () => ({
    meta: [
      { title: "Komisi — Easy Partner" },
      { name: "description", content: "Saldo komisi, riwayat, dan pencairan komisi mitra Easy Notaris." },
      { property: "og:title", content: "Komisi — Easy Partner" },
      { property: "og:description", content: "Pantau dan cairkan komisi mitra Anda." },
    ],
  }),
  component: KomisiPage,
});

const STATUS: Record<CommissionStatus, { label: string; variant: "warning" | "cyan" | "muted" }> = {
  pending: { label: "Pending", variant: "warning" },
  tersedia: { label: "Tersedia", variant: "cyan" },
  dicairkan: { label: "Dicairkan", variant: "muted" },
};

function KomisiPage() {
  const [filter, setFilter] = useState<CommissionStatus | "semua">("semua");
  const [open, setOpen] = useState(false);
  const sum = (s: CommissionStatus) => COMMISSIONS.filter((c) => c.status === s).reduce((a, c) => a + c.amount, 0);
  const available = sum("tersedia");
  const list = COMMISSIONS.filter((c) => filter === "semua" || c.status === filter);

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader title="Komisi" description="Pencairan diproses setiap tanggal 5 dan 20." />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-ink p-5 text-ink-foreground shadow-lg lg:p-6">
          <div className="absolute inset-0 bg-mesh" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70"><Wallet className="size-4" />Komisi tersedia</p>
            <p className="mt-2 text-3xl font-bold tracking-tight num lg:text-4xl">{rupiah(available)}</p>
            <p className="mt-1 text-xs text-sidebar-foreground/70">BCA •••• 4821 · a.n. akun Anda</p>
            <Button variant="brand" size="xl" className="mt-5 w-full sm:w-auto" onClick={() => setOpen(true)}><ArrowDownToLine />Ajukan Pencairan</Button>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:gap-4">
          <StatCard label="Komisi Pending" value={rupiahShort(sum("pending"))} icon={Clock4} tone="warning" hint="menunggu validasi" />
          <StatCard label="Sudah Dicairkan" value={rupiahShort(sum("dicairkan"))} icon={CheckCircle2} tone="muted" hint="total" />
          <StatCard label="Komisi Bulan Ini" value={rupiahShort(7_200_000)} icon={Banknote} tone="cyan" delta={25} hint="vs bulan lalu" />
          <StatCard label="Dari Kolaborasi" value={rupiahShort(COMMISSIONS.filter((c) => c.type === "kolaborasi").reduce((a, c) => a + c.amount, 0))} icon={Landmark} tone="brand" hint="total" />
        </div>
      </div>

      <SectionCard title="Grafik Komisi" description="6 bulan terakhir" bodyClassName="pt-2"><CommissionChart /></SectionCard>

      <section>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[15px] font-semibold">Riwayat komisi</h2>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {(["semua", "pending", "tersedia", "dicairkan"] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={cn("h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold capitalize transition-colors", filter === s ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                {s === "semua" ? "Semua" : STATUS[s].label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 lg:hidden">
          {list.map((c) => (
            <div key={c.id} className="rounded-2xl border bg-card p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.office}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.plan}</p>
                </div>
                <p className="shrink-0 text-sm font-bold num">{rupiah(c.amount)}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{fmtDate(c.date)} · {c.type === "kolaborasi" ? "Kolaborasi" : "Mandiri"}</span>
                <Badge variant={STATUS[c.status].variant}>{STATUS[c.status].label}</Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-xs lg:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface/60 hover:bg-surface/60">
                <TableHead className="pl-5">ID</TableHead>
                <TableHead>Kantor Notaris</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pl-5 font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                  <TableCell className="py-3.5 font-semibold">{c.office}</TableCell>
                  <TableCell className="text-muted-foreground">{c.plan}</TableCell>
                  <TableCell><Badge variant={c.type === "kolaborasi" ? "brand" : "outline"}>{c.type === "kolaborasi" ? "Kolaborasi" : "Mandiri"}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(c.date)}</TableCell>
                  <TableCell><Badge variant={STATUS[c.status].variant}>{STATUS[c.status].label}</Badge></TableCell>
                  <TableCell className="pr-5 text-right font-bold num">{rupiah(c.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <ResponsiveSheet open={open} onOpenChange={setOpen} title="Ajukan Pencairan" description="Dana ditransfer pada jadwal pencairan berikutnya.">
        <div className="space-y-4">
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-xs text-muted-foreground">Jumlah pencairan</p>
            <p className="mt-1 text-2xl font-bold num">{rupiah(available)}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><Landmark className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Bank BCA</p>
              <p className="text-xs text-muted-foreground">•••• •••• 4821</p>
            </div>
            <Badge variant="cyan">Terverifikasi</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Potongan PPh 21 sesuai ketentuan akan dihitung otomatis pada bukti potong.</p>
          <Button size="xl" variant="brand" className="w-full" onClick={() => { setOpen(false); toast.success("Pengajuan pencairan terkirim", { description: "Akan diproses pada tanggal pencairan berikutnya." }); }}>
            Konfirmasi Pencairan
          </Button>
        </div>
      </ResponsiveSheet>
    </div>
  );
}
