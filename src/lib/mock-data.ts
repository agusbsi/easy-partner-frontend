import { addDays, setHours, setMinutes, startOfDay, subDays } from "date-fns";

export type Stage = "baru" | "follow_up" | "presentasi" | "trial" | "closing" | "batal";

export const STAGES: Array<{ key: Stage; label: string; tone: "muted" | "brand" | "cyan" | "warning" | "ink" | "coral" }> = [
  { key: "baru", label: "Prospek Baru", tone: "muted" },
  { key: "follow_up", label: "Follow-up", tone: "brand" },
  { key: "presentasi", label: "Presentasi", tone: "warning" },
  { key: "trial", label: "Trial", tone: "cyan" },
  { key: "closing", label: "Closing", tone: "ink" },
  { key: "batal", label: "Batal", tone: "coral" },
];

export const stageMeta = (s: Stage) => STAGES.find((x) => x.key === s) ?? STAGES[0]!;

export interface Prospect {
  id: string;
  contact: string;
  office: string;
  city: string;
  phone: string;
  stage: Stage;
  source: string;
  estimate: number;
  nextAction: string; // ISO
  collaborator?: string;
  updatedAt: string;
}

const today = startOfDay(new Date());
const at = (dayOffset: number, h: number, m = 0) =>
  setMinutes(setHours(addDays(today, dayOffset), h), m).toISOString();

export const PROSPECTS: Prospect[] = [
  { id: "p1", contact: "Hendra Wijaya, S.H., M.Kn.", office: "Kantor Notaris Hendra Wijaya", city: "Bandung", phone: "081311110001", stage: "follow_up", source: "Referral", estimate: 4_800_000, nextAction: at(0, 10), updatedAt: at(-1, 15) },
  { id: "p2", contact: "Maya Anggraini, S.H.", office: "Notaris & PPAT Maya Anggraini", city: "Cimahi", phone: "081311110002", stage: "presentasi", source: "Event IPPAT", estimate: 7_200_000, nextAction: at(0, 13, 30), collaborator: "Dimas Pratama", updatedAt: at(-1, 9) },
  { id: "p3", contact: "Bambang Sutrisno, S.H., M.Kn.", office: "Kantor Notaris Bambang S.", city: "Sumedang", phone: "081311110003", stage: "trial", source: "WhatsApp", estimate: 4_800_000, nextAction: at(1, 9), updatedAt: at(-2, 11) },
  { id: "p4", contact: "Lestari Putri, S.H.", office: "Notaris Lestari Putri", city: "Bandung", phone: "081311110004", stage: "closing", source: "Referral", estimate: 9_600_000, nextAction: at(-3, 14), updatedAt: at(-3, 14) },
  { id: "p5", contact: "Agus Salim, S.H., M.Kn.", office: "Kantor Notaris Agus Salim", city: "Garut", phone: "081311110005", stage: "baru", source: "Instagram", estimate: 4_800_000, nextAction: at(0, 16), updatedAt: at(0, 8) },
  { id: "p6", contact: "Ratna Dewi, S.H.", office: "Notaris & PPAT Ratna Dewi", city: "Bekasi", phone: "081311110006", stage: "follow_up", source: "Referral", estimate: 7_200_000, nextAction: at(1, 11), updatedAt: at(-1, 16) },
  { id: "p7", contact: "Yusuf Hidayat, S.H.", office: "Kantor Notaris Yusuf H.", city: "Depok", phone: "081311110007", stage: "presentasi", source: "Webinar", estimate: 4_800_000, nextAction: at(2, 10), collaborator: "Dimas Pratama", updatedAt: at(-2, 10) },
  { id: "p8", contact: "Fitri Handayani, S.H., M.Kn.", office: "Notaris Fitri Handayani", city: "Bogor", phone: "081311110008", stage: "closing", source: "Event IPPAT", estimate: 12_000_000, nextAction: at(-6, 10), updatedAt: at(-6, 10) },
  { id: "p9", contact: "Rudi Hartono, S.H.", office: "Kantor Notaris Rudi Hartono", city: "Tasikmalaya", phone: "081311110009", stage: "batal", source: "WhatsApp", estimate: 4_800_000, nextAction: at(-8, 10), updatedAt: at(-8, 10) },
  { id: "p10", contact: "Nur Aini, S.H.", office: "Notaris & PPAT Nur Aini", city: "Cirebon", phone: "081311110010", stage: "trial", source: "Referral", estimate: 7_200_000, nextAction: at(3, 14), updatedAt: at(-1, 13) },
  { id: "p11", contact: "Teguh Santoso, S.H., M.Kn.", office: "Kantor Notaris Teguh S.", city: "Bandung", phone: "081311110011", stage: "baru", source: "Website", estimate: 4_800_000, nextAction: at(0, 11, 30), updatedAt: at(0, 7) },
  { id: "p12", contact: "Desi Ramadhani, S.H.", office: "Notaris Desi Ramadhani", city: "Karawang", phone: "081311110012", stage: "follow_up", source: "Instagram", estimate: 4_800_000, nextAction: at(4, 10), updatedAt: at(-3, 10) },
];

