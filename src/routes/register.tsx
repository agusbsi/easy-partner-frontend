import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { z } from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Field } from "@/components/auth/field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { registerSchema } from "@/lib/auth/schemas";
import { register as registerUser } from "@/lib/auth/mock-auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar Mitra — Easy Partner" },
      { name: "description", content: "Daftar gratis sebagai Mitra Referral Easy Notaris dan mulai dapatkan komisi." },
      { property: "og:title", content: "Daftar Mitra — Easy Partner" },
      { property: "og:description", content: "Gabung sebagai Mitra Referral Easy Notaris." },
    ],
  }),
  component: RegisterPage,
});

type Values = z.infer<typeof registerSchema>;

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, control, formState } = useForm<Values>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "", city: "", terms: false },
  });
  const e = formState.errors;

  const onSubmit = handleSubmit(async (v) => {
    setError(null);
    try {
      const user = await registerUser(v);
      navigate({ to: "/verifikasi", search: { email: user.email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal.");
    }
  });

  return (
    <AuthLayout
      title="Daftar sebagai Mitra"
      description="Mulai sebagai Mitra Referral. Anda bisa naik level menjadi Mitra Aktif setelah memenuhi target."
      footer={
        <>
          Sudah punya akun? <Link to="/login" className="font-semibold text-brand hover:underline">Masuk</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <div role="alert" className="rounded-xl border border-destructive/20 bg-coral-soft px-4 py-3 text-sm font-medium text-destructive">{error}</div>
        )}
        <Field id="name" label="Nama lengkap" error={e.name?.message}>
          <Input id="name" autoComplete="name" placeholder="Contoh: Rina Kartika" aria-invalid={!!e.name} {...register("name")} />
        </Field>
        <Field id="email" label="Email" error={e.email?.message}>
          <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="nama@email.com" aria-invalid={!!e.email} {...register("email")} />
        </Field>
        <Field id="phone" label="Nomor WhatsApp" error={e.phone?.message}>
          <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="081234567890" aria-invalid={!!e.phone} {...register("phone")} />
        </Field>
        <Field id="city" label="Kota / domisili" error={e.city?.message}>
          <Input id="city" autoComplete="address-level2" placeholder="Contoh: Bandung" aria-invalid={!!e.city} {...register("city")} />
        </Field>
        <Field id="password" label="Password" error={e.password?.message}>
          <PasswordInput id="password" autoComplete="new-password" placeholder="Minimal 8 karakter, huruf & angka" aria-invalid={!!e.password} {...register("password")} />
        </Field>
        <Field id="confirmPassword" label="Konfirmasi password" error={e.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" placeholder="Ulangi password" aria-invalid={!!e.confirmPassword} {...register("confirmPassword")} />
        </Field>
        <div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-3.5 text-sm leading-relaxed">
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} className="mt-0.5 size-5 rounded-md" aria-invalid={!!e.terms} />
              )}
            />
            <span className="text-muted-foreground">
              Saya menyetujui <span className="font-semibold text-foreground">Syarat & Ketentuan Mitra</span> serta{" "}
              <span className="font-semibold text-foreground">Kebijakan Privasi</span> Easy Notaris.
            </span>
          </label>
          {e.terms && <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">{e.terms.message}</p>}
        </div>
        <Button type="submit" size="xl" className="w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
          Buat akun mitra
        </Button>
      </form>
    </AuthLayout>
  );
}
