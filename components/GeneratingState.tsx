import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { Progress } from "./ui/Progress";
import { Skeleton } from "./ui/Skeleton";
import type { KitStatus } from "@/lib/types";

const steps: { id: KitStatus; label: string }[] = [
  { id: "queued", label: "Queued" },
  { id: "researching", label: "Crawling company site" },
  { id: "generating", label: "Writing your kit" },
  { id: "ready", label: "Ready" },
];

function stepIndex(status: KitStatus) {
  const index = steps.findIndex((step) => step.id === status);
  return index < 0 ? 0 : index;
}

export function GeneratingState({
  status,
  companyName,
}: {
  status: KitStatus;
  companyName?: string;
}) {
  const current = stepIndex(status);
  const percent = ((current + 1) / steps.length) * 100;

  return (
    <Card className="p-6 sm:p-8">
      <p className="text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
        Researching
      </p>
      <h1 className="mt-2 text-[27px] font-bold">
        Building {companyName ? `${companyName}'s` : "your"} prep kit
      </h1>
      <p className="mt-2 text-[15px] text-muted">
        This usually takes under a minute. Stay on this page — it will refresh
        when the kit is ready.
      </p>
      <Progress value={percent} className="mt-6" />
      <ol className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center gap-3 text-sm">
            <span
              className={
                index <= current
                  ? "text-primary"
                  : "text-disabled"
              }
            >
              {index < current ? "✓" : index === current ? "●" : "○"}
            </span>
            <span className={index <= current ? "text-foreground" : "text-muted"}>
              {step.label}
            </span>
            {index === current ? <Badge tone="info">In progress</Badge> : null}
          </li>
        ))}
      </ol>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </Card>
  );
}
