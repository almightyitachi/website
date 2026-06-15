"use client"

import { Check } from "lucide-react"

import { useColorIteration } from "@/components/platform/ColorIterationSwitcher"
import { cn } from "@/lib/utils"

const MULTI_VETTED_COLORS = [
  "var(--color-primary-600)",
  "var(--color-brand-navy)",
  "var(--color-brand-amber)",
  "var(--color-brand-orange)",
] as const

const MULTI_VETTED_BGS = [
  "var(--bg-brand-subtle)",
  "var(--color-brand-navy-subtle)",
  "var(--color-brand-amber-subtle)",
  "var(--color-brand-orange-subtle)",
] as const

interface HexCell {
  initials: string
  role: string
  college: string
  vetted?: boolean
  rotate?: string
}

// 18 cells across 4 honeycomb rows. The 'vetted' cells are sparingly
// placed to read as "some of this pool is highlighted" — they're not
// supposed to be uniform or symmetric.
const CELLS: HexCell[] = [
  // Row 1 (4 cells)
  { initials: "AR", role: "Backend", college: "IIT-B", rotate: "rotate-[-1deg]" },
  { initials: "PS", role: "PM", college: "BITS", vetted: true },
  { initials: "VM", role: "Data", college: "NIT-T", rotate: "rotate-[0.5deg]" },
  { initials: "DK", role: "Design", college: "NID" },
  // Row 2 (5 cells, offset)
  { initials: "SR", role: "Frontend", college: "IIIT-H", rotate: "rotate-[1deg]" },
  { initials: "NK", role: "ML", college: "IIT-D", vetted: true },
  { initials: "TM", role: "Backend", college: "VIT" },
  { initials: "KP", role: "Mobile", college: "DTU", rotate: "rotate-[-0.5deg]" },
  { initials: "AN", role: "PM", college: "ISB" },
  // Row 3 (4 cells)
  { initials: "RS", role: "Design", college: "Srishti", rotate: "rotate-[-1deg]" },
  { initials: "VG", role: "Data", college: "IIT-M", vetted: true },
  { initials: "MS", role: "DevOps", college: "BITS" },
  { initials: "BP", role: "Frontend", college: "NIT-K", rotate: "rotate-[0.5deg]" },
  // Row 4 (5 cells, offset)
  { initials: "HJ", role: "Backend", college: "IIT-K" },
  { initials: "LP", role: "PM", college: "FMS", rotate: "rotate-[1deg]" },
  { initials: "OA", role: "ML", college: "CMI" },
  { initials: "JR", role: "Data", college: "ISI", rotate: "rotate-[-0.5deg]" },
  { initials: "ES", role: "Design", college: "NID-A" },
]

function HexTile({
  cell,
  dotColor,
  tileBg,
}: {
  cell: HexCell
  dotColor?: string
  tileBg?: string
}) {
  return (
    <div
      className={cn(
        "group relative flex h-[88px] w-[80px] flex-col items-center justify-center px-1 text-center transition-transform duration-200 hover:-translate-y-0.5",
        cell.rotate
      )}
      style={{
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
    >
      <div
        className={cn(
          "absolute inset-0 transition-colors",
          cell.vetted
            ? !tileBg && "bg-[var(--bg-brand-subtle)]"
            : "bg-[var(--bg-surface)] group-hover:bg-[var(--color-neutral-200)]/60"
        )}
        style={cell.vetted && tileBg ? { background: tileBg } : undefined}
      />
      <div className="relative">
        <p
          className={cn(
            "text-sm font-semibold leading-none",
            cell.vetted
              ? "text-[var(--color-primary-700)]"
              : "text-[var(--text-primary)]"
          )}
        >
          {cell.initials}
        </p>
        <p
          className={cn(
            "mt-1 text-[9px] font-medium leading-tight",
            cell.vetted
              ? "text-[var(--color-primary-700)]/80"
              : "text-[var(--text-muted)]"
          )}
        >
          {cell.role}
          <br />
          <span className="opacity-70">{cell.college}</span>
        </p>
        {cell.vetted && (
          <span
            className="absolute -right-1 -top-2 flex size-3.5 items-center justify-center rounded-full text-[var(--text-inverse)] shadow-sm"
            style={{ background: dotColor ?? "var(--color-primary-600)" }}
          >
            <Check size={8} strokeWidth={3} />
          </span>
        )}
      </div>
    </div>
  )
}

export function HeroTalentGrid() {
  const colorIter = useColorIteration()
  // Manual layout: each row is a flex container with negative top margin
  // for hex tessellation. Offset rows shift left by half a hex width.
  const rows: HexCell[][] = [
    CELLS.slice(0, 4),
    CELLS.slice(4, 9),
    CELLS.slice(9, 13),
    CELLS.slice(13, 18),
  ]

  let vettedSeen = 0
  function nextVettedStyling(isVetted: boolean): { dot?: string; bg?: string } {
    if (!isVetted || colorIter !== "multi") return {}
    const idx = vettedSeen % MULTI_VETTED_COLORS.length
    vettedSeen += 1
    return { dot: MULTI_VETTED_COLORS[idx], bg: MULTI_VETTED_BGS[idx] }
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto max-w-md select-none"
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 80% at 50% 45%, black 55%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 90% 80% at 50% 45%, black 55%, transparent 100%)",
      }}
    >
      <div className="pointer-events-auto flex flex-col items-center">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex"
            style={{
              marginTop: rowIndex === 0 ? 0 : -22,
              marginLeft: rowIndex % 2 === 1 ? 0 : 40,
              gap: 4,
            }}
          >
            {row.map((cell, i) => {
              const styling = nextVettedStyling(!!cell.vetted)
              return (
                <HexTile
                  key={`${rowIndex}-${i}`}
                  cell={cell}
                  dotColor={styling.dot}
                  tileBg={styling.bg}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
