"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Pencil, Save, X } from "lucide-react";
import { useFormStatus } from "react-dom";

import { createActivityAction, updateActivityAction, deleteActivityAction, type KegiatanActionState } from "@/app/(dashboard)/dashboard/kegiatan/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

export type ActivityFormValue = {
  id?: string;
  ukmId: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startsAt: string;
  endsAt?: string | null;
  budgetAmount?: string;
  status: string;
};

type Props = { mode: "create" | "edit"; activity?: ActivityFormValue; trigger?: React.ReactNode };

const initial: KegiatanActionState = { ok: false, message: "" };

export function KegiatanFormModal({ mode, activity, trigger }: Props) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const action = mode === "create" ? createActivityAction : updateActivityAction;
  const [state, formAction] = useActionState(action, initial);
  const title = mode === "create" ? "Tambah Kegiatan" : "Edit Kegiatan";

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
      <DialogTrigger asChild>{trigger ?? <Button>{mode === "create" ? <Plus /> : <Pencil />}{mode === "create" ? "Tambah" : "Edit"}</Button>}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Lengkapi detail kegiatan.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-5">
          {activity?.id ? <input name="id" type="hidden" value={activity.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ukmId">UKM</Label>
              <Input id="ukmId" name="ukmId" defaultValue={activity?.ukmId ?? ""} placeholder="ID UKM" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" name="title" defaultValue={activity?.title ?? ""} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" defaultValue={activity?.description ?? ""} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input id="location" name="location" defaultValue={activity?.location ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget</Label>
              <Input id="budgetAmount" name="budgetAmount" defaultValue={activity?.budgetAmount ?? "0"} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startsAt">Tanggal Mulai</Label>
              <Input id="startsAt" name="startsAt" type="datetime-local" defaultValue={activity?.startsAt ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endsAt">Tanggal Selesai</Label>
              <Input id="endsAt" name="endsAt" type="datetime-local" defaultValue={activity?.endsAt ?? ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" name="status" defaultValue={activity?.status ?? "DRAFT"} className="focus-ring h-10 w-full rounded-md border border-slate-200/80 bg-white/75 px-3 text-sm shadow-sm">
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline"><X />Batal</Button>
            </DialogClose>
            <Button type="submit">
              {mode === "create" ? "Tambah Kegiatan" : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
