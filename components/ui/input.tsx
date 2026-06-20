import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      className={cn(
        "focus-ring flex h-10 w-full rounded-md px-3 py-2 text-sm text-white placeholder:text-white/[0.55] shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 glass",    
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
