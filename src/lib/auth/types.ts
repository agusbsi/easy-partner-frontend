export type Role = "referral" | "aktif" | "admin";
export type AccountStatus = "unverified" | "pending" | "active" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: Role;
  status: AccountStatus;
  category: string;
  referralCode: string;
  joinedAt: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  referral: "Mitra Referral",
  aktif: "Mitra Aktif",
  admin: "Administrator",
};

export const STATUS_LABEL: Record<AccountStatus, string> = {
  unverified: "Belum Diverifikasi",
  pending: "Menunggu Peninjauan",
  active: "Aktif",
  suspended: "Ditangguhkan",
};
