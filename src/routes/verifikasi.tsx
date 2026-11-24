import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { MOCK_VERIFICATION_CODE, isDemoVisible, verifyAccount } from "@/lib/auth/mock-auth";

export const Route = createFileRoute("/verifikasi")({
  validateSearch: (s: Record<string, unknown>): { email?: string } =>
    typeof s["email"] === "string" ? { email: s["email"] } : {},
  head: () => ({
    meta: [
      { title: "Verifikasi Akun — Easy Partner" },
      { name: "description", content: "Masukkan kode verifikasi untuk mengaktifkan akun mitra Easy Partner." },
      { property: "og:title", content: "Verifikasi Akun — Easy Partner" },
      { property: "og:description", content: "Aktifkan akun mitra Easy Notaris Anda." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await verifyAccount(email, code);
      toast.success("Akun berhasil diverifikasi. Selamat bergabung!");
      navigate({ to: "/dashboard", replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verifikasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verifikasi akun Anda"
      description={email ? `Kami telah mengirim 6 digit kode ke ${email} dan WhatsApp Anda.` : "Buka tautan verifikasi dari email pendaftaran Anda."}
      footer={<Link to="/login" className="font-semibold text-brand hover:underline">Kembali ke halaman masuk</Link>}
    >
      <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
        <MailCheck className="size-7" />
      </div>
      {email ? (
        <div className="space-y-5">
          <InputOTP maxLength={6} value={code} onChange={setCode} onComplete={() => undefined} containerClassName="justify-between">
            <InputOTPGroup className="w-full justify-between gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="h-14 w-full rounded-xl border text-lg font-bold first:rounded-xl last:rounded-xl" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
          <Button size="xl" className="w-full" disabled={code.length < 6 || loading} onClick={submit}>
            {loading && <Loader2 className="animate-spin" />} Verifikasi
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Tidak menerima kode?{" "}
            <button className="font-semibold text-brand hover:underline" onClick={() => toast.success("Kode baru telah dikirim.")}>Kirim ulang</button>
          </p>
          {isDemoVisible() && (
            <p className="rounded-xl bg-surface px-3 py-2 text-center text-xs text-muted-foreground">
              Mode pengembangan: gunakan kode <span className="font-bold text-foreground num">{MOCK_VERIFICATION_CODE}</span>
            </p>
          )}
        </div>
      ) : (
        <Button asChild size="xl" className="w-full"><Link to="/register">Daftar akun baru</Link></Button>
      )}
    </AuthLayout>
  );
}
