import { Bell, CalendarDays, Handshake, Wallet, Megaphone } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: 1, icon: Handshake, tone: "bg-brand-soft text-brand", title: "Permintaan bantuan baru", text: "Rina Kartika meminta bantuan presentasi.", time: "5 mnt", unread: true },
  { id: 2, icon: CalendarDays, tone: "bg-warning-soft text-warning", title: "Presentasi hari ini 13.30", text: "Notaris & PPAT Maya Anggraini, Cimahi.", time: "1 jam", unread: true },
  { id: 3, icon: Wallet, tone: "bg-cyan-soft text-success", title: "Komisi tersedia", text: "Rp2.400.000 siap dicairkan.", time: "Kemarin", unread: false },
  { id: 4, icon: Megaphone, tone: "bg-coral-soft text-destructive", title: "Bonus closing Desember", text: "Tambahan komisi 20% untuk paket Pro.", time: "2 hari", unread: false },
];

function List() {
  return (
    <ul className="divide-y">
      {ITEMS.map((n) => (
        <li key={n.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-full [&_svg]:size-4", n.tone)}>
            <n.icon />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">{n.title}</p>
              {n.unread && <span className="size-1.5 shrink-0 rounded-full bg-coral" />}
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.text}</p>
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
        </li>
      ))}
    </ul>
  );
}

export function NotificationsButton({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const trigger = (
    <Button variant="ghost" size="icon" className={cn("relative rounded-full", className)} aria-label="Notifikasi" onClick={isMobile ? () => setOpen(true) : undefined}>
      <Bell className="!size-[18px]" />
      <span className="absolute right-2 top-2 size-2 rounded-full bg-coral ring-2 ring-background" />
    </Button>
  );
  if (isMobile) {
    return (
      <>
        {trigger}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[85dvh]">
            <DrawerHeader className="px-4 text-left">
              <DrawerTitle>Notifikasi</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto pb-4">
              <List />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-96 overflow-hidden rounded-2xl p-0 shadow-lg">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifikasi</p>
          <button className="text-xs font-semibold text-brand hover:underline">Tandai dibaca</button>
        </div>
        <List />
      </PopoverContent>
    </Popover>
  );
}
