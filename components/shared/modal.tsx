import { X } from "lucide-react";

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

type ModalProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  actionLabel?: string;
};

export function Modal({ actionLabel = "Simpan", children, description, title, trigger }: ModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div>{children}</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              <X />
              Batal
            </Button>
          </DialogClose>
          <Button type="button">{actionLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
