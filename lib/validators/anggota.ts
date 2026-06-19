import { z } from "zod";

export const studentSchema = z.object({
  nim: z.string().min(3, "NIM minimal 3 karakter"),
  name: z.string().min(2, "Nama harus diisi"),
  studyProgram: z.string().optional().nullable(),
  faculty: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const createStudentSchema = studentSchema.extend({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type StudentFormErrors = Partial<Record<keyof StudentInput | keyof CreateStudentInput, string>>;

export const membershipSchema = z.object({
  studentId: z.string().regex(/^\d+$/, "ID siswa tidak valid"),
  ukmId: z.string().regex(/^\d+$/, "ID UKM tidak valid"),
  position: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  joinedAt: z.string().optional().nullable(),
});

export type MembershipInput = z.infer<typeof membershipSchema>;
export type MembershipFormErrors = Partial<Record<keyof MembershipInput, string>>;
