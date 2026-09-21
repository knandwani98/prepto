import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-border bg-input px-3 py-2.5 text-[15px] leading-6 text-foreground placeholder:text-disabled focus:border-primary focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
