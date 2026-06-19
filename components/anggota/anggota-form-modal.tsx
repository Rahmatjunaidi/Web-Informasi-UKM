"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Save, X } from "lucide-react";
import { useFormStatus } from "react-dom";

import { createStudentAction, updateStudentAction, assignMembershipAction, type AnggotaActionState } from "@/app/(dashboard)/dashboard/anggota/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export type StudentFormValue = {
  id?: string;
  nim: string;
  name: string;
  studyProgram?: string | null;
  faculty?: string | null;
  phone?: string | null;
  address?: string | null;
};

type AnggotaFormModalProps = {
  mode: "create" | "edit";
  student?: StudentFormValue;
  trigger?: React.ReactNode;
};

const initial: AnggotaActionState = { ok: false, message: "" };

export function AnggotaFormModal({ mode, trigger, student }: AnggotaFormModalProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const action = mode === "create" ? createStudentAction : updateStudentAction;
  const [state, formAction] = useActionState(action, initial);
  const title = mode === "create" ? "Tambah Anggota" : "Edit Anggota";

  React.useEffect(() => {
    if (!state.message) return;
    toast({ title: state.ok ? "Berhasil" : "Gagal", description: state.message, type: state.ok ? "success" : "error" });
    if (state.ok) {
      setOpen(false);
      router.refresh();
    }
  }, [state.message, state.ok, router, toast]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger ?? (
        <Button type="button">{mode === "create" ? <Plus /> : <Pencil />}{mode === "create" ? "Tambah" : "Edit"}</Button>
      )}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Lengkapi data anggota mahasiswa.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-5">
          {student?.id ? <input name="id" type="hidden" value={student.id} /> : null}

          {mode === "create" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="email@kampus.ac.id" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password (sementara)</Label>
                <Input id="password" name="password" type="password" placeholder="Kosongkan untuk generate otomatis" />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nim">NIM</Label>
              <Input id="nim" name="nim" defaultValue={student?.nim ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" defaultValue={student?.name ?? ""} required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studyProgram">Program Studi</Label>
              <Input id="studyProgram" name="studyProgram" defaultValue={student?.studyProgram ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Fakultas</Label>
              <Input id="faculty" name="faculty" defaultValue={student?.faculty ?? ""} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" name="phone" defaultValue={student?.phone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" name="address" defaultValue={student?.address ?? ""} />
            </div>
          </div>

          {mode === "create" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ukmId">UKM (ID) - Opsional</Label>
                <Input id="ukmId" name="ukmId" placeholder="Masukkan ID UKM (mis. 1)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinedAt">Tanggal Bergabung</Label>
                <Input id="joinedAt" name="joinedAt" type="date" />
              </div>
            </div>
          )}

          {/* Hidden defaults for membership when provided */}
          {mode === "create" && (
            <>
              <input type="hidden" name="position" value="MEMBER" />
              <input type="hidden" name="membershipStatus" value="ACTIVE" />
            </>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline"><X />Batal</Button>
            </DialogClose>
            <SubmitButton label={mode === "create" ? "Tambah" : "Simpan"} />
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      {pending ? "Menyimpan..." : label}
    </Button>
  );
}
