import { cn } from "@/lib/utils";

export interface Stat {
  value: string;
  label: string;
}

const COLUMNS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/** Ruled row of headline figures. */
export function StatStrip({ items, tone = "light", className }: { items: Stat[]; tone?: "light" | "dark"; className?: string }) {
  const onDark = tone === "dark";

  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border",
        COLUMNS[items.length] ?? COLUMNS[4],
        onDark ? "border-sidebar-border bg-sidebar-border" : "border-border bg-border",
        className,
      )}
    >
      {items.map((stat) => (
        <div
          key={stat.label}
          className={cn("flex flex-col gap-1 px-5 py-5 sm:px-6", onDark ? "bg-sidebar" : "bg-card")}
        >
          <dt
            className={cn(
              "order-2 text-[11px] font-semibold uppercase tracking-[0.1em]",
              onDark ? "text-sidebar-muted" : "text-muted-foreground",
            )}
          >
            {stat.label}
          </dt>
          <dd
            className={cn(
              "order-1 font-mono text-[28px] font-medium leading-tight tracking-tight tabular sm:text-[34px]",
              onDark ? "text-sidebar-foreground" : "text-foreground",
            )}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
