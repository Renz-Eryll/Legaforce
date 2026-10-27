import { cn } from "@/lib/utils";

export interface Quote {
  quote: string;
  name: string;
  role: string;
  /** Two-letter initials or a short company code */
  initials: string;
}

export function QuoteCard({ quote, name, role, initials, featured = false }: Quote & { featured?: boolean }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between gap-10 rounded-lg border p-6 lg:p-8",
        featured ? "border-sidebar-border bg-sidebar text-sidebar-foreground" : "bg-card",
      )}
    >
      <blockquote
        className={cn(
          "leading-relaxed",
          featured ? "font-display text-2xl font-semibold leading-snug lg:text-[28px]" : "text-[17px] text-foreground/90",
        )}
      >
        <span className="text-accent">“</span>
        {quote}
        <span className="text-accent">”</span>
      </blockquote>
      <figcaption
        className={cn("flex items-center gap-3 border-t pt-5", featured ? "border-sidebar-border" : "border-border")}
      >
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-md font-mono text-xs font-semibold",
            featured ? "bg-sidebar-accent text-accent" : "bg-muted text-primary dark:text-accent",
          )}
        >
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold">{name}</span>
          <span
            className={cn(
              "block font-mono text-[11px] uppercase tracking-[0.1em]",
              featured ? "text-sidebar-muted" : "text-muted-foreground",
            )}
          >
            {role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
