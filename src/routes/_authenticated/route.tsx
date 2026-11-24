import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getSession } from "@/lib/auth/mock-auth";
import { useAuth } from "@/lib/auth/use-auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: ({ location }) => {
    const user = getSession();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    if (user.status !== "active") {
      throw redirect({ to: "/status-akun" });
    }
    return { user };
  },
  pendingComponent: ShellSkeleton,
  component: AppShell,
});

function ShellSkeleton() {
  return <div className="min-h-screen bg-background" />;
}

function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Desktop content scrolls inside its own panel; reset it on navigation.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    setCollapsed(localStorage.getItem("ep.sidebar") === "1");
  }, []);

  useEffect(() => {
    if (!user) navigate({ to: "/login", replace: true });
  }, [user, navigate]);

  const toggle = () =>
    setCollapsed((c) => {
      localStorage.setItem("ep.sidebar", c ? "0" : "1");
      return !c;
    });

  return (
    <div className="flex min-h-dvh w-full bg-background lg:h-dvh lg:gap-3 lg:overflow-hidden lg:bg-canvas lg:p-3">
      <AppSidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col lg:gap-3">
        <Topbar />
        <MobileHeader />
        <main
          ref={mainRef}
          className="flex-1 lg:overflow-y-auto lg:rounded-[20px] lg:border lg:border-border/70 lg:bg-background lg:shadow-xs"
        >
          <div className="mx-auto w-full max-w-[1360px] px-4 pb-bottom-nav pt-3 lg:px-7 lg:pb-10 lg:pt-6">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
