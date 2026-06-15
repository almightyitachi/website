"use client"

import { AlertTriangle, Check, ShieldCheck } from "lucide-react"

import { useColorIteration } from "@/components/platform/ColorIterationSwitcher"
import { cn } from "@/lib/utils"

// Four real-looking audit log rows, one flagged. Times look like an actual
// drive in progress, not "Lorem timestamps".
const AUDIT_LOG = [
  {
    time: "14 Apr · 11:42:08",
    candidate: "Aarav Rao",
    college: "IIT Bombay",
    score: 94,
    band: "Top 1%",
    status: "clean" as const,
    note: "Proctored · no flag",
  },
  {
    time: "14 Apr · 11:43:21",
    candidate: "Priya Sharma",
    college: "BITS Pilani",
    score: 91,
    band: "Top 5%",
    status: "clean" as const,
    note: "Proctored · no flag",
  },
  {
    time: "14 Apr · 11:44:10",
    candidate: "Vivek Mehta",
    college: "NIT Trichy",
    score: 88,
    band: "Top 10%",
    status: "flagged" as const,
    note: "Tab-switch ×2 · 02:14, 04:47",
  },
  {
    time: "14 Apr · 11:45:33",
    candidate: "Deepika Kumar",
    college: "IIIT Hyderabad",
    score: 84,
    band: "Top 10%",
    status: "clean" as const,
    note: "Proctored · no flag",
  },
]

const EEO_GENDER = [
  { label: "Female",     applied: 4892, shortlist: 1180 },
  { label: "Male",       applied: 6124, shortlist: 1250 },
  { label: "Non-binary", applied: 42,   shortlist: 11 },
]

const EEO_TIER = [
  { label: "Tier 1 institutions",     pct: 52 },
  { label: "Tier 2 institutions",     pct: 34 },
  { label: "Tier 3 / state-board",    pct: 14 },
]

export function AuditTrailEvidence() {
  const colorIter = useColorIteration()
  const tierBarColor =
    colorIter === "multi" ? "var(--color-brand-amber)" : "var(--color-primary-600)"
  const monitorBarColor =
    colorIter === "multi" ? "var(--color-brand-navy)" : "var(--color-primary-600)"
  return (
    <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr] lg:gap-6">
      {/* ─── Audit log — primary panel ─── */}
      <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-[var(--color-primary-600)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Drive 1742 · Audit log
            </p>
          </div>
          <p className="hidden font-mono text-[11px] text-[var(--text-muted)] sm:block">
            Senior PM · Growth · 4 of 8,142
          </p>
        </div>

        <ul className="divide-y divide-[var(--border-default)]">
          {AUDIT_LOG.map((row) => (
            <li
              key={row.candidate}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 px-5 py-3 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-x-4 sm:py-3.5"
            >
              <p className="col-span-3 font-mono text-[10px] text-[var(--text-muted)] sm:col-span-1 sm:text-[11px]">
                {row.time}
              </p>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {row.candidate}{" "}
                  <span className="font-normal text-[var(--text-muted)]">
                    · {row.college}
                  </span>
                </p>
                <p className="truncate text-xs text-[var(--text-muted)]">
                  {row.note}
                </p>
              </div>
              <span className="rounded-sm bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] font-medium tabular-nums text-[var(--text-body)]">
                {row.score}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-medium",
                  row.status === "flagged"
                    ? "bg-[var(--bg-warning-subtle)] text-[var(--color-warning)]"
                    : "bg-[var(--bg-success-subtle)] text-[var(--color-success)]"
                )}
              >
                {row.status === "flagged" ? (
                  <AlertTriangle size={11} />
                ) : (
                  <Check size={11} />
                )}
                {row.band}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-1 border-t border-[var(--border-default)] px-5 py-3 font-mono text-[10px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
          <span>
            Auto-exported to{" "}
            <span className="text-[var(--text-body)]">
              audit/2026-04-14-drive-1742.csv
            </span>
          </span>
          <span>8,142 rows · 4.2 MB · SHA-256 verified</span>
        </div>
      </div>

      {/* ─── EEO + Live monitor stack ─── */}
      <div className="flex flex-col gap-5 lg:gap-6">
        {/* EEO breakdown */}
        <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 shadow-sm">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              EEO report · Q1 export
            </p>
            <span className="rounded-sm bg-[var(--bg-success-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-success)]">
              Ready
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Aggregate only. Individual demographics are never available.
          </p>

          <table className="mt-4 w-full text-left font-mono text-[11px] tabular-nums">
            <thead className="text-[var(--text-muted)]">
              <tr>
                <th className="pb-2 font-medium">Gender</th>
                <th className="pb-2 text-right font-medium">Applied</th>
                <th className="pb-2 text-right font-medium">Shortlist</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-body)]">
              {EEO_GENDER.map((row) => (
                <tr
                  key={row.label}
                  className="border-t border-[var(--border-default)]"
                >
                  <td className="py-1.5">{row.label}</td>
                  <td className="py-1.5 text-right">
                    {row.applied.toLocaleString("en-IN")}
                  </td>
                  <td className="py-1.5 text-right">
                    {row.shortlist.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-5 text-[11px] font-medium text-[var(--text-muted)]">
            Institution tier
          </p>
          <ul className="mt-2.5 space-y-2">
            {EEO_TIER.map((row) => (
              <li key={row.label} className="flex items-center gap-3">
                <span className="flex-1 truncate text-xs text-[var(--text-body)]">
                  {row.label}
                </span>
                <div className="relative h-1.5 w-20 overflow-hidden rounded-sm bg-[var(--bg-surface)]">
                  <span
                    className="absolute inset-y-0 left-0"
                    style={{ width: `${row.pct}%`, background: tierBarColor }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[11px] tabular-nums text-[var(--text-muted)]">
                  {row.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Live drive monitor */}
        <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 shadow-sm">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Live drive · monitor
            </p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-[var(--color-success)]" />
              </span>
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                In progress
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { v: "142",   l: "In progress", c: "text-[var(--text-primary)]" },
              { v: "12",    l: "Flagged",     c: "text-[var(--color-warning)]" },
              { v: "1,830", l: "Submitted",   c: "text-[var(--text-primary)]" },
            ].map((k) => (
              <div key={k.l}>
                <p
                  className={cn(
                    "text-lg font-bold leading-none tabular-nums",
                    k.c
                  )}
                >
                  {k.v}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  {k.l}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex h-1.5 overflow-hidden rounded-sm bg-[var(--bg-surface)]">
              <div style={{ width: "71%", background: monitorBarColor }} />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
              <span>71% submitted</span>
              <span>Auto-save 30s · Reconnect on drop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
