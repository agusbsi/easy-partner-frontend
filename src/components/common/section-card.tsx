import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  action,
  href,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode;
  href?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("flex min-w-0 flex-col rounded-[20px] border border-border/70 bg-card shadow-xs", className)}>
      <header className="flex items-center justify-between gap-3 px-4 pt-4 lg:px-5 lg:pt-5">
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
        {href && !action && (
          <Link to={href} className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-brand hover:underline">
            Lihat semua <ChevronRight className="size-3.5" />
          </Link>
        )}
      </header>
      <div className={cn("flex-1 p-4 lg:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center">
      <div className="mb-2 grid size-10 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">{icon}</div>
      <p className="text-sm font-semibold">{title}</p>
      {text && <p className="mt-1 text-xs text-muted-foreground">{text}</p>}
    </div>
  );
}
