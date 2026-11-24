/**
 * Isolated mock authentication service for frontend development.
 * Persists to localStorage. Replace with a real backend without touching UI code:
 * every UI path goes through the functions exported here.
 */
import type { Role, User } from "./types";

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = "ep.users.v1";
const SESSION_KEY = "ep.session.v1";
const RESET_KEY = "ep.reset.v1";

export const MOCK_VERIFICATION_CODE = "246810";

/** Demo credentials are shown only outside production builds. */
export function isDemoVisible(mode: string = import.meta.env.MODE): boolean {
  return mode !== "production";
}

export const DEMO_ACCOUNTS: Array<{ role: Role; email: string; password: string; label: string }> =
  [
    { role: "referral", email: "referral@easypartner.id", password: "demo1234", label: "Mitra Referral" },
    { role: "aktif", email: "aktif@easypartner.id", password: "demo1234", label: "Mitra Aktif" },
    { role: "admin", email: "admin@easypartner.id", password: "demo1234", label: "Administrator" },
  ];

const SEED_USERS: StoredUser[] = [
  {
    id: "u-ref-1",
    name: "Rina Kartika",
    email: "referral@easypartner.id",
    phone: "081234567801",
    city: "Bandung",
    role: "referral",
    status: "active",
    category: "Silver Partner",
    referralCode: "RINA-8F2K",
    joinedAt: "2026-03-12",
    password: "demo1234",
  },
  {
    id: "u-akt-1",
    name: "Dimas Pratama",
    email: "aktif@easypartner.id",
    phone: "081234567802",
    city: "Jakarta Selatan",
    role: "aktif",
    status: "active",
    category: "Gold Partner",
    referralCode: "DIMAS-3QX9",
    joinedAt: "2025-11-02",
    password: "demo1234",
  },
  {
    id: "u-adm-1",
    name: "Sari Wulandari",
    email: "admin@easypartner.id",
    phone: "081234567803",
    city: "Jakarta Pusat",
    role: "admin",
    status: "active",
    category: "Tim Easy Notaris",
    referralCode: "ADMIN",
    joinedAt: "2025-01-10",
    password: "demo1234",
  },
];

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function readUsers(): StoredUser[] {
  if (!hasStorage()) return SEED_USERS;
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return SEED_USERS;
  }
}

function writeUsers(users: StoredUser[]) {
  if (hasStorage()) localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function strip(u: StoredUser): User {
  const { password: _pw, ...rest } = u;
  return rest;
}

/* ---------- session store (useSyncExternalStore-compatible) ---------- */
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedUser: User | null = null;

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY || e.key === USERS_KEY) listener();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

export function getSession(): User | null {
  if (!hasStorage()) return null;
  const id = localStorage.getItem(SESSION_KEY);
  const users = localStorage.getItem(USERS_KEY);
  const raw = `${id}|${users}`;
  if (raw === cachedRaw) return cachedUser;
  cachedRaw = raw;
  const found = id ? readUsers().find((u) => u.id === id) : undefined;
  cachedUser = found ? strip(found) : null;
  return cachedUser;
}

export class AuthError extends Error {}

export async function login(email: string, password: string): Promise<User> {
  await wait();
  const user = readUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) {
    throw new AuthError("Email atau password tidak sesuai.");
  }
  localStorage.setItem(SESSION_KEY, user.id);
  emit();
  return strip(user);
}

export async function logout() {
  await wait(150);
  if (hasStorage()) localStorage.removeItem(SESSION_KEY);
  emit();
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  city: string;
}

export async function register(input: RegisterInput): Promise<User> {
  await wait(600);
  const users = readUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new AuthError("Email sudah terdaftar. Silakan masuk.");
  }
  const first = input.name.trim().split(/\s+/)[0] ?? "MITRA";
  const user: StoredUser = {
    id: `u-${Date.now().toString(36)}`,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    city: input.city.trim(),
    role: "referral", // registration always starts as Mitra Referral
    status: "unverified",
    category: "Partner Baru",
    referralCode: `${first.toUpperCase().slice(0, 6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    joinedAt: new Date().toISOString().slice(0, 10),
    password: input.password,
  };
  writeUsers([...users, user]);
  return strip(user);
}

export async function verifyAccount(email: string, code: string): Promise<User> {
  await wait();
  if (code !== MOCK_VERIFICATION_CODE) throw new AuthError("Kode verifikasi salah.");
  const users = readUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  const target = users[idx];
  if (idx < 0 || !target) throw new AuthError("Akun tidak ditemukan.");
  const updated: StoredUser = { ...target, status: "active" };
  users[idx] = updated;
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, updated.id);
  emit();
  return strip(updated);
}

export async function requestPasswordReset(email: string): Promise<{ token: string }> {
  await wait();
  const token = Math.random().toString(36).slice(2, 12);
  if (hasStorage()) {
    localStorage.setItem(RESET_KEY, JSON.stringify({ token, email: email.trim().toLowerCase() }));
  }
  return { token };
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await wait();
  const raw = hasStorage() ? localStorage.getItem(RESET_KEY) : null;
  const data = raw ? (JSON.parse(raw) as { token: string; email: string }) : null;
  if (!data || data.token !== token) {
    throw new AuthError("Tautan reset tidak valid atau sudah kedaluwarsa.");
  }
  const users = readUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === data.email);
  const target = users[idx];
  if (target) {
    users[idx] = { ...target, password };
    writeUsers(users);
  }
  localStorage.removeItem(RESET_KEY);
}