export type ActivityType = "presentasi" | "follow_up" | "trial" | "meeting";
export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  presentasi: "Presentasi",
  follow_up: "Follow-up",
  trial: "Trial",
  meeting: "Meeting",
};

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  office: string;
  start: string;
  durationMin: number;
  mode: string;
  withPartner?: string;
}

export const ACTIVITIES: Activity[] = [
  { id: "a1", type: "follow_up", title: "Follow-up penawaran paket Pro", office: "Kantor Notaris Hendra Wijaya", start: at(0, 10), durationMin: 30, mode: "WhatsApp Call" },
  { id: "a2", type: "presentasi", title: "Presentasi Easy Notaris", office: "Notaris & PPAT Maya Anggraini", start: at(0, 13, 30), durationMin: 60, mode: "Offline · Cimahi", withPartner: "Dimas Pratama" },
  { id: "a3", type: "follow_up", title: "Kirim brosur & harga", office: "Kantor Notaris Agus Salim", start: at(0, 16), durationMin: 15, mode: "WhatsApp" },
  { id: "a4", type: "trial", title: "Onboarding trial 14 hari", office: "Kantor Notaris Bambang S.", start: at(1, 9), durationMin: 45, mode: "Online · Zoom" },
  { id: "a5", type: "follow_up", title: "Konfirmasi jadwal presentasi", office: "Notaris & PPAT Ratna Dewi", start: at(1, 11), durationMin: 20, mode: "Telepon" },
  { id: "a6", type: "presentasi", title: "Demo fitur akta digital", office: "Kantor Notaris Yusuf H.", start: at(2, 10), durationMin: 60, mode: "Online · Google Meet", withPartner: "Dimas Pratama" },
  { id: "a7", type: "trial", title: "Evaluasi trial", office: "Notaris & PPAT Nur Aini", start: at(3, 14), durationMin: 30, mode: "Online · Zoom" },
  { id: "a8", type: "meeting", title: "Coaching mitra bulanan", office: "Tim Easy Notaris", start: at(5, 15), durationMin: 60, mode: "Online · Zoom" },
  { id: "a9", type: "presentasi", title: "Presentasi kantor baru", office: "Notaris Desi Ramadhani", start: at(7, 10), durationMin: 60, mode: "Offline · Karawang" },
  { id: "a10", type: "follow_up", title: "Follow-up pasca closing", office: "Notaris Lestari Putri", start: at(-2, 10), durationMin: 20, mode: "WhatsApp" },
  { id: "a11", type: "presentasi", title: "Presentasi produk", office: "Notaris Fitri Handayani", start: at(-7, 13), durationMin: 60, mode: "Offline · Bogor" },
  { id: "a12", type: "trial", title: "Setup akun trial", office: "Notaris & PPAT Nur Aini", start: at(-4, 9), durationMin: 45, mode: "Online · Zoom" },
];

