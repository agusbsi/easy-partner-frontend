import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/user-avatar";
import { useAuth } from "@/lib/auth/use-auth";
import { ROLE_LABEL } from "@/lib/auth/types";
import { findNav } from "./nav-config";
import { CommandSearch } from "./command-search";
import { NotificationsButton } from "./notifications";
import { UserMenu } from "./user-menu";

export function Topbar() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = findNav(pathname);

  return (
    <header className="z-30 hidden h-14 shrink-0 items-center gap-4 rounded-[20px] border border-border/70 bg-card px-4 shadow-xs lg:flex">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 pl-1 text-[13px]">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Easy Partner</Link>
        {nav?.group && (
          <>
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            <span className="text-muted-foreground">{nav.group.label}</span>
          </>
        )}
        {nav && (
          <>
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            <span className="truncate font-semibold">{nav.item.title}</span>
          </>
        )}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <CommandSearch />
        {user?.role !== "admin" && (
          <Button asChild size="sm" variant="brand" className="h-9 rounded-xl">
            <Link to="/prospek" search={{ tambah: true }}><Plus />Prospek</Link>
          </Button>
        )}
        <NotificationsButton />
        {user && (
          <UserMenu>
            <button className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-muted" aria-label="Menu akun">
              <UserAvatar name={user.name} className="size-8" />
              <span className="hidden min-w-0 text-left xl:block">
                <span className="block max-w-36 truncate text-[13px] font-semibold leading-tight">{user.name}</span>
                <span className="block text-[11px] leading-tight text-muted-foreground">{ROLE_LABEL[user.role]}</span>
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
          </UserMenu>
        )}
      </div>
    </header>
  );
}
