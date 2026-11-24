import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { groupsForRole } from "./nav-config";
import { useAuth } from "@/lib/auth/use-auth";
import { useStore, prospectStore } from "@/lib/store";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const prospects = useStore(prospectStore);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-72 items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:border-input hover:text-foreground"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Cari menu atau prospek…</span>
        <kbd className="rounded border bg-muted px-1.5 font-sans text-[10px] font-semibold">⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik untuk mencari…" />
        <CommandList>
          <CommandEmpty>Tidak ada hasil.</CommandEmpty>
          {groupsForRole(user?.role).map((g) => (
            <CommandGroup key={g.label} heading={g.label}>
              {g.items.map((i) => (
                <CommandItem key={i.to} value={`${i.title} ${i.desc}`} onSelect={() => go(i.to)}>
                  <i.icon className="mr-2 size-4" />
                  {i.title}
                  <span className="ml-auto text-xs text-muted-foreground">{i.desc}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandGroup heading="Prospek">
            {prospects.slice(0, 8).map((p) => (
              <CommandItem key={p.id} value={`${p.office} ${p.contact} ${p.city}`} onSelect={() => go("/prospek")}>
                {p.office}
                <span className="ml-auto text-xs text-muted-foreground">{p.city}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
