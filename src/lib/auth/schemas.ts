import { z } from "zod";

export const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter").max(100, "Nama terlalu panjang"),
    email: z.string().trim().email("Format email tidak valid").max(255),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Gunakan nomor WhatsApp yang valid, contoh 081234567890"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Za-z]/, "Password harus mengandung huruf")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string(),
    city: z.string().trim().min(2, "Kota/domisili wajib diisi").max(80),
    terms: z.boolean().refine((v) => v, "Anda harus menyetujui ketentuan"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama",
  });

export const forgotSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
});

export const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Za-z]/, "Password harus mengandung huruf")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama",
  });
