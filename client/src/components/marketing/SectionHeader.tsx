import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned slot (a link or button) */
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, action, tone = "light", className }: SectionHeaderProps) {
  const onDark = tone === "dark";

  return (
    <Reveal className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className={cn("eyebrow", onDark && "text-sidebar-muted")}>{eyebrow}</p>}
        <h2
          className={cn(
            "mt-3 font-display text-[32px] font-extrabold uppercase leading-[0.95] sm:text-4xl lg:text-[44px]",
            onDark && "text-sidebar-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-[17px]",
              onDark ? "text-sidebar-muted" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/** Part of a heading set in the brand colour. */
export function Highlight({ children }: { children: ReactNode }) {
  return <span className="text-primary dark:text-accent">{children}</span>;
}
