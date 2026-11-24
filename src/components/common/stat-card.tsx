import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TONE = {
  brand: "bg-brand-soft text-brand",
  cyan: "bg-cyan-soft text-success",
  coral: "bg-coral-soft text-destructive",
  ink: "bg-ink text-ink-foreground",
  warning: "bg-warning-soft text-warning",
  muted: "bg-muted text-muted-foreground",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  delta,
  hint,
  className,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: keyof typeof TONE;
  delta?: number;
  hint?: string;
  className?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className={cn("group rounded-[20px] border border-border/70 bg-card p-4 shadow-xs transition-shadow hover:shadow-md", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl [&_svg]:size-[18px]", TONE[tone])}>
          <Icon strokeWidth={1.9} />
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold num",
              up ? "bg-success-soft text-success" : "bg-coral-soft text-destructive",
            )}
          >
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4 text-[22px] font-semibold leading-none tracking-tight num lg:text-2xl">{value}</div>
      <p className="mt-1.5 truncate text-[12.5px] font-medium text-foreground/80">{label}</p>
      <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
        {hint && <span className="truncate text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
