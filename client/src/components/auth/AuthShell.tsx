import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { DiamondMark } from "@/components/marketing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AuthShellProps {
  /** Left (navy) panel copy, desktop only */
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  panelExtra?: ReactNode;
  /** The form column */
  children: ReactNode;
}

/** Shared frame for sign in, sign up and email verification. */
export function AuthShell({ eyebrow, title, description, panelExtra, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex xl:p-14">
        <DiamondMark className="absolute -bottom-32 -right-28 h-[520px] w-[520px] text-white/[0.04]" />
        <BrandMark tone="dark" tagline="Manpower Recruitment" className="relative" />
        <div className="relative">
          <p className="eyebrow text-sidebar-muted">{eyebrow}</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.92] text-sidebar-foreground xl:text-6xl">
            {title}
          </h1>
          {description && <p className="mt-5 max-w-sm text-base leading-relaxed text-sidebar-muted">{description}</p>}
          {panelExtra && <div className="mt-10">{panelExtra}</div>}
        </div>
        <p className="relative font-mono text-[11px] text-sidebar-muted">
          © {new Date().getFullYear()} Legaforce · POEA licensed platform
        </p>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="flex h-16 items-center justify-between px-5 sm:px-10">
          <div className="lg:invisible">
            <BrandMark />
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <main className="flex flex-1 items-center justify-center px-5 pb-16 pt-6 sm:px-10">{children}</main>
      </div>
    </div>
  );
}

/** Form heading used inside the shell. */
export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-[34px] font-extrabold uppercase leading-none">{title}</h2>
      {children && <p className="mt-3 text-[15px] text-muted-foreground">{children}</p>}
    </div>
  );
}

/** Spinner shown inside submit buttons while a request is running. */
export function ButtonSpinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />;
}
