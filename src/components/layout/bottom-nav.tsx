import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { BOTTOM_NAV } from "./nav-config";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const primary = BOTTOM_NAV.slice(0, 4).map((i) => i.to);
  const activeTo =
    primary.find((to) => pathname === to || pathname.startsWith(to + "/")) ?? "/menu";

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-3 z-40 mx-auto max-w-md rounded-[22px] border border-border/70 bg-card/90 shadow-lg backdrop-blur-xl lg:hidden"
      style={{ bottom: "calc(var(--bottom-nav-gap) + env(safe-area-inset-bottom))" }}
    >
      <ul className="grid h-[var(--bottom-nav-h)] grid-cols-5 px-1.5">
        {BOTTOM_NAV.map((item) => {
          const active = item.to === activeTo;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex h-full min-h-11 flex-col items-center justify-center gap-1"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition-all duration-200",
                    active ? "bg-brand-soft text-brand" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="size-[20px]" strokeWidth={active ? 2.3 : 1.9} />
                </span>
                <span className={cn("text-[10.5px] leading-none", active ? "font-semibold text-brand" : "font-medium text-muted-foreground")}>
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
