import { cn } from "@/lib/cn";

export function LandingArt({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "pointer-events-none h-auto w-full max-w-md select-none",
        className,
      )}
      draggable={false}
    />
  );
}
