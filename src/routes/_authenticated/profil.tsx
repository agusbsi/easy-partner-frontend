import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Landmark, LogOut, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { UserAvatar } from "@/components/common/user-avatar";
import { Field } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/use-auth";
import { logout } from "@/lib/auth/mock-auth";
import { phoneRegex } from "@/lib/auth/schemas";
import { ROLE_LABEL } from "@/lib/auth/types";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [
      { title: "Profil & Akun — Easy Partner" },
      { name: "description", content: "Kelola data diri, rekening, dan keamanan akun mitra." },
      { property: "og:title", content: "Profil & Akun — Easy Partner" },
      { property: "og:description", content: "Pengaturan akun mitra Easy Notaris." },
    ],
  }),
  component: ProfilPage,
});

const schema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter").max(100),
  phone: z.string().trim().regex(phoneRegex, "Nomor WhatsApp tidak valid"),
  city: z.string().trim().min(2, "Kota wajib diisi").max(80),
});

function ProfilPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "", city: user?.city ?? "" },
  });
  if (!user) return null;
  const e = formState.errors;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader title="Profil & Akun" />
      <section className="flex flex-col items-center gap-4 rounded-3xl border bg-card p-6 text-center shadow-xs sm:flex-row sm:text-left">
        <UserAvatar name={user.name} className="size-20 text-xl" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
            <Badge variant="brand">{ROLE_LABEL[user.role]}</Badge>
            <Badge variant="muted">{user.category}</Badge>
          </div>
          <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:gap-4">
            <span className="flex items-center justify-center gap-1 sm:justify-start"><Mail className="size-3.5" />{user.email}</span>
            <span className="flex items-center justify-center gap-1 sm:justify-start"><Phone className="size-3.5" />{user.phone}</span>
            <span className="flex items-center justify-center gap-1 sm:justify-start"><MapPin className="size-3.5" />{user.city}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Bergabung {fmtDate(user.joinedAt)}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <SectionCard title="Data diri">
          <form onSubmit={handleSubmit(() => { toast.success("Profil disimpan"); })} className="space-y-4" noValidate>
            <Field id="name" label="Nama lengkap" error={e.name?.message}><Input id="name" {...register("name")} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="phone" label="Nomor WhatsApp" error={e.phone?.message}><Input id="phone" type="tel" {...register("phone")} /></Field>
              <Field id="city" label="Kota / domisili" error={e.city?.message}><Input id="city" {...register("city")} /></Field>
            </div>
            <Field id="email" label="Email"><Input id="email" value={user.email} disabled /></Field>
            <Button type="submit" size="lg" className="w-full sm:w-auto">Simpan perubahan</Button>
          </form>
        </SectionCard>
        <div className="space-y-4">
          <SectionCard title="Rekening pencairan">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><Landmark className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Bank BCA</p><p className="text-xs text-muted-foreground">•••• 4821 · a.n. {user.name}</p></div>
              <Badge variant="cyan">Terverifikasi</Badge>
            </div>
          </SectionCard>
          <SectionCard title="Keamanan">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-cyan-soft text-success"><ShieldCheck className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Password</p><p className="text-xs text-muted-foreground">Ubah lewat tautan reset ke email</p></div>
              <Button size="sm" variant="outline" onClick={() => navigate({ to: "/lupa-password" })}>Ubah</Button>
            </div>
          </SectionCard>
          <Button
            variant="outline"
            size="xl"
            className="w-full text-destructive hover:text-destructive"
            onClick={async () => { await logout(); navigate({ to: "/login", replace: true }); }}
          >
            <LogOut />Keluar
          </Button>
        </div>
      </div>
    </div>
  );
}
