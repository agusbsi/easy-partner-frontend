import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsLeft, LifeBuoy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo, LogoMark } from "@/components/common/logo";
import { useAuth } from "@/lib/auth/use-auth";
import { cn } from "@/lib/utils";
import { groupsForRole } from "./nav-config";

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = groupsForRole(user?.role);

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={cn(
          "hidden h-full shrink-0 flex-col overflow-hidden rounded-[20px] bg-sidebar text-sidebar-foreground shadow-md transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-[248px]",
        )}
      >
        <div className={cn("flex h-16 items-center gap-2 px-4", collapsed && "justify-center px-0")}>
          <Link to="/dashboard" className="min-w-0">
            {collapsed ? <LogoMark /> : <Logo tone="light" />}
          </Link>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="ml-auto grid size-8 place-items-center rounded-lg text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Ciutkan sidebar"
            >
              <ChevronsLeft className="size-4" />
            </button>
          )}
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4 pt-1">
          {groups.map((g) => (
            <div key={g.label} className="mb-4">
              {!collapsed ? (
                <p className="mb-1 px-3 text-[11px] font-medium text-sidebar-muted">{g.label}</p>
              ) : (
                <div className="mx-auto mb-2 h-px w-6 bg-sidebar-border" />
              )}
              <ul className="space-y-0.5">
                {g.items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(item.to + "/");
                  const link = (
                    <Link
                      to={item.to}
                      className={cn(
                        "group flex h-9 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        collapsed && "mx-auto w-10 justify-center px-0",
                      )}
                    >
                      <item.icon
                        className={cn("size-[17px] shrink-0", active ? "text-sidebar-primary-foreground" : "text-sidebar-muted group-hover:text-sidebar-accent-foreground")}
                        strokeWidth={active ? 2.2 : 1.9}
                      />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  );
                  return (
                    <li key={item.to}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{item.title}</TooltipContent>
                        </Tooltip>
                      ) : (
                        link
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3">
          {collapsed ? (
            <button
              onClick={onToggle}
              className="mx-auto grid size-10 place-items-center rounded-xl text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Buka sidebar"
            >
              <ChevronsLeft className="size-4 rotate-180" />
            </button>
          ) : (
            <div className="rounded-2xl bg-sidebar-accent p-3.5">
              <span className="grid size-8 place-items-center rounded-lg bg-sidebar-primary/20 text-sidebar-primary">
                <LifeBuoy className="size-4" />
              </span>
              <p className="mt-2.5 text-[13px] font-semibold text-sidebar-accent-foreground">Butuh bantuan?</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-sidebar-muted">Tim Easy Notaris siap membantu setiap hari kerja.</p>
              <a
                href="https://wa.me/6281100000000"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex h-8 items-center rounded-lg bg-sidebar-primary px-3 text-xs font-semibold text-sidebar-primary-foreground hover:opacity-90"
              >
                Hubungi Support
              </a>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
