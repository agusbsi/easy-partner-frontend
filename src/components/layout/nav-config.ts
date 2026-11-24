import {
  CalendarDays,
  FolderOpen,
  Handshake,
  House,
  LayoutGrid,
  Megaphone,
  Share2,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/auth/types";

export interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
  desc: string;
  roles?: Role[];
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Utama",
    items: [
      { title: "Beranda", to: "/dashboard", icon: House, desc: "Ringkasan performa" },
      { title: "Aktivitas", to: "/aktivitas", icon: CalendarDays, desc: "Jadwal & kalender" },
      { title: "Pengumuman", to: "/pengumuman", icon: Megaphone, desc: "Info terbaru" },
    ],
  },
  {
    label: "Penjualan",
    items: [
      { title: "Prospek", to: "/prospek", icon: Users, desc: "Pipeline kantor notaris" },
      { title: "Kolaborasi", to: "/kolaborasi", icon: Handshake, desc: "Bantuan antar mitra" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { title: "Referral", to: "/referral", icon: Share2, desc: "Bagikan tautan" },
      { title: "Materi Promosi", to: "/materi", icon: FolderOpen, desc: "Brosur & presentasi" },
    ],
  },
  {
    label: "Keuangan",
    items: [{ title: "Komisi", to: "/komisi", icon: Wallet, desc: "Saldo & pencairan" }],
  },
  {
    label: "Administrasi",
    items: [
      { title: "Kelola Mitra", to: "/mitra", icon: ShieldCheck, desc: "Verifikasi & level mitra", roles: ["admin"] },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { title: "Profil & Akun", to: "/profil", icon: UserRound, desc: "Data diri & keamanan" },
      { title: "Status Akun", to: "/status-akun", icon: BadgeCheck, desc: "Verifikasi & level" },
    ],
  },
];

export const BOTTOM_NAV = [
  { title: "Beranda", to: "/dashboard", icon: House },
  { title: "Prospek", to: "/prospek", icon: Users },
  { title: "Aktivitas", to: "/aktivitas", icon: CalendarDays },
  { title: "Komisi", to: "/komisi", icon: Wallet },
  { title: "Menu", to: "/menu", icon: LayoutGrid },
] as const;

export function groupsForRole(role: Role | undefined) {
  return NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.roles || (role && i.roles.includes(role))),
  })).filter((g) => g.items.length > 0);
}

export function findNav(pathname: string) {
  for (const g of NAV_GROUPS) {
    for (const i of g.items) {
      if (pathname === i.to || pathname.startsWith(i.to + "/")) return { group: g, item: i };
    }
  }
  if (pathname.startsWith("/menu")) return { group: null, item: { title: "Menu", to: "/menu" } as NavItem };
  return null;
}
