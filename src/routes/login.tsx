import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, ShieldCheck, Sparkles, UserRound, Crown } from "lucide-react";
import type { z } from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Field } from "@/components/auth/field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/auth/schemas";
import { DEMO_ACCOUNTS, isDemoVisible, login } from "@/lib/auth/mock-auth";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Masuk — Easy Partner" },
      { name: "description", content: "Masuk ke Easy Partner untuk mengelola prospek dan komisi mitra Easy Notaris." },
      { property: "og:title", content: "Masuk — Easy Partner" },
      { property: "og:description", content: "Masuk ke dashboard Mitra Easy Notaris." },
    ],
  }),
  component: LoginPage,
});

type Values = z.infer<typeof loginSchema>;
const DEMO_ICON = { referral: UserRound, aktif: Crown, admin: ShieldCheck } as const;

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const { register, handleSubmit, formState, setValue } = form;

  const onSubmit = handleSubmit(async (v) => {
    setError(null);
    try {
      const user = await login(v.email, v.password);
      if (user.status !== "active") {
        navigate({ to: "/status-akun", replace: true });
        return;
      }
      const target = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/dashboard";
      navigate({ to: target, replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal masuk.");
    }
  });

  return (
    <AuthLayout
      title="Selamat datang kembali"
      description="Masuk untuk melanjutkan pengelolaan prospek dan komisi Anda."
      footer={
        <>
          Belum menjadi mitra?{" "}
          <Link to="/register" className="font-semibold text-brand hover:underline">Daftar sebagai Mitra</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <div role="alert" className="rounded-xl border border-destructive/20 bg-coral-soft px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}
        <Field id="email" label="Email" error={formState.errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" inputMode="email" placeholder="nama@email.com" aria-invalid={!!formState.errors.email} {...register("email")} />
        </Field>
        <Field
          id="password"
          label="Password"
          error={formState.errors.password?.message}
          aside={<Link to="/lupa-password" className="text-xs font-semibold text-brand hover:underline">Lupa password?</Link>}
        >
          <PasswordInput id="password" autoComplete="current-password" placeholder="••••••••" aria-invalid={!!formState.errors.password} {...register("password")} />
        </Field>
        <Button type="submit" size="xl" className="w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
          Masuk
        </Button>
      </form>

      {isDemoVisible() && (
        <div className="mt-8 rounded-2xl border border-dashed bg-surface p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Sparkles className="size-3.5 text-brand" /> Akun demo (mode pengembangan)
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((d) => {
              const Icon = DEMO_ICON[d.role];
              return (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => {
                    setValue("email", d.email, { shouldValidate: true });
                    setValue("password", d.password, { shouldValidate: true });
                  }}
                  className="flex min-h-11 flex-col items-center gap-1 rounded-xl border bg-card px-2 py-2.5 text-center text-[11px] font-semibold transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon className="size-4" />
                  {d.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Klik salah satu untuk mengisi email & password, lalu tekan Masuk.</p>
        </div>
      )}
    </AuthLayout>
  );
}
