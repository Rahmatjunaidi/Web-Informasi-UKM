"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Pencil, Plus, Save, X } from "lucide-react";
import { useFormStatus } from "react-dom";

import {
  createUkmAction,
  updateUkmAction,
  type UkmActionState,
} from "@/app/(dashboard)/dashboard/ukm/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export type UkmFormValue = {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  status: "ACTIVE" | "INACTIVE";
  establishedAt?: string | null;
};

type UkmFormModalProps = {
  mode: "create" | "edit";
  ukm?: UkmFormValue;
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
};

const initialState: UkmActionState = {
  ok: false,
  message: "",
};

export function UkmFormModal({ mode, trigger, ukm, defaultOpen = false }: UkmFormModalProps) {
  const [open, setOpen] = React.useState(Boolean(defaultOpen));
  const router = useRouter();
  const { toast } = useToast();
  const action = mode === "create" ? createUkmAction : updateUkmAction;
  const [state, formAction] = useActionState(action, initialState);
  const title = mode === "create" ? "Tambah UKM" : "Edit UKM";

  React.useEffect(() => {
    if (!state.message) {
      return;
    }

    toast({
      title: state.ok ? "Berhasil" : "Gagal",
      description: state.message,
      type: state.ok ? "success" : "error",
    });

    if (state.ok) {
      setOpen(false);
      router.refresh();
    }
  }, [router, state.message, state.ok, toast]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">
            {mode === "create" ? <Plus /> : <Pencil />}
            {mode === "create" ? "Tambah UKM" : "Edit"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Lengkapi data UKM. Kode UKM harus unik dan nama UKM wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-5">
          {ukm?.id ? <input name="id" type="hidden" value={ukm.id} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field error={state.errors?.code} label="Kode UKM" name="code" placeholder="HMIF" required defaultValue={ukm?.code} />
            <Field error={state.errors?.name} label="Nama UKM" name="name" placeholder="Himpunan Mahasiswa Informatika" required defaultValue={ukm?.name} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              error={state.errors?.contactEmail}
              label="Email Kontak"
              name="contactEmail"
              placeholder="ukm@kampus.ac.id"
              type="email"
              defaultValue={ukm?.contactEmail ?? ""}
            />
            <Field
              error={state.errors?.contactPhone}
              label="Telepon Kontak"
              name="contactPhone"
              placeholder="081234567890"
              defaultValue={ukm?.contactPhone ?? ""}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-status`}>Status</Label>
              <select
                className="focus-ring h-10 w-full rounded-md px-3 text-sm text-white glass"
                defaultValue={ukm?.status ?? "ACTIVE"}
                id={`${mode}-status`}
                name="status"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <Field
              label="Tanggal Berdiri"
              name="establishedAt"
              type="date"
              defaultValue={ukm?.establishedAt ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-description`}>Deskripsi</Label>
            <textarea
              className="focus-ring min-h-28 w-full rounded-md px-3 py-2 text-sm text-white transition-colors placeholder:text-white/[0.55] glass"
              defaultValue={ukm?.description ?? ""}
              id={`${mode}-description`}
              name="description"
              placeholder="Deskripsi singkat UKM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-logo`}>Logo UKM</Label>
            <label
              className={cn(
                "flex min-h-24 cursor-pointer items-center gap-4 rounded-md p-4 text-sm text-white glass transition-colors",
                state.errors?.logo && "border-destructive",
              )}
              htmlFor={`${mode}-logo`}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ImagePlus className="size-5" />
              </div>
              <div>
                <p className="font-medium text-white">Upload logo</p>
                <p className="mt-1 text-xs text-white/[0.75]">PNG, JPG, WEBP, atau GIF. Maksimal 2MB.</p>
              </div>
            </label>
            <Input accept="image/*" className="hidden" id={`${mode}-logo`} name="logo" type="file" />
            {state.errors?.logo ? <p className="text-xs font-medium text-destructive">{state.errors.logo}</p> : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                <X />
                Batal
              </Button>
            </DialogClose>
            <SubmitButton label={mode === "create" ? "Tambah UKM" : "Simpan Perubahan"} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  error,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
}) {
  const id = props.id ?? String(props.name);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input className={cn(error && "border-destructive focus-visible:ring-destructive")} id={id} {...props} />
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
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
