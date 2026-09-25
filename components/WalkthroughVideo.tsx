import { cn } from "@/lib/cn";

export function WalkthroughVideo({
  autoPlay = false,
  fill = false,
}: {
  autoPlay?: boolean;
  fill?: boolean;
}) {
  return (
    <div
      className={cn(
        fill
          ? "h-[90vh] w-[90vw]"
          : "overflow-hidden rounded-xl border border-border-subtle bg-input",
      )}
    >
      <video
        className={
          fill
            ? "h-full w-full rounded-2xl object-contain shadow-lg"
            : "aspect-video w-full"
        }
        controls
        playsInline
        autoPlay={autoPlay}
        muted={false}
        loop={autoPlay}
        preload={autoPlay ? "auto" : "metadata"}
        title="Prepto AI walkthrough"
      >
        <source src="/video/hero.webm" type="video/webm" />
      </video>
    </div>
  );
}
