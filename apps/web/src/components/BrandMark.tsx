import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-6 w-6",
  md: "h-9 w-9",
  lg: "h-12 w-12",
  xl: "h-16 w-16"
};

export function BrandMark({
  size = "md",
  className
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <img
      src="/brand/blaze-creator-os-mark.png"
      alt="Blaze Creator Intelligence"
      className={cn("brand-logo shrink-0 object-contain", sizes[size], className)}
    />
  );
}
