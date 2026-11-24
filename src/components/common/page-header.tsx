import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string | undefined;
  actions?: ReactNode | undefined;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex flex-col gap-3 lg:mb-7 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="hidden text-[22px] font-semibold tracking-tight lg:block">{title}</h1>
        {description && <p className="text-sm text-muted-foreground lg:mt-1">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
