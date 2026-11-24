import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { KeyRound, Loader2, MailCheck } from "lucide-react";
import type { z } from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Field } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotSchema } from "@/lib/auth/schemas";
import { isDemoVisible, requestPasswordReset } from "@/lib/auth/mock-auth";

export const Route = createFileRoute("/lupa-password")({
  head: () => ({
    meta: [
      { title: "Lupa Password — Easy Partner" },
      { name: "description", content: "Atur ulang password akun mitra Easy Partner Anda." },
      { property: "og:title", content: "Lupa Password — Easy Partner" },
      { property: "og:description", content: "Kirim tautan reset password ke email Anda." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState<{ email: string; token: string } | null>(null);
  const { register, handleSubmit, formState } = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (v) => {
    const { token } = await requestPasswordReset(v.email);
    setSent({ email: v.email, token });
  });

  if (sent) {
    return (
      <AuthLayout title="Cek email Anda" description={`Jika ${sent.email} terdaftar, kami telah mengirim tautan untuk mengatur ulang password.`}
        footer={<Link to="/login" className="font-semibold text-brand hover:underline">Kembali ke halaman masuk</Link>}>
        <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-cyan-soft text-success"><MailCheck className="size-7" /></div>
        {isDemoVisible() && (
          <Button asChild variant="outline" size="xl" className="w-full">
            <Link to="/reset-password" search={{ token: sent.token }}>Buka tautan reset (demo)</Link>
          </Button>
        )}
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Lupa password?"
      description="Masukkan email terdaftar. Kami akan mengirimkan tautan untuk membuat password baru."
      footer={<Link to="/login" className="font-semibold text-brand hover:underline">Kembali ke halaman masuk</Link>}
    >
      <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand"><KeyRound className="size-7" /></div>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field id="email" label="Email" error={formState.errors.email?.message}>
          <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="nama@email.com" {...register("email")} />
        </Field>
        <Button type="submit" size="xl" className="w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <Loader2 className="animate-spin" />} Kirim tautan reset
        </Button>
      </form>
    </AuthLayout>
  );
}
