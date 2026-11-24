import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Field } from "@/components/auth/field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { resetSchema } from "@/lib/auth/schemas";
import { resetPassword } from "@/lib/auth/mock-auth";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>): { token?: string } =>
    typeof s["token"] === "string" ? { token: s["token"] } : {},
  head: () => ({
    meta: [
      { title: "Reset Password — Easy Partner" },
      { name: "description", content: "Buat password baru untuk akun mitra Easy Partner." },
      { property: "og:title", content: "Reset Password — Easy Partner" },
      { property: "og:description", content: "Buat password baru akun mitra Anda." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (v) => {
    setError(null);
    try {
      await resetPassword(token ?? "", v.password);
      toast.success("Password berhasil diperbarui. Silakan masuk.");
      navigate({ to: "/login", replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memperbarui password.");
    }
  });

  return (
    <AuthLayout title="Buat password baru" description="Gunakan minimal 8 karakter dengan kombinasi huruf dan angka."
      footer={<Link to="/login" className="font-semibold text-brand hover:underline">Kembali ke halaman masuk</Link>}>
      <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand"><LockKeyhole className="size-7" /></div>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {(error || !token) && (
          <div role="alert" className="rounded-xl border border-destructive/20 bg-coral-soft px-4 py-3 text-sm font-medium text-destructive">
            {error ?? "Tautan reset tidak valid. Minta tautan baru dari halaman Lupa Password."}
          </div>
        )}
        <Field id="password" label="Password baru" error={formState.errors.password?.message}>
          <PasswordInput id="password" autoComplete="new-password" {...register("password")} />
        </Field>
        <Field id="confirmPassword" label="Konfirmasi password baru" error={formState.errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" {...register("confirmPassword")} />
        </Field>
        <Button type="submit" size="xl" className="w-full" disabled={formState.isSubmitting || !token}>
          {formState.isSubmitting && <Loader2 className="animate-spin" />} Simpan password
        </Button>
      </form>
    </AuthLayout>
  );
}
