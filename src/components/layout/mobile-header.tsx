import { useRouterState } from "@tanstack/react-router";
import { LogoMark } from "@/components/common/logo";
import { UserAvatar } from "@/components/common/user-avatar";
import { useAuth } from "@/lib/auth/use-auth";
import { findNav } from "./nav-config";
import { NotificationsButton } from "./notifications";
import { UserMenu } from "./user-menu";

export function MobileHeader() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = findNav(pathname);
  const isHome = pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-30 bg-background/85 pt-safe backdrop-blur-xl lg:hidden">
      <div className="flex h-14 items-center gap-3 px-4">
        {isHome ? (
          <span className="flex items-center gap-2">
            <LogoMark className="size-8 rounded-[10px]" />
            <span className="text-[15px] font-semibold tracking-tight">Easy Partner</span>
          </span>
        ) : (
          <h1 className="min-w-0 truncate text-[17px] font-semibold tracking-tight">{nav?.item.title ?? "Easy Partner"}</h1>
        )}
        <div className="ml-auto flex items-center gap-1">
          <NotificationsButton className="size-11" />
          {user && (
            <UserMenu>
              <button aria-label="Menu akun" className="grid size-11 place-items-center rounded-full">
                <UserAvatar name={user.name} className="size-8" />
              </button>
            </UserMenu>
          )}
        </div>
      </div>
    </header>
  );
}
