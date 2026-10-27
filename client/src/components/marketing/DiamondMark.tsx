import { cn } from "@/lib/utils";

/** Outline of the logo (diamond body + dot), used large and faint as a watermark. */
export function DiamondMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 132" fill="none" aria-hidden="true" className={cn("pointer-events-none", className)}>
      <rect
        x="24"
        y="36"
        width="72"
        height="72"
        rx="12"
        transform="rotate(45 60 72)"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path d="M44 72h18v18" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" />
      <circle cx="60" cy="16" r="11" stroke="currentColor" strokeWidth="9" />
    </svg>
  );
}
