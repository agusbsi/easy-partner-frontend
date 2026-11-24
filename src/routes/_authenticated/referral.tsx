import { createFileRoute } from "@tanstack/react-router";
import { Copy, Link2, MessageCircle, MousePointerClick, Share2, Trophy, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/use-auth";

export const Route = createFileRoute("/_authenticated/referral")({
  head: () => ({
    meta: [
      { title: "Referral — Easy Partner" },
      { name: "description", content: "Bagikan kode dan tautan referral Easy Notaris ke kantor notaris." },
      { property: "og:title", content: "Referral — Easy Partner" },
      { property: "og:description", content: "Tautan referral mitra Easy Notaris." },
    ],
  }),
  component: ReferralPage,
});

function ReferralPage() {
  const { user } = useAuth();
  const code = user?.referralCode ?? "";
  const link = `https://easynotaris.id/r/${code}`;
  const message = `Halo, saya ingin merekomendasikan Easy Notaris — aplikasi manajemen kantor notaris & PPAT. Coba gratis 14 hari: ${link}`;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} disalin`);
    } catch {
      toast.error("Gagal menyalin");
    }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Easy Notaris", text: message, url: link }); } catch { /* cancelled */ }
    } else copy(link, "Tautan");
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader title="Referral" description="Bagikan tautan Anda. Setiap closing dari tautan ini tercatat otomatis." />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-ink p-5 text-ink-foreground shadow-lg lg:p-8">
        <div className="absolute inset-0 bg-mesh" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground/70">Kode referral Anda</p>
            <p className="mt-1 text-3xl font-extrabold tracking-[0.08em] lg:text-4xl">{code}</p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-card/15 bg-card/5 p-1.5 pl-3 backdrop-blur">
              <Link2 className="size-4 shrink-0 text-cyan" />
              <span className="min-w-0 flex-1 truncate text-sm">{link}</span>
              <Button size="sm" variant="glass" className="h-9" onClick={() => copy(link, "Tautan")}><Copy />Salin</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:flex">
            <Button asChild size="xl" variant="brand"><a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></Button>
            <Button size="xl" variant="glass" onClick={share}><Share2 />Bagikan</Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Klik tautan" value="284" icon={MousePointerClick} delta={14} hint="30 hari" />
        <StatCard label="Daftar trial" value="19" icon={UserPlus} tone="cyan" delta={9} hint="30 hari" />
        <StatCard label="Closing" value="6" icon={Trophy} tone="ink" delta={20} hint="30 hari" />
        <StatCard label="Konversi" value="31%" icon={Share2} tone="coral" hint="trial → closing" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <SectionCard title="Cara kerja referral">
          <ol className="space-y-4">
            {[
              ["Bagikan tautan", "Kirim ke notaris & PPAT melalui WhatsApp, email, atau media sosial."],
              ["Prospek mencoba gratis", "Mereka mendaftar trial 14 hari melalui tautan Anda."],
              ["Closing & komisi", "Saat berlangganan, komisi masuk otomatis ke saldo Anda."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">{i + 1}</span>
                <div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
              </li>
            ))}
          </ol>
        </SectionCard>
        <SectionCard title="Template pesan">
          <p className="rounded-xl bg-surface p-4 text-sm leading-relaxed text-muted-foreground">{message}</p>
          <Button variant="outline" size="lg" className="mt-3 w-full sm:w-auto" onClick={() => copy(message, "Pesan")}><Copy />Salin pesan</Button>
        </SectionCard>
      </div>
    </div>
  );
}
