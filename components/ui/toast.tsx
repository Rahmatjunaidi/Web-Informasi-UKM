"use client";

import * as React from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";

type Toast = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastContextValue = {
  toast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback(
    (nextToast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((items) => [...items, { ...nextToast, id }]);
      window.setTimeout(() => removeToast(id), 4200);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-4 top-4 z-[70] grid w-[calc(100%-2rem)] gap-3 sm:w-96">
        {toasts.map((item) => {
          const Icon = item.type === "success" ? CheckCircle2 : XCircle;

          return (
            <div
              className={cn(
                "glass-panel flex items-start gap-3 rounded-lg p-4 shadow-xl",
                item.type === "success" ? "border-emerald-200/70" : "border-rose-200/70",
              )}
              key={item.id}
            >
              <Icon
                className={cn("mt-0.5 size-5 shrink-0", item.type === "success" ? "text-emerald-600" : "text-rose-600")}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm leading-5 text-muted-foreground">{item.description}</p> : null}
              </div>
              <Button aria-label="Tutup notifikasi" onClick={() => removeToast(item.id)} size="icon" type="button" variant="ghost">
                <X />
              </Button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
