import { beforeEach, describe, expect, it } from "vitest";
import { isDemoVisible, login, register, verifyAccount, MOCK_VERIFICATION_CODE, getSession } from "@/lib/auth/mock-auth";
import { registerSchema } from "@/lib/auth/schemas";

beforeEach(() => localStorage.clear());

describe("mock auth rules", () => {
  it("hides demo accounts in production builds", () => {
    expect(isDemoVisible("production")).toBe(false);
    expect(isDemoVisible("development")).toBe(true);
  });

  it("registers every new partner as Mitra Referral", async () => {
    const user = await register({ name: "Budi Santoso", email: "budi@mail.com", phone: "081234567890", password: "rahasia123", city: "Bandung" });
    expect(user.role).toBe("referral");
    expect(user.status).toBe("unverified");
  });

  it("activates and signs in an account after the verification code", async () => {
    await register({ name: "Budi Santoso", email: "budi@mail.com", phone: "081234567890", password: "rahasia123", city: "Bandung" });
    const user = await verifyAccount("budi@mail.com", MOCK_VERIFICATION_CODE);
    expect(user.status).toBe("active");
    expect(getSession()?.email).toBe("budi@mail.com");
  });

  it("rejects a wrong password", async () => {
    await expect(login("referral@easypartner.id", "salah")).rejects.toThrow();
  });

  it("requires accepting the terms and matching passwords at registration", () => {
    const base = { name: "Budi", email: "b@mail.com", phone: "081234567890", password: "rahasia123", confirmPassword: "rahasia123", city: "Bandung", terms: true };
    expect(registerSchema.safeParse(base).success).toBe(true);
    expect(registerSchema.safeParse({ ...base, terms: false }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, confirmPassword: "lain12345" }).success).toBe(false);
  });
});
