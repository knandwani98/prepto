import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "success" | "info" | "gold" | "danger";

const tones: Record<Tone, string> = {
  default: "border-border-strong bg-input text-foreground-secondary",
  success: "border-primary/30 bg-primary/10 text-primary",
  info: "border-secondary/30 bg-secondary/10 text-secondary",
  gold: "border-gold/30 bg-gold/10 text-gold",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-[9px] py-[5px] text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
