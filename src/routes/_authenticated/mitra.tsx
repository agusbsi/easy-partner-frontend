import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Crown, MoreHorizontal, Search, Ban, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { UserAvatar } from "@/components/common/user-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSession } from "@/lib/auth/mock-auth";
import { partnerStore, useStore } from "@/lib/store";
import type { Partner, PartnerStatus } from "@/lib/mock-data";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/mitra")({
  beforeLoad: () => {
    if (getSession()?.role !== "admin") throw redirect({ to: "/unauthorized" });
  },
  head: () => ({
    meta: [
      { title: "Kelola Mitra — Easy Partner" },
      { name: "description", content: "Verifikasi pendaftar, atur level, dan kelola status mitra Easy Notaris." },
      { property: "og:title", content: "Kelola Mitra — Easy Partner" },
      { property: "og:description", content: "Administrasi mitra Easy Notaris." },
    ],
  }),
  component: MitraPage,
});

const STATUS: Record<PartnerStatus, { label: string; variant: "cyan" | "warning" | "coral" }> = {
  aktif: { label: "Aktif", variant: "cyan" },
  menunggu: { label: "Menunggu", variant: "warning" },
  ditangguhkan: { label: "Ditangguhkan", variant: "coral" },
};

function update(id: string, patch: Partial<Partner>, msg: string) {
  partnerStore.set((l) => l.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  toast.success(msg);
}

function Actions({ p }: { p: Partner }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="size-11 lg:size-9" aria-label={`Aksi untuk ${p.name}`}><MoreHorizontal /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl">
        {p.status === "menunggu" && <DropdownMenuItem onSelect={() => update(p.id, { status: "aktif" }, `${p.name} disetujui`)}><Check className="mr-2 size-4" />Setujui pendaftaran</DropdownMenuItem>}
        {p.role === "referral" && p.status === "aktif" && <DropdownMenuItem onSelect={() => update(p.id, { role: "aktif" }, `${p.name} kini Mitra Aktif`)}><Crown className="mr-2 size-4" />Naikkan ke Mitra Aktif</DropdownMenuItem>}
        {p.status !== "ditangguhkan" ? (
          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => update(p.id, { status: "ditangguhkan" }, `${p.name} ditangguhkan`)}><Ban className="mr-2 size-4" />Tangguhkan</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => update(p.id, { status: "aktif" }, `${p.name} diaktifkan kembali`)}><RotateCcw className="mr-2 size-4" />Aktifkan kembali</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MitraPage() {
  const partners = useStore(partnerStore);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<PartnerStatus | "semua">("semua");
  const list = partners.filter((p) => (status === "semua" || p.status === status) && `${p.name} ${p.email} ${p.city}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Kelola Mitra" description={`${partners.length} mitra terdaftar`} />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, email, kota…" className="pl-10" />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {(["semua", "menunggu", "aktif", "ditangguhkan"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={cn("h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-colors", status === s ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
              {s === "semua" ? "Semua" : STATUS[s].label} <span className="opacity-60 num">{s === "semua" ? partners.length : partners.filter((p) => p.status === s).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 lg:hidden">
        {list.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-xs">
            <UserAvatar name={p.name} className="size-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">{p.city} · {p.closing} closing</p>
              <div className="mt-1.5 flex gap-1.5">
                <Badge variant={p.role === "aktif" ? "ink" : "brand"}>{p.role === "aktif" ? "Mitra Aktif" : "Mitra Referral"}</Badge>
                <Badge variant={STATUS[p.status].variant}>{STATUS[p.status].label}</Badge>
              </div>
            </div>
            <Actions p={p} />
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-xs lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/60 hover:bg-surface/60">
              <TableHead className="pl-5">Mitra</TableHead>
              <TableHead>Kota</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Prospek</TableHead>
              <TableHead className="text-right">Closing</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead className="pr-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="py-3 pl-5">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={p.name} className="size-8" />
                    <div><p className="font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{p.email}</p></div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.city}</TableCell>
                <TableCell><Badge variant={p.role === "aktif" ? "ink" : "brand"}>{p.role === "aktif" ? "Mitra Aktif" : "Mitra Referral"}</Badge></TableCell>
                <TableCell><Badge variant={STATUS[p.status].variant}>{STATUS[p.status].label}</Badge></TableCell>
                <TableCell className="text-right num">{p.prospects}</TableCell>
                <TableCell className="text-right font-semibold num">{p.closing}</TableCell>
                <TableCell className="text-muted-foreground">{fmtDate(p.joinedAt)}</TableCell>
                <TableCell className="pr-5 text-right"><Actions p={p} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
