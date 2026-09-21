import { cn } from "@/lib/cn";

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  items: { id: T; label: string }[];
  className?: string;
}

export function Tabs<T extends string>({
  value,
  onChange,
  items,
  className,
}: TabsProps<T>) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto rounded-md border border-border bg-input p-1",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
            value === item.id
              ? "bg-elevated text-primary"
              : "text-muted hover:text-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