export type CommissionStatus = "pending" | "tersedia" | "dicairkan";
export interface Commission {
  id: string;
  office: string;
  plan: string;
  amount: number;
  status: CommissionStatus;
  type: "mandiri" | "kolaborasi";
  date: string;
}

export const COMMISSIONS: Commission[] = [
  { id: "KM-2611-014", office: "Notaris Fitri Handayani", plan: "Paket Enterprise · 12 bln", amount: 2_400_000, status: "tersedia", type: "kolaborasi", date: at(-6, 10) },
  { id: "KM-2611-012", office: "Notaris Lestari Putri", plan: "Paket Pro · 12 bln", amount: 1_920_000, status: "pending", type: "mandiri", date: at(-3, 14) },
  { id: "KM-2610-031", office: "Kantor Notaris Ahmad F.", plan: "Paket Pro · 12 bln", amount: 1_920_000, status: "tersedia", type: "mandiri", date: at(-24, 10) },
  { id: "KM-2610-022", office: "Notaris Siti Rahma", plan: "Paket Basic · 12 bln", amount: 960_000, status: "dicairkan", type: "mandiri", date: at(-35, 10) },
  { id: "KM-2609-018", office: "Notaris & PPAT Wahyu", plan: "Paket Pro · 12 bln", amount: 1_440_000, status: "dicairkan", type: "kolaborasi", date: at(-58, 10) },
  { id: "KM-2609-007", office: "Kantor Notaris Indah P.", plan: "Paket Basic · 12 bln", amount: 960_000, status: "dicairkan", type: "mandiri", date: at(-70, 10) },
  { id: "KM-2611-016", office: "Notaris & PPAT Maya Anggraini", plan: "Paket Pro · 12 bln", amount: 1_440_000, status: "pending", type: "kolaborasi", date: at(-1, 10) },
];

export type HelpStatus = "menunggu" | "berjalan" | "selesai" | "ditolak";
export interface HelpRequest {
  id: string;
  from: string;
  fromCity: string;
  office: string;
  need: string;
  schedule: string;
  note: string;
  split: string;
  status: HelpStatus;
}

export const HELP_REQUESTS: HelpRequest[] = [
  { id: "h1", from: "Rina Kartika", fromCity: "Bandung", office: "Kantor Notaris Teguh S.", need: "Presentasi produk", schedule: at(2, 13), note: "Klien tertarik modul akta & arsip digital, butuh demo langsung di kantor.", split: "50 : 50", status: "menunggu" },
  { id: "h2", from: "Andi Saputra", fromCity: "Bekasi", office: "Notaris & PPAT Ratna Dewi", need: "Negosiasi paket", schedule: at(3, 10), note: "Minta penawaran khusus untuk 3 cabang kantor.", split: "40 : 60", status: "menunggu" },
  { id: "h3", from: "Rina Kartika", fromCity: "Bandung", office: "Notaris & PPAT Maya Anggraini", need: "Presentasi produk", schedule: at(0, 13, 30), note: "Presentasi offline, bawa materi studi kasus.", split: "50 : 50", status: "berjalan" },
  { id: "h4", from: "Lukman Hakim", fromCity: "Depok", office: "Kantor Notaris Yusuf H.", need: "Demo fitur teknis", schedule: at(2, 10), note: "Fokus integrasi dengan sistem kantor yang ada.", split: "50 : 50", status: "berjalan" },
  { id: "h5", from: "Rina Kartika", fromCity: "Bandung", office: "Notaris Fitri Handayani", need: "Presentasi produk", schedule: at(-7, 13), note: "Closing tercapai.", split: "50 : 50", status: "selesai" },
];

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  tag: "Program" | "Produk" | "Info";
}

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "n1", title: "Bonus closing Desember naik 20%", body: "Setiap closing paket Pro dan Enterprise sepanjang Desember mendapat tambahan komisi 20%.", date: at(-1, 9), tag: "Program" },
  { id: "n2", title: "Fitur baru: Tanda tangan elektronik", body: "Easy Notaris kini mendukung TTE tersertifikasi. Materi presentasi sudah diperbarui.", date: at(-4, 9), tag: "Produk" },
  { id: "n3", title: "Jadwal pencairan komisi", body: "Pencairan komisi diproses setiap tanggal 5 dan 20 setiap bulan.", date: at(-9, 9), tag: "Info" },
];

