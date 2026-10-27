import { cn } from "@/lib/utils";

export interface RouteStep {
  title: string;
  description?: string;
}

const COLUMNS: Record<number, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

/**
 * A process drawn as a travel route: dashed line, a diamond per stop,
 * the last stop (deployment) filled orange. Vertical on small screens.
 */
export function RouteSteps({ steps, tone = "light" }: { steps: RouteStep[]; tone?: "light" | "dark" }) {
  const onDark = tone === "dark";

  return (
    <ol className={cn("grid md:gap-6", COLUMNS[steps.length] ?? COLUMNS[4])}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0 md:flex-col md:gap-5 md:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute border-dashed",
                  "bottom-0 left-[7px] top-6 border-l-2",
                  "md:-right-6 md:bottom-auto md:left-7 md:top-[7px] md:border-l-0 md:border-t-2",
                  onDark ? "border-sidebar-border" : "border-border-strong",
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 mt-1 h-4 w-4 shrink-0 rotate-45 border-2 md:mt-0",
                isLast
                  ? "border-accent bg-accent"
                  : onDark
                    ? "border-sidebar-foreground bg-sidebar"
                    : "border-primary bg-background dark:border-primary",
              )}
            />
            <div className="min-w-0">
              <p
                className={cn(
                  "font-mono text-[11px] font-semibold tracking-[0.14em]",
                  onDark ? "text-sidebar-muted" : "text-muted-foreground",
                )}
              >
                STEP {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className={cn(
                  "mt-1.5 text-xl font-extrabold uppercase leading-tight",
                  onDark && "text-sidebar-foreground",
                )}
              >
                {step.title}
              </h3>
              {step.description && (
                <p
                  className={cn(
                    "mt-2 max-w-xs text-sm leading-relaxed",
                    onDark ? "text-sidebar-muted" : "text-muted-foreground",
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
