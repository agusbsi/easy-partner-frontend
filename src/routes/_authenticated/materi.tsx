import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Image, MessageSquareText, Presentation, Video, Table2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/materi")({
  head: () => ({
    meta: [
      { title: "Materi Promosi — Easy Partner" },
      { name: "description", content: "Brosur, deck presentasi, video demo, dan template pesan Easy Notaris." },
      { property: "og:title", content: "Materi Promosi — Easy Partner" },
      { property: "og:description", content: "Materi marketing resmi Easy Notaris untuk mitra." },
    ],
  }),
  component: MateriPage,
});

const ITEMS = [
  { title: "Deck Presentasi Easy Notaris 2026", type: "PPTX · 24 slide", icon: Presentation, tone: "bg-brand-soft text-brand", tag: "Terbaru" },
  { title: "Brosur Produk", type: "PDF · 2 halaman", icon: FileText, tone: "bg-coral-soft text-destructive" },
  { title: "Video Demo Fitur Akta Digital", type: "MP4 · 3 menit", icon: Video, tone: "bg-cyan-soft text-success", tag: "Populer" },
  { title: "Daftar Harga & Paket", type: "PDF · 1 halaman", icon: Table2, tone: "bg-warning-soft text-warning" },
  { title: "Konten Instagram (10 desain)", type: "PNG · ZIP", icon: Image, tone: "bg-muted text-foreground" },
  { title: "Template Pesan WhatsApp", type: "TXT · 6 template", icon: MessageSquareText, tone: "bg-brand-soft text-brand" },
];

function MateriPage() {
  return (
    <div>
      <PageHeader title="Materi Promosi" description="Materi resmi yang selalu diperbarui tim Easy Notaris." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 lg:gap-4">
        {ITEMS.map((m) => (
          <article key={m.title} className="group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md lg:flex-col lg:items-start lg:p-5">
            <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl [&_svg]:size-6", m.tone)}><m.icon /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold lg:whitespace-normal">{m.title}</p>
                {m.tag && <Badge variant="coral" className="hidden lg:inline-flex">{m.tag}</Badge>}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.type}</p>
            </div>
            <Button variant="outline" size="icon-lg" className="shrink-0 lg:w-full lg:px-4" aria-label={`Unduh ${m.title}`} onClick={() => toast.success("Unduhan dimulai", { description: m.title })}>
              <Download /><span className="hidden lg:inline">Unduh</span>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
