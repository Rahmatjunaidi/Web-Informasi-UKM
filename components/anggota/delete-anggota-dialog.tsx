"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";

import { deleteStudentAction, type AnggotaActionState } from "@/app/(dashboard)/dashboard/anggota/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

const initial: AnggotaActionState = { ok: false, message: "" };

type Props = { id: string; name: string; trigger?: React.ReactNode };

export function DeleteAnggotaDialog({ id, name, trigger }: Props) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useActionState(deleteStudentAction, initial);
  const router = useRouter();
  const { toast } = useToast();

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
      <DialogTrigger asChild>
        {trigger ?? (<Button type="button" variant="destructive"><Trash2 />Hapus</Button>)}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Anggota</DialogTitle>
          <DialogDescription>Anggota "{name}" akan dihapus dari sistem. Tindakan ini permanen.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-5">
          <input name="id" type="hidden" value={id} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline"><X />Batal</Button>
            </DialogClose>
            <DeleteButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" variant="destructive">
      {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
      {pending ? "Menghapus..." : "Ya, Hapus"}
    </Button>
  );
}
