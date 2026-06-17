import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      alt={alt}
      className={cn("h-9 w-9 rounded-full border border-line object-cover", className)}
      {...props}
    />
  );
}
