import { z } from "zod";

export const activitySchema = z.object({
  ukmId: z.string().regex(/^\d+$/, "ID UKM tidak valid"),
  title: z.string().min(3, "Judul harus diisi"),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startsAt: z.string().refine((v) => !!v, "Tanggal mulai harus diisi"),
  endsAt: z.string().optional().nullable(),
  budgetAmount: z
    .string()
    .optional()
    .transform((v) => (v ? v : "0"))
    .refine((v) => !isNaN(Number(v)), "Budget harus berupa angka"),
  status: z.enum([
    "DRAFT",
    "SUBMITTED",
    "APPROVED",
    "REJECTED",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export type ActivityInput = z.infer<typeof activitySchema>;
