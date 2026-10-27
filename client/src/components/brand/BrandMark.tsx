import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** "dark" = placed on the navy rail/footer/auth panel */
  tone?: "light" | "dark";
  /** Small caps line under the wordmark */
  tagline?: string;
  to?: string;
  className?: string;
}

/** Logo + LEGAFORCE wordmark, split navy/orange like the office signage. */
export function BrandMark({ tone = "light", tagline, to = "/", className }: BrandMarkProps) {
  const onDark = tone === "dark";

  return (
    <Link to={to} className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Legaforce home">
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-md",
          // The navy mark disappears on navy, so it sits on a paper tile there
          onDark ? "bg-card" : "bg-transparent",
        )}
      >
        <img src="/legaforce-logo.png" alt="" className="h-7 w-auto" width={26} height={28} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[21px] font-extrabold uppercase tracking-[0.04em]",
            onDark ? "text-sidebar-foreground" : "text-primary dark:text-foreground",
          )}
        >
          Lega<span className="text-accent">force</span>
        </span>
        {tagline && (
          <span
            className={cn(
              "mt-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.2em]",
              onDark ? "text-sidebar-muted" : "text-muted-foreground",
            )}
          >
            {tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
