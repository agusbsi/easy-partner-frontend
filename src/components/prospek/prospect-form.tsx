import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Field } from "@/components/auth/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { phoneRegex } from "@/lib/auth/schemas";
import { prospectStore } from "@/lib/store";

const schema = z.object({
  office: z.string().trim().min(3, "Nama kantor wajib diisi").max(120),
  contact: z.string().trim().min(3, "Nama notaris/PIC wajib diisi").max(100),
  phone: z.string().trim().regex(phoneRegex, "Nomor WhatsApp tidak valid"),
  city: z.string().trim().min(2, "Kota wajib diisi").max(80),
  source: z.string().min(1, "Pilih sumber"),
  plan: z.string().min(1, "Pilih paket"),
  nextAction: z.string().min(1, "Tentukan jadwal follow-up"),
});
type Values = z.infer<typeof schema>;

const PLANS: Record<string, number> = { Basic: 2_400_000, Pro: 4_800_000, Enterprise: 12_000_000 };

export function ProspectForm({ onDone }: { onDone: () => void }) {
  const { register, handleSubmit, control, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { office: "", contact: "", phone: "", city: "", source: "Referral", plan: "Pro", nextAction: new Date(Date.now() + 86400000).toISOString().slice(0, 16) },
  });
  const e = formState.errors;

  const onSubmit = handleSubmit((v) => {
    prospectStore.set((list) => [
      {
        id: `p-${Date.now()}`,
        office: v.office,
        contact: v.contact,
        phone: v.phone,
        city: v.city,
        source: v.source,
        estimate: PLANS[v.plan] ?? 0,
        stage: "baru",
        nextAction: new Date(v.nextAction).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...list,
    ]);
    toast.success("Prospek ditambahkan", { description: v.office });
    onDone();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field id="office" label="Nama kantor notaris" error={e.office?.message}>
        <Input id="office" placeholder="Kantor Notaris …" {...register("office")} />
      </Field>
      <Field id="contact" label="Nama notaris / PIC" error={e.contact?.message}>
        <Input id="contact" placeholder="Nama lengkap & gelar" {...register("contact")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="phone" label="WhatsApp" error={e.phone?.message}>
          <Input id="phone" type="tel" inputMode="tel" placeholder="0812…" {...register("phone")} />
        </Field>
        <Field id="city" label="Kota" error={e.city?.message}>
          <Input id="city" placeholder="Bandung" {...register("city")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="source" label="Sumber prospek" error={e.source?.message}>
          <Controller control={control} name="source" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="source"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Referral", "Event IPPAT", "Webinar", "Instagram", "WhatsApp", "Website"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </Field>
        <Field id="plan" label="Minat paket" error={e.plan?.message}>
          <Controller control={control} name="plan" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="plan"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(PLANS).map((s) => <SelectItem key={s} value={s}>Paket {s}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </Field>
      </div>
      <Field id="nextAction" label="Jadwal follow-up" error={e.nextAction?.message}>
        <Input id="nextAction" type="datetime-local" {...register("nextAction")} />
      </Field>
      <Button type="submit" size="xl" className="w-full">Simpan prospek</Button>
    </form>
  );
}
