"use client"

import { MarketingFooter } from "@/components/marketing/MarketingFooter"
import { MarketingNav } from "@/components/marketing/MarketingNav"

// Shared layout for the legal documents (Privacy Policy, Terms & Conditions).
// A dark statement header carries the title; the body is a single readable
// prose column with numbered sections, sub-headings, and lists — built from
// the design-system tokens, with the full site nav and footer.

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "subheading"; text: string }
  | { type: "ul"; items: string[] }

export interface LegalSection {
  heading?: string
  blocks: LegalBlock[]
}

export interface LegalDoc {
  title: string
  /** Short line shown under the title in the header. */
  intro?: string
  /** Lead paragraphs/blocks before the first numbered section. */
  introBlocks?: LegalBlock[]
  sections?: LegalSection[]
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "subheading") {
    return (
      <h3 className="pt-2 text-base font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        {block.text}
      </h3>
    )
  }
  if (block.type === "ul") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-[var(--text-body)] marker:text-[var(--text-muted)]">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  }
  return (
    <p className="text-[15px] leading-[1.75] text-[var(--text-body)]">
      {block.text}
    </p>
  )
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div
      className="bg-[var(--bg-page)] font-sans"
      style={{ "--border-default": "rgba(226,226,231,0.6)" } as React.CSSProperties}
    >
      <MarketingNav
        onScheduleClick={() => {
          window.location.href = "/#book"
        }}
      />

      {/* Header — dark statement band with the document title */}
      <header
        data-section-bg="dark"
        className="relative overflow-hidden bg-[var(--bg-brand)] px-6 pb-16 pt-32 text-center lg:pb-20 lg:pt-40"
      >
        {/* soft cobalt glow pooled behind the title */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 mx-auto h-64 w-[80%]"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, rgba(73,79,223,0.22), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-[clamp(36px,6vw,64px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            {doc.title}
          </h1>
          {doc.intro && (
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.6] text-white/60 lg:text-base">
              {doc.intro}
            </p>
          )}
        </div>
      </header>

      {/* Body — single prose column */}
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        {doc.introBlocks && doc.introBlocks.length > 0 && (
          <div className="space-y-4">
            {doc.introBlocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        )}

        {doc.sections?.map((section, i) => (
          <section key={i} className="mt-12">
            {section.heading && (
              <h2 className="text-[clamp(20px,2.4vw,26px)] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {section.heading}
              </h2>
            )}
            <div className="mt-4 space-y-4">
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <MarketingFooter />
    </div>
  )
}
