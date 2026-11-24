import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, UserRound, BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/use-auth";
import { logout } from "@/lib/auth/mock-auth";
import { ROLE_LABEL } from "@/lib/auth/types";

export function UserMenu({ children, side = "bottom", align = "end" }: { children: ReactNode; side?: "bottom" | "top" | "right"; align?: "start" | "end" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-60 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-[11px] font-semibold text-brand">{ROLE_LABEL[user.role]}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profil"><UserRound className="mr-2 size-4" />Profil & Akun</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/status-akun"><BadgeCheck className="mr-2 size-4" />Status Akun</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={async () => {
            await logout();
            navigate({ to: "/login", replace: true });
          }}
        >
          <LogOut className="mr-2 size-4" />Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
