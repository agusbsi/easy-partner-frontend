import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { ANNOUNCEMENTS } from "@/lib/mock-data";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/pengumuman")({
  head: () => ({
    meta: [
      { title: "Pengumuman — Easy Partner" },
      { name: "description", content: "Program, info produk, dan jadwal terbaru untuk mitra Easy Notaris." },
      { property: "og:title", content: "Pengumuman — Easy Partner" },
      { property: "og:description", content: "Pengumuman resmi untuk mitra Easy Notaris." },
    ],
  }),
  component: PengumumanPage,
});

function PengumumanPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Pengumuman" description="Info resmi dari tim Easy Notaris." />
      <ol className="space-y-3">
        {ANNOUNCEMENTS.map((a, i) => (
          <li key={a.id} className="rounded-2xl border bg-card p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <span className={i === 0 ? "grid size-10 place-items-center rounded-xl bg-gradient-warm text-ink" : "grid size-10 place-items-center rounded-xl bg-surface text-muted-foreground"}>
                <Megaphone className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{fmtDate(a.date, "EEEE, d MMMM yyyy")}</p>
                <h2 className="font-semibold">{a.title}</h2>
              </div>
              <Badge variant={a.tag === "Program" ? "coral" : a.tag === "Produk" ? "brand" : "muted"}>{a.tag}</Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
