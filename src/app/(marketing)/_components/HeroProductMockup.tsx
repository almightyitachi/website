"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { Check, Search } from "lucide-react"

import { useColorIteration } from "@/components/platform/ColorIterationSwitcher"
import { cn } from "@/lib/utils"

interface Candidate {
  initials: string
  name: string
  college: string
  score: number
  status: "Onboarded" | "Offered" | "Interview" | "Vetted" | "Applied"
}

const CANDIDATES: Candidate[] = [
  { initials: "AR", name: "Aarav Rao",      college: "IIT Bombay",       score: 94, status: "Offered" },
  { initials: "PS", name: "Priya Sharma",   college: "BITS Pilani",      score: 91, status: "Vetted" },
  { initials: "VM", name: "Vivek Mehta",    college: "NIT Trichy",       score: 88, status: "Interview" },
  { initials: "DK", name: "Deepika Kumar",  college: "IIIT Hyderabad",   score: 84, status: "Vetted" },
  { initials: "SR", name: "Sahana R",       college: "VIT Vellore",      score: 81, status: "Applied" },
]

const STATUS_STYLES: Record<Candidate["status"], string> = {
  Onboarded: "bg-[var(--bg-brand-subtle)] text-[var(--color-primary-700)]",
  Offered:   "bg-[var(--bg-brand-subtle)] text-[var(--color-primary-700)]",
  Interview: "bg-[var(--bg-warning-subtle)] text-[var(--color-warning)]",
  Vetted:    "bg-[var(--bg-success-subtle)] text-[var(--color-success)]",
  Applied:   "bg-[var(--bg-surface)] text-[var(--text-muted)]",
}

// A faithful slice of the in-product role/candidate view. Drawn entirely in
// HTML/CSS so it reads as a real screenshot of PluginLive rather than a
// generic SaaS placeholder.
export function HeroProductMockup() {
  const colorIter = useColorIteration()
  const reduce = useReducedMotion()
  const pipelineMidColor =
    colorIter === "multi" ? "var(--color-brand-amber)" : "var(--color-primary-600)"
  const pipelineEndColor =
    colorIter === "multi" ? "var(--color-brand-navy)" : "var(--color-primary-800)"

  // Ambient activity: a soft cobalt highlight cycles through the
  // candidate rows so the surface reads as a live drive being worked on.
  // Pointer hover overrides the ambient highlight for the row under it.
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % CANDIDATES.length),
      2200,
    )
    return () => clearInterval(id)
  }, [reduce])
  return (
    <div className="relative">
      {/* Soft brand glow behind the mockup */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 translate-x-6 translate-y-10 scale-95 rounded-md opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(73, 79, 223, 0.18), transparent 70%)",
        }}
      />

      <div className="overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-[0_32px_80px_-12px_rgba(15,15,15,0.18),0_8px_24px_-8px_rgba(15,15,15,0.08)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ED6A5E]" />
            <span className="size-2.5 rounded-full bg-[#F4BF4F]" />
            <span className="size-2.5 rounded-full bg-[#61C554]" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-sm bg-[var(--bg-elevated)] px-3 py-1 text-xs text-[var(--text-muted)]">
            <Search size={11} className="shrink-0" />
            app.pluginlive.com/roles/senior-backend-engineer
          </div>
        </div>

        {/* Mockup body */}
        <div className="p-5 lg:p-6">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  color:
                    colorIter === "multi"
                      ? "var(--color-brand-orange)"
                      : "var(--color-primary-600)",
                }}
              >
                Active drive
              </p>
              <p className="mt-1 text-base font-semibold leading-tight tracking-tight text-[var(--text-primary)]">
                Senior Software Engineer · Backend
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                Full-time · Posted 15 Apr · Closes in 12 days
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[10px] font-semibold"
              style={
                colorIter === "multi"
                  ? {
                      background: "var(--color-brand-amber-subtle)",
                      color: "var(--color-brand-navy)",
                    }
                  : {
                      background: "var(--bg-brand-subtle)",
                      color: "var(--color-primary-700)",
                    }
              }
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              Open
            </span>
          </div>

          {/* KPI row */}
          <div className="mt-5 grid grid-cols-3 gap-3 rounded-md bg-[var(--bg-surface)] p-3">
            {[
              { value: "124", label: "Applicants" },
              { value: "43",  label: "Vetted" },
              { value: "3",   label: "Offered" },
            ].map((k) => (
              <div key={k.label}>
                <p className="text-lg font-bold leading-none tabular-nums text-[var(--text-primary)]">
                  {k.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  {k.label}
                </p>
              </div>
            ))}
          </div>

          {/* Pipeline bar */}
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Pipeline
              </p>
              <p className="text-[10px] tabular-nums text-[var(--text-muted)]">
                2.4% conversion · onboarded
              </p>
            </div>
            <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-sm">
              <div className="h-full" style={{ width: "65%", background: "var(--color-neutral-300)" }} />
              <div className="h-full" style={{ width: "20%", background: "var(--color-primary-300)" }} />
              <div className="h-full" style={{ width: "9%",  background: "var(--color-warning)" }} />
              <div className="h-full" style={{ width: "4%",  background: pipelineMidColor }} />
              <div className="h-full" style={{ width: "2%",  background: pipelineEndColor }} />
            </div>
          </div>

          {/* Candidates list */}
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Top candidates · ranked
            </p>
            <div className="mt-2 divide-y divide-[var(--border-default)] rounded-md border border-[var(--border-default)]">
              {CANDIDATES.map((c, i) => {
                const isHover = hoverIdx === i
                const isAmbient = hoverIdx === null && activeIdx === i
                const isLit = isHover || isAmbient
                return (
                  <div
                    key={c.name}
                    onMouseEnter={() => setHoverIdx(i)}
                    onMouseLeave={() => setHoverIdx(null)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 transition-colors duration-300",
                      isLit && "bg-[var(--color-primary-50)]",
                    )}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-[var(--bg-brand-subtle)] text-[11px] font-semibold text-[var(--color-primary-700)]">
                      {c.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                        {c.name}
                      </p>
                      <p className="truncate text-[10px] text-[var(--text-muted)]">
                        {c.college}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold tabular-nums transition-colors",
                        isLit
                          ? "text-[var(--color-primary-700)]"
                          : "text-[var(--text-primary)]",
                      )}
                    >
                      {c.score}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium",
                        STATUS_STYLES[c.status],
                      )}
                    >
                      {c.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer link row */}
          <div className="mt-4 flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-success)]">
              <Check size={12} />
              All 124 verified through proctored assessment
            </p>
            <button
              type="button"
              className="text-[11px] font-medium text-[var(--text-brand)] hover:underline"
            >
              View all 124 →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
