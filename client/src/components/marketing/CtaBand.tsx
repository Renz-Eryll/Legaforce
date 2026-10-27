import type { ReactNode } from "react";
import { DiamondMark } from "./DiamondMark";
import { Reveal } from "./Reveal";

interface CtaBandProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions: ReactNode;
}

/** Closing call to action on the navy rail colour. */
export function CtaBand({ eyebrow, title, description, actions }: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
      <DiamondMark className="absolute -bottom-40 -right-20 h-[480px] w-[480px] text-white/[0.045]" />
      <div className="container relative grid gap-10 py-20 lg:grid-cols-12 lg:items-end lg:py-24">
        <Reveal className="lg:col-span-8">
          {eyebrow && <p className="eyebrow text-sidebar-muted">{eyebrow}</p>}
          <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.95] text-sidebar-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sidebar-muted">{description}</p>}
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-4 lg:justify-self-end">
          {actions}
        </Reveal>
      </div>
    </section>
  );
}
