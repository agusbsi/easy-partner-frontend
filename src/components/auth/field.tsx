import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function Field({
  id,
  label,
  error,
  children,
  aside,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
  aside?: ReactNode | undefined;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-[13px] font-semibold">{label}</Label>
        {aside}
      </div>
      {children}
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
