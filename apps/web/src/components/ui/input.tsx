import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-line bg-white/[0.04] px-3 text-sm text-ink outline-none placeholder:text-muted transition focus:border-blaze/60 focus:bg-white/[0.06]",
        className
      )}
      {...props}
    />
  );
}
