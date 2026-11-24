import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Akses Ditolak — Easy Partner" },
      { name: "description", content: "Anda tidak memiliki izin untuk membuka halaman ini." },
      { property: "og:title", content: "Akses Ditolak — Easy Partner" },
      { property: "og:description", content: "Halaman ini khusus untuk peran tertentu." },
    ],
  }),
  component: Unauthorized,
});

function Unauthorized() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5 pt-safe pb-safe">
      <div className="max-w-sm text-center animate-rise">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-coral-soft text-destructive">
          <ShieldAlert className="size-8" />
        </div>
        <p className="mt-6 text-sm font-semibold text-destructive">Error 403</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Akses ditolak</h1>
        <p className="mt-2 text-sm text-muted-foreground">Halaman ini hanya bisa dibuka oleh peran tertentu. Hubungi admin bila Anda merasa ini keliru.</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="xl"><Link to="/dashboard">Ke dashboard</Link></Button>
          <Button asChild size="xl" variant="outline"><Link to="/login">Ganti akun</Link></Button>
        </div>
      </div>
    </div>
  );
}
