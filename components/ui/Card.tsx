import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        elevated
          ? "rounded-lg border border-border-subtle bg-elevated"
          : "rounded-xl border border-border bg-surface",
        className,
      )}
      {...props}
    />
  );
}
