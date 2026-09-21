"use client";

import Image from "next/image";
import logoOnly from "@/public/brand/logo-only.png";
import { cn } from "@/lib/cn";

export function BrandMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logoOnly}
      alt=""
      className={cn("shrink-0 overflow-hidden rounded-lg", className)}
      sizes="56px"
      aria-hidden="true"
      priority={priority}
    />
  );
}
