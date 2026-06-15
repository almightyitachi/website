const LOGOS = [
  "Infosys",
  "TCS",
  "Wipro",
  "Deloitte",
  "KPMG",
  "Accenture",
  "Capgemini",
  "HCL",
  "EY",
  "Cognizant",
]

// Horizontal infinite scroll of company wordmarks. Reuses the .ticker-track
// keyframe in globals.css — same pattern as the existing logo strip.
// Wordmarks render in muted zinc so they read as a quiet trust band, not as
// a featured callout.
export function TrustLogoMarquee() {
  return (
    <div className="py-14 lg:py-20">
      <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        Trusted by recruiters at
      </p>
      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="ticker-track flex w-max items-center gap-16 whitespace-nowrap">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-lg font-semibold tracking-tight text-[var(--color-neutral-300)] transition-colors hover:text-[var(--color-neutral-500)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
