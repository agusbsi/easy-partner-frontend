import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { groupsForRole } from "@/components/layout/nav-config";
import { useAuth } from "@/lib/auth/use-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Easy Partner" },
      { name: "description", content: "Semua fitur Easy Partner dalam satu layar." },
      { property: "og:title", content: "Menu — Easy Partner" },
      { property: "og:description", content: "Menu aplikasi mitra Easy Notaris." },
    ],
  }),
  component: MenuPage,
});

const TONES = ["bg-brand-soft text-brand", "bg-cyan-soft text-success", "bg-coral-soft text-destructive", "bg-warning-soft text-warning", "bg-muted text-foreground"];

function MenuPage() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const groups = groupsForRole(user?.role)
    .map((g) => ({ ...g, items: g.items.filter((i) => `${i.title} ${i.desc}`.toLowerCase().includes(q.toLowerCase())) }))
    .filter((g) => g.items.length);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari menu…" className="h-12 rounded-2xl bg-card pl-10" />
      </div>

      {groups.map((g, gi) => (
        <section key={g.label}>
          <h2 className="mb-2.5 px-1 text-[13px] font-semibold text-muted-foreground">{g.label}</h2>
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 rounded-[22px] border border-border/70 bg-card p-4 shadow-xs sm:grid-cols-5">
            {g.items.map((i, ii) => (
              <Link key={i.to} to={i.to} className="flex flex-col items-center gap-2 text-center active:scale-95 transition-transform">
                <span className={cn("grid size-12 place-items-center rounded-2xl [&_svg]:size-[22px]", TONES[(gi + ii) % TONES.length])}>
                  <i.icon />
                </span>
                <span className="text-[11.5px] font-medium leading-tight">{i.title}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <p className="text-center text-[11px] text-muted-foreground">Easy Partner v1.0 · Easy Notaris</p>
    </div>
  );
}
