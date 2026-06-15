interface HoverLogoCardProps {
  wordmark: string
  stat: string
  label: string
}

// Opacity-swap flip card. Front shows the wordmark; on hover the back
// face reveals the stat. Pure CSS via group-hover — no JS state.
export function HoverLogoCard({ wordmark, stat, label }: HoverLogoCardProps) {
  return (
    <div className="group relative h-24 cursor-default overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-colors hover:border-[var(--border-strong)]">
      {/* Front — wordmark */}
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
        <span className="text-lg font-semibold tracking-tight text-[var(--color-neutral-700)]">
          {wordmark}
        </span>
      </div>
      {/* Back — stat */}
      <div className="absolute inset-0 flex translate-y-1 flex-col items-center justify-center px-3 text-center opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-base font-bold tracking-tight tabular-nums text-[var(--text-brand)]">
          {stat}
        </p>
        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  )
}