export const MONTHLY = [
  { month: "Jun", closing: 2, mandiri: 2, kolaborasi: 0, komisi: 1_920_000 },
  { month: "Jul", closing: 3, mandiri: 2, kolaborasi: 1, komisi: 3_360_000 },
  { month: "Agu", closing: 2, mandiri: 1, kolaborasi: 1, komisi: 2_400_000 },
  { month: "Sep", closing: 4, mandiri: 3, kolaborasi: 1, komisi: 4_320_000 },
  { month: "Okt", closing: 5, mandiri: 3, kolaborasi: 2, komisi: 5_760_000 },
  { month: "Nov", closing: 6, mandiri: 4, kolaborasi: 2, komisi: 7_200_000 },
];

export const RECENT_ACTIVITY = [
  { id: "r1", text: "Prospek baru ditambahkan", target: "Kantor Notaris Agus Salim", time: at(0, 8), kind: "prospek" as const },
  { id: "r2", text: "Status berubah ke Trial", target: "Notaris & PPAT Nur Aini", time: at(-1, 13), kind: "trial" as const },
  { id: "r3", text: "Bantuan diterima oleh Dimas Pratama", target: "Notaris & PPAT Maya Anggraini", time: at(-1, 9), kind: "kolaborasi" as const },
  { id: "r4", text: "Komisi masuk Rp1.920.000", target: "Notaris Lestari Putri", time: at(-3, 14), kind: "komisi" as const },
  { id: "r5", text: "Closing berhasil", target: "Notaris Fitri Handayani", time: at(-6, 10), kind: "closing" as const },
];

export type PartnerStatus = "aktif" | "menunggu" | "ditangguhkan";
export interface Partner {
  id: string;
  name: string;
  email: string;
  city: string;
  role: "referral" | "aktif";
  status: PartnerStatus;
  prospects: number;
  closing: number;
  joinedAt: string;
}

export const PARTNERS: Partner[] = [
  { id: "m1", name: "Rina Kartika", email: "rina@mail.com", city: "Bandung", role: "referral", status: "aktif", prospects: 12, closing: 4, joinedAt: subDays(today, 256).toISOString() },
  { id: "m2", name: "Dimas Pratama", email: "dimas@mail.com", city: "Jakarta Selatan", role: "aktif", status: "aktif", prospects: 34, closing: 15, joinedAt: subDays(today, 387).toISOString() },
  { id: "m3", name: "Andi Saputra", email: "andi@mail.com", city: "Bekasi", role: "referral", status: "aktif", prospects: 8, closing: 2, joinedAt: subDays(today, 120).toISOString() },
  { id: "m4", name: "Lukman Hakim", email: "lukman@mail.com", city: "Depok", role: "referral", status: "aktif", prospects: 6, closing: 1, joinedAt: subDays(today, 90).toISOString() },
  { id: "m5", name: "Putri Maharani", email: "putri@mail.com", city: "Surabaya", role: "aktif", status: "aktif", prospects: 27, closing: 11, joinedAt: subDays(today, 300).toISOString() },
  { id: "m6", name: "Fajar Nugroho", email: "fajar@mail.com", city: "Semarang", role: "referral", status: "menunggu", prospects: 0, closing: 0, joinedAt: subDays(today, 2).toISOString() },
  { id: "m7", name: "Wulan Sari", email: "wulan@mail.com", city: "Yogyakarta", role: "referral", status: "menunggu", prospects: 0, closing: 0, joinedAt: subDays(today, 1).toISOString() },
  { id: "m8", name: "Bayu Firmansyah", email: "bayu@mail.com", city: "Malang", role: "referral", status: "ditangguhkan", prospects: 3, closing: 0, joinedAt: subDays(today, 180).toISOString() },
];
