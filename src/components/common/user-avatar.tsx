import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const TONES = ["bg-brand-soft text-brand", "bg-cyan-soft text-success", "bg-coral-soft text-destructive", "bg-ink text-ink-foreground"];

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  const tone = TONES[name.length % TONES.length];
  return (
    <span
      className={cn(
        "inline-grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ring-2 ring-card",
        tone,
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
