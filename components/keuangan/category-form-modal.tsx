"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Save, X, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { createCategoryAction, updateCategoryAction } from "@/app/(dashboard)/dashboard/keuangan/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

type CategoryFormProps = {
  mode: "create" | "edit";
  category?: any;
  ukms: any[];
  trigger?: React.ReactNode;
};

const initial = { ok: false, message: "" };

export function CategoryFormModal({ mode, category, ukms, trigger }: CategoryFormProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const action = mode === "create" ? createCategoryAction : updateCategoryAction;
  const [state, formAction] = useActionState(action, initial);
  const title = mode === "create" ? "Tambah Kategori" : "Edit Kategori";

  React.useEffect(() => {
    if (!state.message) return;
    toast({ title: state.ok ? "Berhasil" : "Gagal", description: state.message, type: state.ok ? "success" : "error" });
    if (state.ok) {
      setOpen(false);
      router.refresh();
    }
  }, [state.message, state.ok, router, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button>{mode === "create" ? <Plus /> : <Pencil />}{mode === "create" ? "Tambah" : "Edit"}</Button>}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Kelola kategori keuangan untuk UKM.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4">
          {mode === "edit" && category?.id && <input type="hidden" name="id" value={String(category.id)} />}

          <div>
            <Label>UKM</Label>
            <select name="ukmId" defaultValue={category?.ukmId ? String(category.ukmId) : ""} className="input w-full">
              <option value="">-- Pilih UKM --</option>
              {ukms.map((u) => (<option key={u.id.toString()} value={u.id.toString()}>{u.name}</option>))}
            </select>
          </div>

          <div>
            <Label>Nama Kategori</Label>
            <Input name="name" defaultValue={category?.name ?? ""} />
          </div>

          <div>
            <Label>Tipe</Label>
            <select name="type" defaultValue={category?.type ?? "EXPENSE"} className="input w-full">
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}><X />Batal</Button>
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
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      {pending ? "Menyimpan..." : label}
    </Button>
  );
}
