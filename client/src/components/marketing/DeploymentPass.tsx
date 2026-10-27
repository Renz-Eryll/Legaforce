import type { ReactNode } from "react";
import { BadgeCheck, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

type StopState = "done" | "current" | "next";

const STOPS: { label: string; state: StopState }[] = [
  { label: "Applied", state: "done" },
  { label: "Interview", state: "done" },
  { label: "Medical", state: "done" },
  { label: "Visa", state: "current" },
  { label: "Flight", state: "next" },
];

function Airport({ label, code, city, align = "left" }: { label: string; code: string; city: string; align?: "left" | "right" }) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <p className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-[44px] font-extrabold leading-none tracking-tight">{code}</p>
      <p className="mt-1 text-xs text-muted-foreground">{city}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 border-l px-4 py-3 first:border-l-0 sm:px-5">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold">{children}</dd>
    </div>
  );
}

/** Illustration of the applicant tracker, styled as a boarding pass. */
export function DeploymentPass({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Sample deployment tracker: Manila to Dubai, staff nurse, visa in review"
      className={cn("relative mx-auto w-full max-w-[460px]", className)}
    >
      <div className="overflow-hidden rounded-lg border border-border-strong/70 bg-card shadow-2xl">
        <div className="flex items-center justify-between gap-4 bg-sidebar px-5 py-3 text-sidebar-foreground">
          <span className="flex items-baseline gap-2">
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.06em]">
              Lega<span className="text-accent">force</span>
            </span>
            <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-sidebar-muted">DEPLOYMENT PASS</span>
          </span>
          <span className="font-mono text-[11px] text-sidebar-muted">LF-26-04817</span>
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] items-end gap-3 px-5 pb-7 pt-6 sm:gap-4">
          <Airport label="FROM" code="MNL" city="Manila, PH" />
          <div className="relative mb-6 flex items-center">
            <span className="h-0 flex-1 border-t-2 border-dashed border-border-strong" />
            <Plane className="mx-2 h-4 w-4 text-primary dark:text-accent" strokeWidth={2} />
            <span className="h-0 flex-1 border-t-2 border-dashed border-border-strong" />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10.5px] text-muted-foreground">
              DAY 18 · EST. 24
            </span>
          </div>
          <Airport label="TO" code="DXB" city="Dubai, UAE" align="right" />
        </div>

        <dl className="grid grid-cols-3 border-y">
          <Field label="Position">Staff Nurse</Field>
          <Field label="Employer">
            <span className="inline-flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5 text-success" /> Verified
            </span>
          </Field>
          <Field label="Placement fee">
            <span className="font-mono">₱0</span>
          </Field>
        </dl>

        <div className="px-5 py-5">
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-muted-foreground">PROGRESS</p>
          <ol className="mt-4 grid grid-cols-5">
            {STOPS.map((stop, i) => (
              <li key={stop.label} className="relative flex flex-col items-center gap-2 text-center">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute right-1/2 top-[6px] w-full border-t-2",
                      stop.state === "next" ? "border-dashed border-border-strong" : "border-primary dark:border-accent",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 h-3.5 w-3.5 rotate-45 border-2",
                    stop.state === "done" && "border-primary bg-primary dark:border-accent dark:bg-accent",
                    stop.state === "current" && "border-accent bg-accent ring-4 ring-accent/25",
                    stop.state === "next" && "border-border-strong bg-card",
                  )}
                />
                <span className={cn("text-[11px] font-semibold", stop.state === "next" && "text-muted-foreground")}>
                  {stop.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Perforation: the card clips these circles into ticket notches */}
        <div className="relative border-t-2 border-dashed border-border">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-border-strong/70 bg-background" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-border-strong/70 bg-background" />
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-success" />
            </span>
            Visa in review · updated 2h ago
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">NEXT: PDOS</span>
        </div>
      </div>

      <div className="absolute -top-5 right-6 hidden items-center gap-2.5 rounded-md border bg-card px-3 py-2 text-xs shadow-lg xl:flex">
        <span className="diamond bg-success" aria-hidden="true" />
        <span className="font-semibold">Medical cleared</span>
        <span className="font-mono text-muted-foreground">14 MAR</span>
      </div>
    </div>
  );
}
