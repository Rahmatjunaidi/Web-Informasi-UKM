import { z } from "zod";

export const financeTypeEnum = z.enum(["INCOME", "EXPENSE"]);
export const financeStatusEnum = z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"]);

export const createFinanceSchema = z.object({
  ukmId: z.string().regex(/^\d+$/).transform(Number),
  categoryId: z.string().regex(/^\d+$/).transform(Number),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  transactionDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }).transform((s) => new Date(s)),
  amount: z.string().refine((s) => !Number.isNaN(Number(s)), { message: "Invalid amount" }).transform(Number),
  type: financeTypeEnum,
});

export const updateFinanceSchema = createFinanceSchema.extend({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const deleteFinanceSchema = z.object({ id: z.string().regex(/^\d+$/).transform(Number) });

export const approvalSchema = z.object({
  transactionId: z.string().regex(/^\d+$/).transform(Number),
  status: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional().nullable(),
});

// Finance Category validators
export const createCategorySchema = z.object({
  ukmId: z.string().regex(/^\d+$/).transform(Number),
  name: z.string().min(1).max(100),
  type: financeTypeEnum,
});

export const updateCategorySchema = createCategorySchema.extend({ id: z.string().regex(/^\d+$/).transform(Number) });

export const deleteCategorySchema = z.object({ id: z.string().regex(/^\d+$/).transform(Number) });
