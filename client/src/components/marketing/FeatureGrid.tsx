import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Extra content under the description (e.g. a checklist) */
  details?: ReactNode;
}

const COLUMNS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/** Hairline-ruled grid of numbered features: no floating cards, no icon bubbles. */
export function FeatureGrid({ items, columns = 3 }: { items: Feature[]; columns?: 2 | 3 | 4 }) {
  return (
    <div className={cn("grid gap-px overflow-hidden rounded-lg border bg-border", COLUMNS[columns])}>
      {items.map((feature, i) => (
        <div key={feature.title} className="flex flex-col bg-card p-6 lg:p-7">
          <div className="flex items-center justify-between">
            <feature.icon className="h-5 w-5 text-primary dark:text-accent" strokeWidth={1.75} />
            <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="mt-6 text-xl font-bold leading-tight">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
          {feature.details && <div className="mt-5">{feature.details}</div>}
        </div>
      ))}
    </div>
  );
}

/** Short list with diamond bullets. */
export function DiamondList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/85">
          <span className="diamond h-1.5 w-1.5 bg-accent" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
