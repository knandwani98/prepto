import { BackLink } from "@/components/BackLink";
import { WalkthroughVideo } from "@/components/WalkthroughVideo";

export default function DemoPage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="relative">
        <div className="absolute bottom-full left-0 z-10 mb-2">
          <BackLink href="/">Back to site</BackLink>
        </div>
        <WalkthroughVideo autoPlay fill />
      </div>
    </div>
  );
}
