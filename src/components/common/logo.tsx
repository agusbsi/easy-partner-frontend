import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-brand shadow-glow",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-[60%]" fill="none">
        <rect x="5" y="4.5" width="12" height="3" rx="1.5" fill="currentColor" className="text-brand-foreground" />
        <rect x="5" y="10.5" width="9" height="3" rx="1.5" fill="currentColor" className="text-brand-foreground" />
        <rect x="5" y="16.5" width="12" height="3" rx="1.5" fill="currentColor" className="text-brand-foreground" />
        <circle cx="18.5" cy="12" r="2" fill="currentColor" className="text-coral" />
      </svg>
    </span>
  );
}

export function Logo({ className, tone = "default", sub = true }: { className?: string; tone?: "default" | "light"; sub?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex min-w-0 flex-col leading-none">
        <span className={cn("text-[15px] font-bold tracking-tight", tone === "light" ? "text-sidebar-accent-foreground" : "text-foreground")}>
          Easy Partner
        </span>
        {sub && (
          <span className={cn("mt-1 text-[11px] font-medium", tone === "light" ? "text-sidebar-muted" : "text-muted-foreground")}>
            by Easy Notaris
          </span>
        )}
      </span>
    </span>
  );
}
