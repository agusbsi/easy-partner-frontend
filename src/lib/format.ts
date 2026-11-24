import { format, formatDistanceToNowStrict } from "date-fns";
import { id } from "date-fns/locale";

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const rupiahShort = (n: number) => {
  if (n >= 1_000_000_000) return `Rp${(n / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1).replace(".", ",").replace(",0", "")} jt`;
  if (n >= 1_000) return `Rp${Math.round(n / 1_000)} rb`;
  return `Rp${n}`;
};

export const fmtDate = (d: Date | string, pattern = "d MMM yyyy") =>
  format(typeof d === "string" ? new Date(d) : d, pattern, { locale: id });

export const fromNow = (d: Date | string) =>
  formatDistanceToNowStrict(typeof d === "string" ? new Date(d) : d, { locale: id, addSuffix: true });

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
