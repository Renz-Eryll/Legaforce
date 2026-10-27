import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DiamondMark } from "./DiamondMark";
import { Reveal } from "./Reveal";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Right column (facts panel, visual) */
  aside?: ReactNode;
  /** Full-width row under the hero (usually a StatStrip) */
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, actions, aside, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <DiamondMark className="absolute -right-24 -top-16 h-[560px] w-[560px] text-primary/[0.035] dark:text-white/[0.03]" />
      <div className="container relative grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <Reveal immediate className={cn(aside ? "lg:col-span-7" : "lg:col-span-10")}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 font-display text-[44px] font-extrabold uppercase leading-[0.92] sm:text-6xl lg:text-[76px]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{description}</p>
          )}
          {actions && <div className="mt-9">{actions}</div>}
        </Reveal>
        {aside && (
          <Reveal immediate delay={0.1} className="lg:col-span-5 lg:self-end">
            {aside}
          </Reveal>
        )}
      </div>
      {children && <div className="container relative pb-16 lg:pb-20">{children}</div>}
    </section>
  );
}
