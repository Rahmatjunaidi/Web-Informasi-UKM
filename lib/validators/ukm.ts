import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const ukmSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Kode UKM wajib diisi.")
    .max(30, "Kode UKM maksimal 30 karakter.")
    .transform((value) => value.toUpperCase()),
  name: z.string().trim().min(1, "Nama UKM wajib diisi.").max(150, "Nama UKM maksimal 150 karakter."),
  description: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  contactEmail: z.preprocess(
    emptyToUndefined,
    z.string().trim().email("Format email tidak valid.").max(150, "Email maksimal 150 karakter.").optional(),
  ),
  contactPhone: z.preprocess(emptyToUndefined, z.string().trim().max(30, "Telepon maksimal 30 karakter.").optional()),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  establishedAt: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type UkmInput = z.infer<typeof ukmSchema>;

export type UkmFormErrors = Partial<Record<keyof UkmInput | "logo", string>>;
