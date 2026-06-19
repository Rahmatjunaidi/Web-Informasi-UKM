import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      className={cn(
        "focus-ring flex h-10 w-full rounded-md border border-slate-200/80 bg-white/75 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
